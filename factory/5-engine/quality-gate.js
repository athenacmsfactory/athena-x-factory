/**
 * quality-gate.js (CLI)
 * @description Fase 1c — Kwaliteitspoort CLI van de Athena Factory.
 *
 * Gebruik:
 *   node factory/5-engine/quality-gate.js <siteNaam|/pad/naar/site> [opties]
 *
 * Opties:
 *   --skip-lighthouse   Sla de Lighthouse-drempel over (bv. in de autopilot-loop)
 *   --skip-build        Geen pnpm build (dist moet dan al bestaan — bv. ná CI-build)
 *   --skip-install      Geen pnpm install (node_modules moet al bestaan)
 *   --json              Machine-leesbare output
 *
 * Exit-code: 0 = poort gepasseerd, 1 = poort geblokkeerd.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { QualityGate } from './lib/QualityGate.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const flags = {
    json: args.includes('--json'),
    skipLighthouse: args.includes('--skip-lighthouse'),
    skipBuild: args.includes('--skip-build'),
    skipInstall: args.includes('--skip-install')
};
const siteArg = args.find(a => !a.startsWith('--'));

if (!siteArg) {
    console.error('❌ Gebruik: node 5-engine/quality-gate.js <siteNaam|/pad/naar/site> [--skip-lighthouse] [--skip-build] [--skip-install] [--json]');
    process.exit(2);
}

// Geen ConfigManager-import: de CLI blijft daarmee volledig stdlib-only en draait
// ook in de sparse factory-checkout van de vault publisher-workflow (geen node_modules,
// geen dotenv). resolveSiteDir heeft zelf correcte pad-fallbacks (sites/ + vault/).
const gate = new QualityGate(null);

const result = await gate.runGate(siteArg, {
    skipLighthouse: flags.skipLighthouse,
    skipBuild: flags.skipBuild,
    skipInstall: flags.skipInstall
});

if (flags.json) {
    console.log(JSON.stringify(result, null, 2));
} else {
    console.log(`\n🛡️  Kwaliteitspoort — ${path.basename(result.site)}`);
    console.log('─'.repeat(60));
    for (const c of result.checks) {
        const icon = { pass: '✅', fail: '❌', skip: '⏭️' }[c.status];
        console.log(`${icon} ${c.id.padEnd(11)} ${c.name}`);
        if (c.status === 'skip' && typeof c.details === 'string') console.log(`             ⚠️  ${c.details}`);
        if (c.details && typeof c.details === 'object' && c.id === 'lighthouse') {
            const scores = c.details;
            const known = Object.entries(scores).filter(([, v]) => typeof v === 'number');
            if (known.length) console.log(`             ${known.map(([k, v]) => `${k}: ${v}`).join(' · ')}`);
        }
        for (const err of c.errors || []) {
            const msg = typeof err === 'string' ? err : err.message;
            const filePart = (typeof err === 'object' && err.file) ? ` (${path.relative(result.site, err.file)}:${err.line ?? ''})` : '';
            console.log(`             • ${msg}${filePart}`);
        }
    }
    console.log('─'.repeat(60));
    console.log(result.passed
        ? `🟢 POORT GEPASSEERD — site mag gedeplloyd worden.`
        : `🔴 POORT GEBLOKKEERD — deploy afgebroken, fix eerst bovenstaande fouten.`);
}

process.exit(result.passed ? 0 : 1);
