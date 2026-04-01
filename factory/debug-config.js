import { AthenaConfigManager } from './5-engine/lib/ConfigManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cm = new AthenaConfigManager();
console.log('--- Athena Config Manager Debug ---');
console.log('Root:', cm.get('paths.root'));
console.log('Sitetypes:', cm.get('paths.sitetypes'));
console.log('---------------------------------');
