import fs from 'fs';
import path from 'path';

const SITE_NAME = process.argv[2];
if (!SITE_NAME) { console.error('Gebruik: node 6-utilities/check-missing-images.js <site-name>'); process.exit(1); }
const pagesDir = path.join('sites', SITE_NAME, 'public/data/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.json'));

const missing = [];

files.forEach(file => {
    try {
        const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
        const json = JSON.parse(content);
        if (!json.meta?.images || json.meta.images.length === 0) {
            missing.push(file);
        }
    } catch (e) {}
});

console.log(`Pages with missing meta.images: ${missing.length}`);
console.log(missing.join(', '));
