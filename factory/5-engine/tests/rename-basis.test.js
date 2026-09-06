import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { InitializePhase } from '../core/phases/InitializePhase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Basis Rename Refactoring', () => {
    const root = path.join(__dirname, 'test-rename-basis');
    const sitesDir = path.join(root, 'sites');
    const sitetypesDir = path.join(root, 'sitetypes');
    const inputDir = path.join(root, 'input');
    const templatesDir = path.join(root, 'templates');

    const configManager = {
        get: (key) => ({
            'paths.sites': sitesDir,
            'paths.sitetypes': sitetypesDir,
            'paths.input': inputDir,
            'paths.templates': templatesDir
        }[key])
    };

    const writeBlueprint = (blueprint) => {
        const blueprintDir = path.join(sitetypesDir, 'webshop', 'blueprint');
        fs.mkdirSync(blueprintDir, { recursive: true });
        fs.writeFileSync(path.join(blueprintDir, 'test.json'), JSON.stringify(blueprint));
    };

    const buildCtx = () => ({
        config: {
            projectName: 'test-project',
            siteType: 'webshop',
            layoutName: 'standard',
            siteModel: 'SPA',
            blueprintFile: 'test.json',
            styleName: 'modern.css',
            editorStrategy: 'editor'
        },
        configManager,
        safeName: 'test-project',
        projectDir: path.join(sitesDir, 'test-project'),
        tplRoot: templatesDir
    });

    beforeEach(() => {
        fs.rmSync(root, { recursive: true, force: true });
        [sitesDir, sitetypesDir, inputDir, templatesDir].forEach(d => fs.mkdirSync(d, { recursive: true }));
    });

    afterEach(() => {
        fs.rmSync(root, { recursive: true, force: true });
    });

    it('should default PRIMARY_TABLE_NAME to "basis" when data_structure is empty', async () => {
        writeBlueprint({
            version: '2.0',
            blueprint_name: 'test-bp',
            sections: [],
            data_structure: []
        });
        const ctx = buildCtx();

        await new InitializePhase().execute(ctx);

        expect(ctx.engine.variables.PRIMARY_TABLE_NAME).toBe('basis');
    });

    it('should use the first table name as PRIMARY_TABLE_NAME', async () => {
        writeBlueprint({
            version: '2.0',
            blueprint_name: 'test-bp',
            sections: [{ id: 'products' }],
            data_structure: [{ table_name: 'products', columns: [{ name: 'name' }] }]
        });
        const ctx = buildCtx();

        await new InitializePhase().execute(ctx);

        expect(ctx.engine.variables.PRIMARY_TABLE_NAME).toBe('products');
    });
});
