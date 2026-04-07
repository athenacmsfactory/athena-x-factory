import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateAllSites() {
    const root = path.resolve(__dirname, '../..');
    const sitesDir = path.join(root, 'sites');
    const factoryDir = path.join(root, 'factory');
    const TPL = path.join(factoryDir, '2-templates');

    if (!fs.existsSync(sitesDir)) {
        console.error("❌ Sites directory not found at:", sitesDir);
        return;
    }

    const sites = fs.readdirSync(sitesDir).filter(f => fs.statSync(path.join(sitesDir, f)).isDirectory());

    console.log(`🚀 Starting Global V10.1 Unified Update for ${sites.length} sites...\n`);

    for (const siteName of sites) {
        const projectDir = path.join(sitesDir, siteName);
        const configPath = path.join(projectDir, 'athena-config.json');
        
        if (!fs.existsSync(configPath)) {
            console.log(`⏭️  Skipping ${siteName} (not an Athena V9/V10 project)`);
            continue;
        }

        let config;
        try {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        } catch (e) {
            console.error(`❌ Failed to parse config for ${siteName}:`, e.message);
            continue;
        }

        console.log(`🛠️  Updating ${siteName} (Model: ${config.siteModel || 'SPA'})...`);

        try {
            // 1. Sync dock-connector.js (Unified V10.1 Location)
            const connectorSrc = path.join(TPL, 'shared/boilerplate/dock-connector.js');
            if (fs.existsSync(connectorSrc)) {
                const possiblePaths = ['src/dock-connector.js', 'public/dock-connector.js'];
                let found = false;
                for (const p of possiblePaths) {
                    if (fs.existsSync(path.join(projectDir, p))) {
                        fs.copyFileSync(connectorSrc, path.join(projectDir, p));
                        console.log(`   ✅ dock-connector.js updated at ${p}.`);
                        found = true;
                    }
                }
                if (!found) {
                    fs.copyFileSync(connectorSrc, path.join(projectDir, 'src/dock-connector.js'));
                    console.log(`   ✅ dock-connector.js added to src/.`);
                }
            }

            // 2. Update Header.jsx & Footer.jsx (Model-Aware Skeletons)
            const model = config.siteModel || 'SPA';
            const components = ['Header.jsx', 'Footer.jsx'];
            for (const comp of components) {
                const compPath = path.join(projectDir, 'src/components', comp);
                // Look in model-specific skeleton first, fallback to SPA
                let tplPath = path.join(TPL, 'skeletons', model, 'components', comp);
                if (!fs.existsSync(tplPath)) {
                    tplPath = path.join(TPL, 'skeletons/SPA/components', comp);
                }
                
                if (fs.existsSync(compPath) && fs.existsSync(tplPath)) {
                    let tplContent = fs.readFileSync(tplPath, 'utf8');
                    tplContent = tplContent.replace(/{{PROJECT_NAME}}/g, config.projectName);
                    fs.writeFileSync(compPath, tplContent);
                    console.log(`   ✅ ${comp} updated using ${model} standards.`);
                }
            }

            // 3. Update fetch-data.js (Unified logic)
            const fetchPath = path.join(projectDir, 'fetch-data.js');
            const fetchTpl = path.join(TPL, 'logic/fetch-data.js'); 
            if (fs.existsSync(fetchPath) && fs.existsSync(fetchTpl)) {
                fs.copyFileSync(fetchTpl, fetchPath);
                console.log(`   ✅ fetch-data.js updated.`);
            }

            console.log(`   ✨ ${siteName} update complete.\n`);
        } catch (err) {
            console.error(`   ❌ Failed to update ${siteName}:`, err.message);
        }
    }

    console.log("🏁 All sites successfully hardened to the V10.1 Unified Architecture!");
}

updateAllSites().catch(console.error);
