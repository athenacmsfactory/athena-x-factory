// @athena/runtime — sync-runtime utility (Fase 1b)
// Packs de gedeelde runtime-package en vendort de tarball in alle sites,
// zodat een engine-update met één commandaatje doorwerkt op elke site.
//
// Gebruik (vanuit factory/):
//   node 6-utilities/sync-runtime.js                 # actieve sites (sites/*)
//   node 6-utilities/sync-runtime.js --vault         # ook parked sites (../../vault/*)
//   node 6-utilities/sync-runtime.js --paths a,b     # expliciete site-paden
//   node 6-utilities/sync-runtime.js --build         # elke gesyncte site ook herbouwen
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FACTORY = path.resolve(__dirname, '..');          // factory/
const ATHENA = path.resolve(FACTORY, '..');             // athena/
const RUNTIME = path.join(FACTORY, 'packages/runtime');

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => {
    const i = args.indexOf(name);
    return i >= 0 && args[i + 1] ? args[i + 1].split(',').map(p => path.resolve(p.trim())) : null;
};

function packRuntime() {
    const pkgJson = JSON.parse(fs.readFileSync(path.join(RUNTIME, 'package.json'), 'utf8'));
    const tarName = `athena-runtime-${pkgJson.version}.tgz`;
    console.log(`📦 Packing @athena/runtime@${pkgJson.version}...`);
    execSync('pnpm pack', { cwd: RUNTIME, stdio: 'inherit' }); // prepack -> build
    return { tarName, tarPath: path.join(RUNTIME, tarName), version: pkgJson.version };
}

function collectSites() {
    const sites = [];
    const explicit = opt('--paths');
    if (explicit) return explicit;
    const activeDir = path.join(FACTORY, 'sites');
    if (fs.existsSync(activeDir)) {
        sites.push(...fs.readdirSync(activeDir)
            .filter(f => fs.statSync(path.join(activeDir, f)).isDirectory())
            .map(f => path.join(activeDir, f)));
    }
    if (flag('--vault')) {
        const vaultDir = path.join(ATHENA, '..', 'vault');
        if (fs.existsSync(vaultDir)) {
            sites.push(...fs.readdirSync(vaultDir)
                .filter(f => fs.statSync(path.join(vaultDir, f)).isDirectory())
                .map(f => path.join(vaultDir, f)));
        }
    }
    return sites;
}

function syncSite(siteDir, { tarName, tarPath, version }) {
    const name = path.basename(siteDir);
    const pkgPath = path.join(siteDir, 'package.json');
    if (!fs.existsSync(pkgPath)) {
        console.log(`⏭️  ${name}: geen package.json — skipped.`);
        return false;
    }
    let pkg;
    try { pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')); }
    catch (e) { console.error(`❌ ${name}: package.json unparsable — skipped.`); return false; }

    const vendorDir = path.join(siteDir, 'vendor');
    fs.mkdirSync(vendorDir, { recursive: true });

    // Oude runtime-tarballs opruimen, nieuwe plaatsen
    for (const f of fs.readdirSync(vendorDir)) {
        if (/^athena-runtime-.*\.tgz$/.test(f) && f !== tarName) fs.rmSync(path.join(vendorDir, f));
    }
    fs.copyFileSync(tarPath, path.join(vendorDir, tarName));

    // package.json bijwerken
    pkg.dependencies = pkg.dependencies || {};
    pkg.dependencies['@athena/runtime'] = `file:vendor/${tarName}`;
    if (pkg.scripts && pkg.scripts['fetch-data'] === 'node fetch-data.js') {
        pkg.scripts['fetch-data'] = 'athena-fetch-data';
    }
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

    // Legacy root-kopieën opruimen (de bin vervangt ze)
    for (const legacy of ['fetch-data.js', 'mapper.js']) {
        const p = path.join(siteDir, legacy);
        if (fs.existsSync(p)) fs.rmSync(p);
    }

    console.log(`✅ ${name}: @athena/runtime@${version} vendored.`);
    return true;
}

function buildSite(siteDir) {
    const name = path.basename(siteDir);
    try {
        execSync('pnpm install --no-frozen-lockfile', { cwd: siteDir, stdio: 'pipe' });
        execSync('pnpm build', { cwd: siteDir, stdio: 'pipe' });
        console.log(`🏗️  ${name}: build OK.`);
    } catch (e) {
        console.error(`❌ ${name}: build FAILED — ${e.message.split('\n').pop()}`);
        process.exitCode = 1;
    }
}

const { tarName, tarPath, version } = packRuntime();
const sites = collectSites();
console.log(`🎯 ${sites.length} site(s) om te syncen met @athena/runtime@${version}...\n`);

let synced = 0;
for (const siteDir of sites) {
    if (syncSite(siteDir, { tarName, tarPath, version })) {
        synced++;
        if (flag('--build')) buildSite(siteDir);
    }
}

console.log(`\n🏁 ${synced}/${sites.length} sites gesynct${flag('--build') ? ' en gebouwd' : ''}.`);
console.log('   Vergeet niet de site-repo te committen/pushen zodat deploy.yml de nieuwe tarball meeneemt.');
