import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// Load Service Account
const saPath = path.join(ROOT, 'service-account.json');
if (!fs.existsSync(saPath)) {
    console.error("❌ service-account.json not found at " + saPath);
    process.exit(1);
}
const credentials = JSON.parse(fs.readFileSync(saPath, 'utf8'));

// Load Project Constants from .env if possible
import dotenv from 'dotenv';
dotenv.config({ path: path.join(ROOT, '.env') });

const MASTER_TEMPLATE_ID = process.env.MASTER_TEMPLATE_ID || '1av528UWJkQ01ImLluppIIsemyG6U3W_XHdtWozugfaI';
const TARGET_FOLDER_ID = process.env.DRIVE_PROJECTS_FOLDER_ID || '1JWT50eF9otf-eE0ChHDcNkQnr52zwXtB';

async function getSAAuth() {
    const auth = google.auth.fromJSON(credentials);
    auth.scopes = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'];
    return auth;
}

export async function provisionSheetSA(projectName, userEmail = null) {
    console.log(`\n🚀 Start Service Account Provisioning for: ${projectName}`);
    const auth = await getSAAuth();
    const drive = google.drive({ version: 'v3', auth });
    const sheets = google.sheets({ version: 'v4', auth });

    try {
        console.log(`📋 Copying Master Template (${MASTER_TEMPLATE_ID})...`);
        const copyRes = await drive.files.copy({
            fileId: MASTER_TEMPLATE_ID,
            requestBody: {
                name: `Athena Project: ${projectName}`,
                parents: [TARGET_FOLDER_ID]
            }
        });

        const newSheetId = copyRes.data.id;
        const editUrl = `https://docs.google.com/spreadsheets/d/${newSheetId}/edit`;
        console.log(`✅ Sheet Created! ID: ${newSheetId}`);

        // Share with user if email provided
        if (userEmail) {
            console.log(`👤 Sharing with user: ${userEmail}...`);
            await drive.permissions.create({
                fileId: newSheetId,
                requestBody: { role: 'writer', type: 'user', emailAddress: userEmail }
            });
        }

        // Save Linkage
        let siteDir = path.resolve(ROOT, '../sites', projectName);
        const settingsDir = path.join(siteDir, 'project-settings');
        if (!fs.existsSync(settingsDir)) fs.mkdirSync(settingsDir, { recursive: true });

        const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: newSheetId });
        const urlSheetData = {};
        spreadsheet.data.sheets.forEach(s => {
            urlSheetData[s.properties.title] = {
                editUrl: editUrl,
                exportUrl: `https://docs.google.com/spreadsheets/d/${newSheetId}/export?format=tsv&gid=${s.properties.sheetId}`
            };
        });

        fs.writeFileSync(
            path.join(settingsDir, 'url-sheet.json'),
            JSON.stringify(urlSheetData, null, 2)
        );

        console.log(`🎉 Success! Linked project ${projectName} to new sheet.`);
        console.log(`🔗 Edit URL: ${editUrl}`);
        return { spreadsheetId: newSheetId, editUrl };

    } catch (e) {
        console.error("❌ SA Provisioning Failed:", e.message);
        throw e;
    }
}

const args = process.argv.slice(2);
if (args[0]) {
    provisionSheetSA(args[0], args[1])
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
