import fs from 'fs';
import path from 'path';

const SITE_NAME = process.argv[2];
if (!SITE_NAME) { console.error('Gebruik: node 6-utilities/analyze-section-types.js <site-name>'); process.exit(1); }
const pagesDir = path.join('sites', SITE_NAME, 'public/data/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.json'));

const types = {};

files.forEach(file => {
    try {
        const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
        const json = JSON.parse(content);
        if (json.content && json.content.sections) {
            json.content.sections.forEach(sec => {
                const t = sec.type;
                types[t] = (types[t] || 0) + 1;
            });
        }
    } catch (e) {
        console.error(`Error reading ${file}:`, e.message);
    }
});

console.log("Section Types Found:");
console.table(types);
