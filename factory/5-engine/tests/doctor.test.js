import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DoctorController } from '../controllers/DoctorController';
import fs from 'fs';
import path from 'path';
import * as child_process from 'child_process';

// Final mock strategy that works with Vitest's CJS/ESM handling of Node built-ins
vi.mock('child_process', () => {
    const mockExecSync = vi.fn();
    return {
        execSync: mockExecSync,
        default: {
            execSync: mockExecSync
        }
    };
});

const POLICY_HYDRATED = JSON.stringify({ globalDefault: 'hydrated' });
const POLICIES_PATH = '/mock/sites/hydration-policies.json';

describe('DoctorController', () => {
    let doctor;
    let mockConfigManager;

    beforeEach(() => {
        vi.restoreAllMocks();
        vi.clearAllMocks();
        
        mockConfigManager = {
            get: vi.fn().mockReturnValue('/mock/sites')
        };
        
        doctor = new DoctorController(mockConfigManager);
    });

    describe('audit', () => {
        it('should return healthy for a valid hydrated site', () => {
            const siteName = 'healthy-site';
            const sitePath = '/mock/sites/healthy-site';
            const dataPath = path.join(sitePath, 'src/data');

            vi.spyOn(fs, 'existsSync').mockImplementation((p) => {
                if (p === sitePath) return true;
                if (p === path.join(sitePath, 'node_modules')) return true;
                if (p === dataPath) return true;
                return false;
            });

            vi.spyOn(fs, 'readdirSync').mockImplementation((p) => {
                if (p === dataPath) return ['content.json'];
                return [];
            });

            vi.spyOn(fs, 'readFileSync').mockImplementation((p) => {
                if (p === POLICIES_PATH) return POLICY_HYDRATED;
                return '{"key": "value"}';
            });

            const report = doctor.audit(siteName);

            expect(report.status).toBe('healthy');
            expect(report.hydration).toBe('hydrated');
            expect(report.policy).toBe('hydrated');
            expect(report.issues).toHaveLength(0);
        });

        it('should report warning if node_modules is missing while policy requires hydration', () => {
            const siteName = 'broken-site';
            const sitePath = '/mock/sites/broken-site';

            vi.spyOn(fs, 'existsSync').mockImplementation((p) => {
                if (p === sitePath) return true;
                if (p === path.join(sitePath, 'node_modules')) return false;
                if (p === path.join(sitePath, 'src/data')) return true;
                return false;
            });

            vi.spyOn(fs, 'readdirSync').mockReturnValue([]);
            vi.spyOn(fs, 'readFileSync').mockReturnValue(POLICY_HYDRATED);

            const report = doctor.audit(siteName);

            expect(report.hydration).toBe('dormant');
            expect(report.status).toBe('warning');
            expect(report.issues).toContain('Policy requires hydration, but node_modules is missing');
        });

        it('should report broken for corrupt JSON files', () => {
            const siteName = 'corrupt-site';

            vi.spyOn(fs, 'existsSync').mockReturnValue(true);
            vi.spyOn(fs, 'readdirSync').mockReturnValue(['invalid.json']);
            vi.spyOn(fs, 'readFileSync').mockReturnValue('{ invalid json }');

            const report = doctor.audit(siteName);

            expect(report.status).toBe('broken');
            expect(report.issues).toContain('Corrupt JSON file: invalid.json');
        });

        it('should report warning for empty JSON files', () => {
            const siteName = 'empty-site';
            const sitePath = '/mock/sites/empty-site';
            const dataPath = path.join(sitePath, 'src/data');

            vi.spyOn(fs, 'existsSync').mockImplementation((p) => {
                if (p === sitePath) return true;
                if (p === path.join(sitePath, 'node_modules')) return true;
                if (p === dataPath) return true;
                return false;
            });

            vi.spyOn(fs, 'readdirSync').mockReturnValue(['empty.json']);
            vi.spyOn(fs, 'readFileSync').mockImplementation((p) => {
                if (p === POLICIES_PATH) return POLICY_HYDRATED;
                return 'null';
            });

            const report = doctor.audit(siteName);

            expect(report.status).toBe('warning');
            expect(report.issues).toContain('Empty JSON file: empty.json');
        });
    });

    describe('heal', () => {
        it('should hydrate if node_modules is missing but policy requires it', async () => {
            const siteName = 'fixable-site';
            const sitePath = '/mock/sites/fixable-site';

            vi.spyOn(fs, 'existsSync').mockImplementation((p) => {
                if (p === sitePath) return true;
                if (p === path.join(sitePath, 'node_modules')) return false;
                if (p === path.join(sitePath, 'src/data')) return true;
                return false;
            });
            vi.spyOn(fs, 'readdirSync').mockReturnValue([]);
            vi.spyOn(fs, 'readFileSync').mockReturnValue(POLICY_HYDRATED);

            const result = await doctor.heal(siteName);

            // Access the mock from the imported module namespace
            expect(child_process.execSync).toHaveBeenCalledWith(
                'pnpm install --no-frozen-lockfile',
                expect.objectContaining({ cwd: sitePath, stdio: 'ignore' })
            );
            expect(result.fixes).toContain('Hydration complete (node_modules installed).');
        });

        it('should not attempt to heal if policy is already met', async () => {
            const siteName = 'perfect-site';
            const sitePath = '/mock/sites/perfect-site';
            
            vi.spyOn(fs, 'existsSync').mockImplementation((p) => {
                if (p === sitePath) return true;
                if (p === path.join(sitePath, 'node_modules')) return true;
                return false;
            });
            vi.spyOn(fs, 'readFileSync').mockReturnValue(POLICY_HYDRATED);
            vi.spyOn(doctor, '_calculateStorageUsage').mockReturnValue(0);

            const result = await doctor.heal(siteName);

            expect(child_process.execSync).not.toHaveBeenCalled();
            expect(result.fixes).toHaveLength(0);
            expect(result.message).toBe('Healed 0 issues.');
        });
    });
});
