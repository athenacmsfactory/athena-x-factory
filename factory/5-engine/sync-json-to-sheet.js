/**
 * @file sync-json-to-sheet.js
 * @description Leest de lokale JSON data van een site en uploadt deze naar de Google Sheet.
 *              Dit is de 'back-sync' die visuele edits permanent maakt in het CMS.
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { AthenaDataManager } from './lib/DataManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// Laad credentials uit .env
dotenv.config({ path: path.join(ROOT, '.env') });

async function run() {
    const projectName = process.argv[2];
    if (!projectName) {
        console.error("Gebruik: node 5-engine/sync-json-to-sheet.js <project-naam>");
        process.exit(1);
    }

    const manager = new AthenaDataManager(ROOT);

    try {
        await manager.syncToSheet(projectName);
    } catch (e) {
        console.error(`❌ Fout: ${e.message}`);
        process.exit(1);
    }
}

run();
