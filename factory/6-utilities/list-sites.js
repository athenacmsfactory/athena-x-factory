import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sitesDir = path.resolve(__dirname, '../../sites');

if (!fs.existsSync(sitesDir)) {
    console.error("❌ Sites directory not found.");
    process.exit(1);
}

const sites = fs.readdirSync(sitesDir).filter(f => {
    return fs.statSync(path.join(sitesDir, f)).isDirectory() && f !== '.git' && f !== '.gitkeep';
});

console.log(sites.join('\n'));
