import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { QualityGate } from '../lib/QualityGate.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const VALID_HTML = `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="utf-8">
    <title>Test</title>
    <!-- een comment met <div> erin mag geen vals alarm geven -->
</head>
<body>
    <div class="breed">inhoud</div>
    <section class="content" data-x="a > b">
        <img src="logo.svg" alt="logo">
        <svg width="10" height="10"><path d="M0 0"/></svg>
        <script>const html = "</div> in een string";</script>
    </section>
</body>
</html>`;

function makeFixtureSite(dir, { indexHtml = VALID_HTML, withDist = true }) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({
        name: 'fixture-site', type: 'module', scripts: { build: 'vite build' }
    }, null, 2));
    if (withDist) {
        fs.mkdirSync(path.join(dir, 'dist'), { recursive: true });
        // index.html moet >= 500 bytes zijn voor de build-check
        fs.writeFileSync(path.join(dir, 'dist', 'index.html'), indexHtml.padEnd(600, '\n<!-- padding -->'));
    }
    return dir;
}

describe('QualityGate — lintHtmlString (tag-balans)', () => {
    it('geeft geen fouten voor valide, gebalanceerde HTML', () => {
        expect(QualityGate.lintHtmlString(VALID_HTML)).toEqual([]);
    });

    it('detecteert een niet-gesloten <section> (de stille layout-killer)', () => {
        const html = `<body>\n<section class="content">\n<div>tekst</div>\n<footer>hi</footer>\n</body>`;
        const errors = QualityGate.lintHtmlString(html);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(e => e.message.includes('section'))).toBe(true);
    });

    it('detecteert een stray closing tag', () => {
        const errors = QualityGate.lintHtmlString(`<div>ok</div>\n</span>`);
        expect(errors.some(e => e.message.includes('Stray closing tag'))).toBe(true);
    });

    it('detecteert een mismatch in nesting', () => {
        const errors = QualityGate.lintHtmlString(`<div><section>tekst</div></section>`);
        expect(errors.some(e => e.message.includes('Mismatch'))).toBe(true);
    });

    it('accepteert void elements en self-closing SVG zonder fouten', () => {
        const html = `<body><img src="a.png"><br><svg><path d="M0"/><circle cx="1" cy="1" r="1"></circle></svg></body>`;
        expect(QualityGate.lintHtmlString(html)).toEqual([]);
    });

    it('negeert ">" binnen gequote attributen', () => {
        const html = `<div title="a > b" data-y='x > y'>tekst</div>`;
        expect(QualityGate.lintHtmlString(html)).toEqual([]);
    });
});

describe('QualityGate — placeholders', () => {
    let tmp;
    beforeAll(() => { tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qg-ph-')); });
    afterAll(() => { fs.rmSync(tmp, { recursive: true, force: true }); });

    it('vindt onopgeloste {{TEMPLATE_TOKENS}} in dist', () => {
        fs.mkdirSync(path.join(tmp, 'dist'), { recursive: true });
        fs.writeFileSync(path.join(tmp, 'dist', 'index.html'), '<div>{{DATA_LOADING_LOGIC}}</div>');
        fs.writeFileSync(path.join(tmp, 'dist', 'app.js'), 'const x = "{{SECTION_ORDER}}";');
        const hits = QualityGate.findUnresolvedPlaceholders(path.join(tmp, 'dist'));
        expect(hits.map(h => h.placeholder).sort()).toEqual(['{{DATA_LOADING_LOGIC}}', '{{SECTION_ORDER}}']);
    });

    it('geeft geen hits voor schone bestanden', () => {
        fs.mkdirSync(path.join(tmp, 'dist2'), { recursive: true });
        fs.writeFileSync(path.join(tmp, 'dist2', 'index.html'), '<div>schone content</div>');
        expect(QualityGate.findUnresolvedPlaceholders(path.join(tmp, 'dist2'))).toEqual([]);
    });
});

describe('QualityGate — runGate (offline, skip lighthouse)', () => {
    let tmp;
    let gate;
    beforeAll(() => {
        tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qg-gate-'));
        gate = new QualityGate(null);
        // Lighthouse bewust buiten de unit-tests houden
        gate._findLighthouseBin = () => null;
    });
    afterAll(() => { fs.rmSync(tmp, { recursive: true, force: true }); });

    it('passeert de poort voor een site met valide dist (skipBuild + skipLighthouse)', async () => {
        const site = makeFixtureSite(path.join(tmp, 'goede-site'), {});
        const result = await gate.runGate(site, { skipBuild: true, skipLighthouse: true });
        expect(result.passed).toBe(true);
        expect(result.checks.find(c => c.id === 'build').status).toBe('pass');
        expect(result.checks.find(c => c.id === 'lint').status).toBe('pass');
    });

    it('blokkeert de poort bij ongebalanceerde HTML in dist', async () => {
        const site = makeFixtureSite(path.join(tmp, 'kapotte-site'), {
            indexHtml: `<body><section class="content"><div>tekst</div></body>`
        });
        const result = await gate.runGate(site, { skipBuild: true, skipLighthouse: true });
        expect(result.passed).toBe(false);
        const lint = result.checks.find(c => c.id === 'lint');
        expect(lint.status).toBe('fail');
        expect(lint.errors.some(e => e.message.includes('section'))).toBe(true);
    });

    it('blokkeert de poort als er geen dist is', async () => {
        const site = makeFixtureSite(path.join(tmp, 'lege-site'), { withDist: false });
        const result = await gate.runGate(site, { skipBuild: true, skipLighthouse: true });
        expect(result.passed).toBe(false);
        expect(result.checks.find(c => c.id === 'build').status).toBe('fail');
        expect(result.checks.find(c => c.id === 'lint').status).toBe('skip');
    });

    it('respecteert site-specifieke quality-gate.json (skipLighthouse + hogere drempels)', () => {
        const site = makeFixtureSite(path.join(tmp, 'cfg-site'), {});
        fs.writeFileSync(path.join(site, 'quality-gate.json'), JSON.stringify({
            skipLighthouse: true,
            lighthouse: { performance: 90, seo: 70 }
        }));
        const cfg = gate.loadSiteConfig(site);
        expect(cfg.skipLighthouse).toBe(true);
        expect(cfg.lighthouse.performance).toBe(90);
        expect(cfg.lighthouse.seo).toBe(70);
        // niet-overridden drempels vallen terug op de defaults
        expect(cfg.lighthouse.accessibility).toBe(80);
    });

    it('gooit een fout bij een ongeldige quality-gate.json', () => {
        const site = makeFixtureSite(path.join(tmp, 'badcfg-site'), {});
        fs.writeFileSync(path.join(site, 'quality-gate.json'), '{ niet-json');
        expect(() => gate.loadSiteConfig(site)).toThrow(/Ongeldige quality-gate.json/);
    });
});
