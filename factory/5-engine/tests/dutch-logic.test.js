import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FinalizePhase } from '../core/phases/FinalizePhase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Dutch Logic - FinalizePhase', () => {
    const testDir = path.join(__dirname, 'test-project');
    const tplDir = path.join(__dirname, 'test-templates');

    beforeEach(() => {
        fs.rmSync(testDir, { recursive: true, force: true });
        fs.rmSync(tplDir, { recursive: true, force: true });
        fs.mkdirSync(testDir);
        fs.mkdirSync(path.join(tplDir, 'docs'), { recursive: true });
        fs.writeFileSync(
            path.join(tplDir, 'docs', 'client-manual.md'),
            '# Handleiding {{PROJECT_NAME}}\n\nBlueprint: {{BLUEPRINT_NAME}}\n\n{{DYNAMIC_CONTENT}}'
        );
    });

    afterEach(() => {
        fs.rmSync(testDir, { recursive: true, force: true });
        fs.rmSync(tplDir, { recursive: true, force: true });
    });

    it('should generate HANDLEIDING_BEHEER.md with correct placeholders', () => {
        const projectName = 'test-project';
        // Mock the blueprint object that the function actually expects
        const blueprint = {
            blueprint_name: 'test-blueprint',
            data_structure: [
                {
                    table_name: 'products',
                    columns: [
                        { name: 'name', description: 'De productnaam.' },
                        { name: 'price', description: 'De prijs in euros.' }
                    ]
                }
            ]
        };

        // Call the phase with the correct context structure
        const ctx = {
            projectDir: testDir,
            config: { projectName },
            blueprint,
            configManager: {
                get: (key) => (key === 'paths.templates' ? tplDir : '/mock')
            }
        };
        new FinalizePhase().generateInstructions(ctx);

        const manualPath = path.join(testDir, 'HANDLEIDING_BEHEER.md');
        expect(fs.existsSync(manualPath)).toBe(true);

        const content = fs.readFileSync(manualPath, 'utf8');
        // Check for the replaced values
        expect(content).toContain(projectName); // {{PROJECT_NAME}}
        expect(content).toContain(blueprint.blueprint_name); // {{BLUEPRINT_NAME}}
        expect(content).toContain('De productnaam.'); // Dynamic content from data_structure
        expect(content).toContain('### Tabblad: `products`');
        expect(content).not.toContain('{{PROJECT_NAME}}');
        expect(content).not.toContain('{{DYNAMIC_CONTENT}}');
    });
});
