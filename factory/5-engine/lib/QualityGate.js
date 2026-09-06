/**
 * QualityGate.js
 * @description Fase 1c — De kwaliteitspoort van de Athena Factory.
 * Lint + build-check + Lighthouse-drempel, uitvoerbaar vóór elke (auto)deploy.
 * De autopilot (AutomationController) en de deploy-wizard passeren deze poort,
 * zodat een kapotte build of stille HTML-fout nooit versterkt wordt.
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const FACTORY_ROOT = path.resolve(__dirname, '../..');

const VOID_ELEMENTS = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

const PLACEHOLDER_REGEX = /\{\{\s*[A-Z][A-Z0-9_]*\s*\}\}/g;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.map': 'application/json',
    '.txt': 'text/plain; charset=utf-8'
};

const DEFAULT_THRESHOLDS = {
    performance: 50,
    accessibility: 80,
    'best-practices': 75,
    seo: 80
};

export class QualityGate {
    constructor(configManager) {
        this.configManager = configManager;
        this.defaults = this._loadDefaults();
    }

    _loadDefaults() {
        const defaultsPath = path.join(FACTORY_ROOT, 'config', 'quality-gate.defaults.json');
        if (fs.existsSync(defaultsPath)) {
            try {
                return JSON.parse(fs.readFileSync(defaultsPath, 'utf8'));
            } catch (e) {
                console.warn(`⚠️ Kon quality-gate.defaults.json niet lezen (${e.message}); fabrieksdefaults gebruikt.`);
            }
        }
        return { lighthouse: DEFAULT_THRESHOLDS };
    }

    /**
     * Site-specifieke config (quality-gate.json in de site-root) merge met de defaults.
     */
    loadSiteConfig(sitePath) {
        const cfgPath = path.join(sitePath, 'quality-gate.json');
        const cfg = {
            lighthouse: { ...this.defaults.lighthouse },
            skipLighthouse: false,
            lintIgnore: []
        };
        if (fs.existsSync(cfgPath)) {
            try {
                const siteCfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
                if (siteCfg.lighthouse) cfg.lighthouse = { ...cfg.lighthouse, ...siteCfg.lighthouse };
                if (siteCfg.skipLighthouse) cfg.skipLighthouse = true;
                if (Array.isArray(siteCfg.lintIgnore)) cfg.lintIgnore = siteCfg.lintIgnore;
            } catch (e) {
                throw new Error(`Ongeldige quality-gate.json in ${sitePath}: ${e.message}`);
            }
        }
        return cfg;
    }

    /**
     * Rond een naam of absoluut pad af naar een bestaande site-map:
     * (1) absoluut pad, (2) <athena>/sites/<naam>, (3) <athena>/../vault/<naam>.
     */
    resolveSiteDir(nameOrPath) {
        const candidates = [];
        if (path.isAbsolute(nameOrPath)) {
            candidates.push(nameOrPath);
        } else {
            const sitesDir = this.configManager?.get('paths.sites') || path.join(FACTORY_ROOT, '../sites');
            const vaultDir = this.configManager?.get('paths.vault') || path.join(FACTORY_ROOT, '../../vault');
            candidates.push(path.join(sitesDir, nameOrPath), path.join(vaultDir, nameOrPath));
        }
        for (const c of candidates) {
            if (fs.existsSync(path.join(c, 'package.json')) || fs.existsSync(path.join(c, 'index.html'))) return path.resolve(c);
        }
        throw new Error(`Site niet gevonden: '${nameOrPath}'. Gezocht in: ${candidates.join(', ')}`);
    }

    // ------------------------------------------------------------------
    // CHECK 1: LINT (tag-balans + placeholders in de gebouwde HTML)
    // ------------------------------------------------------------------

    /**
     * Tag-balans-check voor één HTML-string (zie les: html_lint_voorkomt_stille_layout_bugs).
     * Mini-tokenizer die quotes in attributen respecteert en script/style-rawcontent stript.
     * Lineaire single-pass: starttags op de stack, endtags poppen (met mis-match-reparatie).
     * @returns {Array<{line, message}>}
     */
    static lintHtmlString(html) {
        const errors = [];
        // 1. Comments stripen
        let src = html.replace(/<!--[\s\S]*?-->/g, '');
        // 2. script/style-rawcontent strippen (JS met '</div>' in strings mag geen vals alarm geven)
        src = src.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, (m) => m.replace(/[\s\S]*$/, ''));

        const balance = [];
        let i = 0;
        let line = 1;
        while (i < src.length) {
            if (src[i] === '\n') line++;
            if (src[i] !== '<') { i++; continue; }

            const rest = src.slice(i);

            // --- Endtag ---
            const endMatch = /^<\s*\/\s*([a-zA-Z][a-zA-Z0-9-]*)\s*>/.exec(rest);
            if (endMatch) {
                const tag = endMatch[1].toLowerCase();
                if (!VOID_ELEMENTS.has(tag)) {
                    const top = balance[balance.length - 1];
                    if (!top) {
                        errors.push({ line, message: `Stray closing tag </${tag}> zonder bijbehorende opening.` });
                    } else if (top.tag !== tag) {
                        errors.push({ line, message: `Mismatch: verwacht </${top.tag}> (regel ${top.line}), vond </${tag}>.` });
                        // Terugspringen naar de juiste endtag zodat 1 fout niet 20 nalopen geeft
                        const idx = balance.map(b => b.tag).lastIndexOf(tag);
                        if (idx !== -1) balance.length = idx;
                        else balance.pop();
                    } else {
                        balance.pop();
                    }
                }
                i += endMatch[0].length;
                continue;
            }

            // --- Starttag ---
            const nameMatch = /^<\s*([a-zA-Z][a-zA-Z0-9-]*)/.exec(rest);
            if (!nameMatch) { i++; continue; }
            const tag = nameMatch[1].toLowerCase();
            if (VOID_ELEMENTS.has(tag)) { i += nameMatch[0].length; continue; }

            // Attributen scannen tot unquoted '>' of '/>' (quotes respecteren)
            let j = i + nameMatch[0].length;
            let quote = null;
            let selfClosing = false;
            while (j < src.length) {
                const ch = src[j];
                if (quote) {
                    if (ch === quote) quote = null;
                } else if (ch === '"' || ch === "'") {
                    quote = ch;
                } else if (ch === '>') {
                    break;
                } else if (ch === '/' && src[j + 1] === '>') {
                    selfClosing = true;
                    break;
                }
                if (ch === '\n') line++;
                j++;
            }
            i = j + 1;
            if (!selfClosing) balance.push({ tag, line });
        }

        for (const open of balance) {
            errors.push({ line: open.line, message: `Niet-gesloten tag <${open.tag}> (geopend op regel ${open.line}).` });
        }
        return errors;
    }

    /**
     * Zoek alle .html-bestanden in een map (recursief, max. 100 bestanden).
     */
    static findHtmlFiles(dir, acc = [], depth = 0) {
        if (acc.length >= 100 || depth > 8) return acc;
        let entries;
        try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
        for (const e of entries) {
            if (e.name.startsWith('.') || e.name === 'node_modules') continue;
            const full = path.join(dir, e.name);
            if (e.isDirectory()) QualityGate.findHtmlFiles(full, acc, depth + 1);
            else if (e.isFile() && e.name.endsWith('.html')) acc.push(full);
        }
        return acc;
    }

    /**
     * Placeholder-scan ({{TEMPLATE_TOKEN}}) in html/css/js van de dist.
     */
    static findUnresolvedPlaceholders(distDir) {
        const hits = [];
        const walk = (dir, depth = 0) => {
            if (depth > 6) return;
            let entries;
            try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
            for (const e of entries) {
                const full = path.join(dir, e.name);
                if (e.isDirectory()) { if (!e.name.startsWith('.')) walk(full, depth + 1); continue; }
                if (!/\.(html|css|js|mjs)$/.test(e.name)) continue;
                if (e.name.endsWith('.min.js')) continue;
                let content;
                try { content = fs.readFileSync(full, 'utf8'); } catch { continue; }
                const seen = new Set();
                for (const m of content.matchAll(PLACEHOLDER_REGEX)) {
                    if (!seen.has(m[0])) { seen.add(m[0]); hits.push({ file: full, placeholder: m[0] }); }
                }
            }
        };
        walk(distDir);
        return hits;
    }

    async runLint(sitePath, lintIgnore = []) {
        const distDir = path.join(sitePath, 'dist');
        const errors = [];
        if (!fs.existsSync(distDir)) {
            return { ok: false, errors: [{ message: `Geen dist/ map in ${sitePath} — draai eerst een build.` }] };
        }
        const htmlFiles = QualityGate.findHtmlFiles(distDir)
            .filter(f => !lintIgnore.some(p => f.includes(p)));
        if (htmlFiles.length === 0) {
            errors.push({ message: `Geen .html-bestanden gevonden in ${distDir}.` });
        }
        for (const file of htmlFiles) {
            const html = fs.readFileSync(file, 'utf8');
            for (const err of QualityGate.lintHtmlString(html)) {
                errors.push({ file, ...err });
            }
        }
        for (const p of QualityGate.findUnresolvedPlaceholders(distDir)) {
            errors.push({ file: p.file, message: `Onopgeloste template-placeholder ${p.placeholder}.` });
        }
        return { ok: errors.length === 0, errors };
    }

    // ------------------------------------------------------------------
    // CHECK 2: BUILD (install + vite build + dist-verificatie)
    // ------------------------------------------------------------------

    runBuildCheck(sitePath, { skipBuild = false, skipInstall = false, timeoutMs = 300000 } = {}) {
        if (!fs.existsSync(path.join(sitePath, 'package.json'))) {
            return { ok: false, error: `Geen package.json in ${sitePath} — geen bouwbare site.` };
        }
        if (!skipBuild) {
            try {
                if (!skipInstall && !fs.existsSync(path.join(sitePath, 'node_modules'))) {
                    console.log(`💧 node_modules ontbreekt, eerst pnpm install...`);
                    execSync('pnpm install --no-frozen-lockfile', { cwd: sitePath, stdio: 'inherit', timeout: timeoutMs });
                }
                console.log(`🏗️ Building site: ${path.basename(sitePath)}...`);
                execSync('pnpm build', { cwd: sitePath, stdio: 'inherit', timeout: timeoutMs });
            } catch (e) {
                return { ok: false, error: `Build mislukt: ${e.message}` };
            }
        }
        const distDir = path.join(sitePath, 'dist');
        const indexPath = path.join(distDir, 'index.html');
        if (!fs.existsSync(distDir)) {
            return { ok: false, error: `dist/ bestaat niet na build.` };
        }
        if (!fs.existsSync(indexPath)) {
            return { ok: false, error: `dist/index.html bestaat niet na build.` };
        }
        const size = fs.statSync(indexPath).size;
        if (size < 500) {
            return { ok: false, error: `dist/index.html is verdacht klein (${size} bytes < 500).` };
        }
        return { ok: true };
    }

    // ------------------------------------------------------------------
    // CHECK 3: LIGHTHOUSE (drempels tegen een lokaal geserveerde dist)
    // ------------------------------------------------------------------

    _findLighthouseBin() {
        const local = path.join(FACTORY_ROOT, 'node_modules', '.bin', 'lighthouse');
        if (fs.existsSync(local)) return local;
        try {
            const which = execSync('which lighthouse', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
            if (which) return which;
        } catch { /* niet op PATH */ }
        return null;
    }

    _findChromeBin() {
        if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
        for (const bin of ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser']) {
            if (fs.existsSync(bin)) return bin;
        }
        return null;
    }

    /**
     * Detecteer de Vite `base` van een site (bv. '/kdclaw-premium-v9/' voor GitHub Pages).
     * Sites met een subpath-base moeten ook lokaal onder dat pad geserveerd worden,
     * anders 404-en de assets en meet Lighthouse een lege pagina (NO_FCP).
     */
    static detectViteBase(sitePath) {
        const viteCfg = path.join(sitePath, 'vite.config.js');
        if (!fs.existsSync(viteCfg)) return null;
        const m = fs.readFileSync(viteCfg, 'utf8').match(/base\s*:\s*['"`]([^'"`]*)['"`]/);
        const base = m?.[1];
        if (!base || base === '/' || base === './') return null;
        return base.startsWith('/') ? base : `/${base}`;
    }

    _startStaticServer(distDir, basePath = null) {
        return new Promise((resolve, reject) => {
            const server = http.createServer((req, res) => {
                let urlPath = decodeURIComponent(req.url.split('?')[0]);
                // Subpath-base (GitHub Pages) strippen zodat assets gevonden worden
                if (basePath && urlPath.startsWith(basePath)) {
                    urlPath = urlPath.slice(basePath.length) || '/';
                }
                let filePath = path.join(distDir, urlPath);
                if (!filePath.startsWith(distDir)) { res.writeHead(403); res.end(); return; }
                if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
                    filePath = path.join(distDir, 'index.html'); // SPA-fallback
                }
                if (!fs.existsSync(filePath)) { res.writeHead(404); res.end('Not found'); return; }
                const ext = path.extname(filePath).toLowerCase();
                res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
                fs.createReadStream(filePath).pipe(res);
            });
            server.on('error', reject);
            server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
        });
    }

    async runLighthouse(sitePath, thresholds, { timeoutMs = 120000 } = {}) {
        const distDir = path.join(sitePath, 'dist');
        if (!fs.existsSync(distDir)) {
            return { status: 'fail', errors: ['Geen dist/ om Lighthouse tegen te draaien.'] };
        }
        const lighthouseBin = this._findLighthouseBin();
        const chromeBin = this._findChromeBin();
        if (!lighthouseBin || !chromeBin) {
            return { status: 'skip', reason: !lighthouseBin ? 'lighthouse CLI niet gevonden' : 'geen Chrome/Chromium binary gevonden' };
        }

        const basePath = QualityGate.detectViteBase(sitePath);
        const { server, port } = await this._startStaticServer(distDir, basePath);
        const reportFile = path.join(distDir, '..', `.lighthouse-report-${Date.now()}.json`);
        try {
            const url = `http://127.0.0.1:${port}${basePath || '/'}`;
            const args = [
                url,
                '--output=json',
                `--output-path=${reportFile}`,
                '--quiet',
                '--only-categories=performance,accessibility,best-practices,seo',
                `--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage --disable-gpu`,
                `--chrome-path=${chromeBin}`
            ];

            const exitCode = await new Promise((resolve) => {
                const proc = spawn(lighthouseBin, args, { stdio: ['ignore', 'ignore', 'inherit'] });
                const timer = setTimeout(() => { proc.kill('SIGKILL'); resolve(124); }, timeoutMs);
                proc.on('exit', (code) => { clearTimeout(timer); resolve(code ?? 1); });
                proc.on('error', () => { clearTimeout(timer); resolve(1); });
            });

            if (exitCode !== 0) {
                return { status: 'fail', errors: [`Lighthouse-exitcode ${exitCode}${exitCode === 124 ? ' (timeout)' : ''}.`] };
            }

            const report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
            const scores = {};
            const failures = [];
            for (const [cat, threshold] of Object.entries(thresholds)) {
                const category = report.categories?.[cat];
                const score = category?.score;
                if (typeof score !== 'number') {
                    failures.push(`${cat}: geen score (pagina-error of categorie niet gerund).`);
                    scores[cat] = null;
                    continue;
                }
                const pct = Math.round(score * 100);
                scores[cat] = pct;
                if (pct < threshold) failures.push(`${cat}: ${pct} < drempel ${threshold}.`);
            }
            return failures.length
                ? { status: 'fail', scores, errors: failures }
                : { status: 'pass', scores };
        } finally {
            try { server.close(); } catch { /* noop */ }
            try { if (fs.existsSync(reportFile)) fs.rmSync(reportFile); } catch { /* noop */ }
        }
    }

    // ------------------------------------------------------------------
    // DE POORT
    // ------------------------------------------------------------------

    /**
     * Draait de volledige kwaliteitspoort voor een site.
     * @param {string} sitePath - site-map (of naam via resolveSiteDir)
     * @param {object} opts - { skipBuild, skipInstall, skipLighthouse, lighthouseTimeoutMs }
     * @returns {{passed: boolean, site: string, checks: Array}}
     */
    async runGate(sitePath, opts = {}) {
        const site = this.resolveSiteDir(sitePath);
        const cfg = this.loadSiteConfig(site);
        const checks = [];

        // 1. Build
        const build = this.runBuildCheck(site, {
            skipBuild: opts.skipBuild === true,
            skipInstall: opts.skipInstall === true
        });
        checks.push({
            id: 'build',
            name: 'Build-check (pnpm build + dist-verificatie)',
            status: build.ok ? 'pass' : 'fail',
            details: build.ok ? { dist: path.join(site, 'dist') } : build,
            errors: build.ok ? null : [build.error]
        });

        // 2. Lint (alleen zinvol als er een dist is)
        if (fs.existsSync(path.join(site, 'dist'))) {
            const lint = await this.runLint(site, cfg.lintIgnore);
            checks.push({
                id: 'lint',
                name: 'HTML-lint (tag-balans + placeholders)',
                status: lint.ok ? 'pass' : 'fail',
                details: lint.ok ? { htmlFiles: QualityGate.findHtmlFiles(path.join(site, 'dist')).length } : {},
                errors: lint.ok ? null : lint.errors
            });
        } else {
            checks.push({ id: 'lint', name: 'HTML-lint (tag-balans + placeholders)', status: 'skip', details: 'geen dist/', errors: null });
        }

        // 3. Lighthouse
        if (opts.skipLighthouse === true || cfg.skipLighthouse) {
            checks.push({ id: 'lighthouse', name: 'Lighthouse-drempels', status: 'skip', details: 'expliciet overgeslagen', errors: null });
        } else {
            const lh = await this.runLighthouse(site, cfg.lighthouse, { timeoutMs: opts.lighthouseTimeoutMs || 120000 });
            if (lh.status === 'skip') {
                checks.push({ id: 'lighthouse', name: 'Lighthouse-drempels', status: 'skip', details: lh.reason, errors: null });
            } else {
                checks.push({
                    id: 'lighthouse',
                    name: `Lighthouse-drempels (perf ≥ ${cfg.lighthouse.performance}, a11y ≥ ${cfg.lighthouse.accessibility}, bp ≥ ${cfg.lighthouse['best-practices']}, seo ≥ ${cfg.lighthouse.seo})`,
                    status: lh.status,
                    details: lh.scores || {},
                    errors: lh.errors || null
                });
            }
        }

        const passed = checks.every(c => c.status === 'pass' || c.status === 'skip');
        return { passed, site, checks };
    }

    /**
     * Compacte samenvatting voor logs.
     */
    static summarize(result) {
        const icon = { pass: '✅', fail: '❌', skip: '⏭️' };
        return result.checks.map(c => `${icon[c.status]} ${c.id}: ${c.status}`).join('  ');
    }
}

export default QualityGate;
