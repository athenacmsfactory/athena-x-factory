import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { AthenaConfigManager } from '../lib/ConfigManager.js';
import { createProject } from '../core/factory.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ATHENA_ROOT = path.resolve(__dirname, '../../..');
const SITE = 'ci-e2e-smoke';

let workDir;
let siteDir;
let cm;
let portsBackup = null;

beforeAll(() => {
    workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'athena-e2e-'));
    cm = new AthenaConfigManager(ATHENA_ROOT);
    cm.config.paths.sites = workDir;
    cm.config.paths.input = path.join(workDir, 'input');
    const portsPath = path.join(ATHENA_ROOT, 'factory/config/site-ports.json');
    if (fs.existsSync(portsPath)) portsBackup = fs.readFileSync(portsPath, 'utf8');
});

afterAll(() => {
    const portsPath = path.join(ATHENA_ROOT, 'factory/config/site-ports.json');
    if (portsBackup !== null) fs.writeFileSync(portsPath, portsBackup);
    fs.rmSync(workDir, { recursive: true, force: true });
});

describe('E2E: factory pipeline (blueprint -> site -> vite build)', () => {
    it('genereert een volledige site via alle 5 fasen (offline, geen Google Sheets)', async () => {
        await createProject({
            projectName: SITE,
            track: 'unified',
            siteType: 'professional-service-provider',
            siteModel: 'SPA',
            layoutName: 'standard',
            blueprintFile: 'professional-service-provider.json',
            styleName: 'corporate',
            autoSheet: false
        }, cm);

        siteDir = path.join(workDir, SITE);

        const required = [
            'package.json',
            'pnpm-workspace.yaml',
            'vite.config.js',
            'index.html',
            'vendor/athena-runtime-0.1.0.tgz',
            'src/App.jsx',
            'src/main.jsx',
            'src/index.css',
            'src/corporate.css',
            'src/data/all_data.json',
            'src/data/schema.json',
            'src/data/section_order.json',
            'src/components/Section.jsx',
            'src/components/Header.jsx',
            'public/sitemap.xml',
            'public/robots.txt',
            '.github/workflows/deploy.yml',
            '.gitignore',
            'README.md'
        ];
        required.forEach(f => {
            expect(fs.existsSync(path.join(siteDir, f)), `missing: ${f}`).toBe(true);
        });

        // Fase 1b — gedeelde runtime: geen component-kopieën meer, maar dunne shims
        expect(fs.existsSync(path.join(siteDir, 'fetch-data.js'))).toBe(false);
        expect(fs.existsSync(path.join(siteDir, 'mapper.js'))).toBe(false);

        const sitePkg = JSON.parse(fs.readFileSync(path.join(siteDir, 'package.json'), 'utf8'));
        expect(sitePkg.dependencies['@athena/runtime']).toMatch(/^file:vendor\/athena-runtime-\d+\.\d+\.\d+\.tgz$/);
        expect(sitePkg.scripts['fetch-data']).toBe('athena-fetch-data');

        const heroShim = fs.readFileSync(path.join(siteDir, 'src/components/Hero.jsx'), 'utf8');
        expect(heroShim).toContain("@athena/runtime/legos/Common/HeroLegoV9.js");
        const styleShim = fs.readFileSync(path.join(siteDir, 'src/components/StyleContext.jsx'), 'utf8');
        expect(styleShim).toContain("export *");
        expect(fs.readFileSync(path.join(siteDir, 'pnpm-workspace.yaml'), 'utf8')).toContain('esbuild: true');

        const mainJsx = fs.readFileSync(path.join(siteDir, 'src/main.jsx'), 'utf8');
        expect(mainJsx).not.toContain('dock-connector');
        expect(mainJsx).not.toContain('{{DATA_LOADING_LOGIC}}');

        const allData = JSON.parse(fs.readFileSync(path.join(siteDir, 'src/data/all_data.json'), 'utf8'));
        expect(Object.keys(allData).length).toBeGreaterThan(5);

        const schema = JSON.parse(fs.readFileSync(path.join(siteDir, 'src/data/schema.json'), 'utf8'));
        expect(schema.data_structure.length).toBeGreaterThan(0);
    }, 120000);

    it.skipIf(process.env.ATHENA_E2E_FAST === '1')('installeert en buildt de gegenereerde site (deploy dry-run)', () => {
        execSync('pnpm install --no-frozen-lockfile', { cwd: siteDir, stdio: 'pipe' });
        execSync('pnpm build', { cwd: siteDir, stdio: 'pipe' });
        expect(fs.existsSync(path.join(siteDir, 'dist/index.html'))).toBe(true);
    }, 600000);
});
