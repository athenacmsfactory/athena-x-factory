import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sitesDir = path.resolve(__dirname, '../../sites');

console.log(`🔍 Scanning sites in ${sitesDir}...`);

const files = fs.readdirSync(sitesDir);
const sites = files.filter(f => {
    const fullPath = path.join(sitesDir, f);
    const isDir = fs.statSync(fullPath).isDirectory();
    return isDir && fs.existsSync(path.join(fullPath, 'package.json'));
});

console.log(`✅ Found ${sites.length} site projects.`);

const ORGANIZATION = 'athena-sites';

const generatePassport = (siteId, repoName, sector) => {
    const liveUrl = `https://${ORGANIZATION}.github.io/${repoName}/`;
    const repoUrl = `https://github.com/${ORGANIZATION}/${repoName}`;

    return `# 🔱 Athena Site Passport: ${siteId}

Deze website is gegenereerd door de **Athena CMS Factory (v10.1 Unified Architecture)**. Het is een krachtige, component-gebaseerde React applicatie die geoptimaliseerd is voor prestaties en SEO.

## 🚀 Live Status
- **Website:** [${liveUrl}](${liveUrl})
- **GitHub Repository:** [${repoUrl}](${repoUrl})

## 🛠️ Project Details
- **Site ID:** \`${siteId}\`
- **Sector:** \`${sector || 'Algemeen'}\`
- **Framework:** React 19 + Tailwind CSS v4
- **Architecture:** Athena V10 Lego-Bricks (Zero-UI)

## 🏗️ Beheer & Bewerken
Deze site is volledig compatibel met de **Athena Visual Dock**. Om de inhoud aan te passen:
1. Start de Athena Factory Dashboard op poort 5000.
2. Open de site in de Visual Editor (Dock) op poort 5003.
3. Gebruikt de \`data-dock-bind\` elementen om teksten en afbeeldingen real-time te wijzigen.

---
*Gegenereerd door Athena Factory Engine - April 2026*
`;
};

sites.forEach(siteId => {
    const sitePath = path.join(sitesDir, siteId);
    const readmePath = path.join(sitePath, 'README.md');
    const configPath = path.join(sitePath, 'athena-config.json');
    const pkgPath = path.join(sitePath, 'package.json');
    
    try {
        let repoName = siteId;
        let sector = 'Algemeen';

        // 1. Try to get Sector from athena-config.json
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            if (config.sitetype) sector = config.sitetype;
        }

        // 2. Try to get Repo Name from Remote if it's a git repo
        if (fs.existsSync(path.join(sitePath, '.git'))) {
            try {
                const remoteUrl = execSync('git remote get-url origin', { cwd: sitePath, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
                const repoNameMatch = remoteUrl.match(/[\/:]([^\/]+)\.git$/);
                if (repoNameMatch) repoName = repoNameMatch[1];
            } catch (gitError) {
                // Ignore git errors, fallback to siteId
            }
        }
        
        console.log(`📄 Generating Passport for ${siteId} [${sector}] -> ${repoName}`);

        const passportContent = generatePassport(siteId, repoName, sector);
        fs.writeFileSync(readmePath, passportContent);
        
        console.log(`   ✅ README.md (Passport) created for ${siteId}`);
        
    } catch (e) {
        console.error(`   ❌ Error processing ${siteId}: ${e.message}`);
    }
});

console.log('\n🎉 Global Site Passport Regeneration Complete (Athena V10 Standard).');
