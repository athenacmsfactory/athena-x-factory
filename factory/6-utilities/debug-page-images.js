import fs from 'fs';
import path from 'path';

const SITE_NAME = process.argv[2];
const PAGE = process.argv[3] || 'index';
if (!SITE_NAME) { console.error('Gebruik: node 6-utilities/debug-page-images.js <site-name> [pagina]'); process.exit(1); }
const pagePath = path.join('sites', SITE_NAME, 'public/data/pages', `${PAGE}.json`);
const content = fs.readFileSync(pagePath, 'utf8');
const data = JSON.parse(content);

const images = data.meta?.images || [];
console.log(`Total images in meta: ${images.length}`);

const contentImages = images.filter(img => 
    !img.toLowerCase().includes('logo') && 
    !img.toLowerCase().includes('share') &&
    !img.toLowerCase().includes('banner')
);

console.log(`Content images (filtered): ${contentImages.length}`);
contentImages.forEach(img => console.log(` - ${img}`));

const imagePool = contentImages.length > 0 ? contentImages : images.filter(img => !img.toLowerCase().includes('logo'));
console.log(`Final Image Pool size: ${imagePool.length}`);

// Test fetching the first image
if (imagePool.length > 0) {
    const url = imagePool[0];
    console.log(`Testing fetch for: ${url}`);
    try {
        const res = await fetch(url, { method: 'HEAD' });
        console.log(`Status: ${res.status}`);
        console.log(`Content-Type: ${res.headers.get('content-type')}`);
    } catch (e) {
        console.error("Fetch failed:", e.message);
    }
} else {
    console.log("⚠️ Image pool is empty!");
}
