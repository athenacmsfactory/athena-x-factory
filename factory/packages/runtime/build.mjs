// @athena/runtime — build script
// Compileert src/ per-file naar dist/ (ESM, jsx: automatic).
// - Componenten (legos/contexts/components) → platform browser, React extern.
// - CLI (cli/) → platform node, csvtojson extern.
// esbuild herschrijft relatieve imports tussen entry points naar de dist-locaties;
// daarna krijgen extensionless relatieve imports expliciet '.js' mee, zodat de
// output ook in browser-ESM (Vite dev, linked packages) correct resolveert.
import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');

function collectEntries(dir, filter) {
    const out = [];
    const walk = (d) => {
        for (const f of fs.readdirSync(d, { withFileTypes: true })) {
            const p = path.join(d, f.name);
            if (f.isDirectory()) walk(p);
            else if (/\.(jsx?|mjs)$/.test(f.name) && (!filter || filter(p))) out.push(p);
        }
    };
    walk(dir);
    return out;
}

fs.rmSync(DIST, { recursive: true, force: true });

const cliEntries = collectEntries(path.join(SRC, 'cli'));
const uiEntries = collectEntries(SRC, (p) => !p.startsWith(path.join(SRC, 'cli')));

const shared = {
    format: 'esm',
    outbase: SRC,
    outdir: DIST,
    bundle: false, // bare imports (react, csvtojson, …) blijven onaangeroerd staan
    logLevel: 'info',
    target: 'es2022',
};

await build({
    ...shared,
    entryPoints: uiEntries,
    platform: 'browser',
    jsx: 'automatic',
});

await build({
    ...shared,
    entryPoints: cliEntries,
    platform: 'node',
});

// Post-processing: extensieloze relatieve imports -> '.js'
const fixExtensions = (dir) => {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, f.name);
        if (f.isDirectory()) { fixExtensions(p); continue; }
        if (!/\.(m?js)$/.test(f.name)) continue;
        let content = fs.readFileSync(p, 'utf8');
        const rewritten = content.replace(/(from\s+['"])(\.\.?\/[^'"]+?)(['"])/g, (m, pre, spec, post) => {
            if (/\.(js|mjs|json|css)$/.test(spec)) return m;
            const target = path.resolve(path.dirname(p), spec);
            if (fs.existsSync(target + '.js') || fs.existsSync(target + '.mjs')) return pre + spec + '.js' + post;
            return m;
        });
        if (rewritten !== content) fs.writeFileSync(p, rewritten);
    }
};
fixExtensions(DIST);

console.log('✅ @athena/runtime built → dist/');
