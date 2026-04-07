# 🤖 Athena CMS Factory - AI Agent Dashboard & Manifest (v10.1 Unified)

Dit manifest is de definitieve operationele gids voor AI-agents (Gemini, Jules, Antigravity) die werkzaam zijn binnen de Athena CMS Factory. Het dient als "Dashboard" om in één oogopslag alle tools, workflows en site-statussen te overzien.

---

## 🏗️ Fabriek Architectuur (V10 Flattened)
- **Locatie:** `/home/kareltestspecial/0-IT/4-pj/x-v9/athena/`
- **Engine Kern (`/factory/5-engine/`):** Bevat alle actieve scripts en V10-omgeving.
- **Sites (`/sites/`):** De individuele projecten (bijv. `fpc-gent-site`, `portfolio-kbm`).
- **Input (`/input/`):** Rauwe data bronnen (TSV, Scrapes).
- **Templates (`/factory/2-templates/`):** De blauwdrukken (Lego Bricks en Skeletons).
- **Site-Types (`/factory/3-sitetypes/`):** De 100% geflatteerde blauwdruk-registry.

---

## 🛠️ AI-Agent Tooling & Commando's (V10 Optimized)
Gebruik deze commando's vanuit de `/factory/` map voor autonome uitvoering:

### 📥 Data Management & Google Sheets
- **Auto-Provisioning:** `node factory/5-engine/auto-sheet-provisioner.js [site-name] [email]`
  - *Wat het doet:* Maakt een nieuwe Google Sheet aan, deelt deze met de robot en de klant, en koppelt deze automatisch aan het V10 project.
- **Sheet-to-JSON Sync:** `node factory/5-engine/sync-sheet-to-json.js [site-name]`
  - *Wat het doet:* Haalt live data op uit de gekoppelde Google Sheet en overschrijft lokale JSON-bestanden in `/sites/[site]/data/`.
- **JSON-to-Sheet Sync:** `node factory/5-engine/sync-json-to-sheet.js [site-name]`
  - *Wat het doet:* Pusht lokale wijzigingen terug naar de Google Sheet.

### 🏗️ Site Generation & Wizards (V10 Unified)
- **Rebuild Site:** `node factory/5-engine/rebuild-site.js [site-name]`
  - *Wat het doet:* Genereert de volledige site-structuur opnieuw op basis van de laatste JSON-data in de 100% Unified V10 architectuur.
- **Quick Create:** `node factory/cli/quick-create.js [site-name] [site-type]`
  - *Wat het doet:* Maakt razendsnel een nieuwe site aan op basis van de geflatteerde `3-sitetypes/` registry.
- **Variant Generator:** `node factory/5-engine/variant-generator.js`
  - *Wat het doet:* Maakt variaties van een site met andere CSS-themes via de V10 Lego-Bricks.

### 🤖 AI Agent Autonome Uitvoering
- **MCP Runner:** `node factory/5-engine/athena-mcp-runner.js [wizard] [antwoorden...]`
  - *Wat het doet:* Voert een interactieve wizard uit zonder menselijke tussenkomst door antwoorden naar de stdin te pushen (geoptimaliseerd voor V10).
- **AI Parser:** `node factory/5-engine/parser-wizard.js [site-name]`
  - *Wat het doet:* Gebruikt GenAI om rauwe content te mappen naar de JSON-velden van de site-blueprints.

---

## 🚀 Deployment & Monitoring
- **GitHub Sync (Subtree):** `node factory/5-engine/sync-monorepo-to-github.js [site-name]`
  - *Wat het doet:* Pusht een specifieke site vanuit de monorepo naar zijn eigen GitHub repository onder de **athena-sites** organisatie.
- **Site README Fixer:** `node factory/6-utilities/align-site-readmes.js`
  - *Wat het doet:* Automatiseert het updaten van alle site-README's naar de correcte GitHub-URLs.

---

## 🎨 Design & Media
- **Media Fetcher:** `node factory/5-engine/athena-media-fetcher.js [site-name]`
  - *Wat het doet:* Downloadt automatisch relevante afbeeldingen van Unsplash op basis van JSON context.

---

## 📋 Standaard Workflow voor V10 AI-Taken
1. **Verifieer Status:** Check `SITES_OVERZICHT.md` in `factory/output/`.
2. **Koppel Data:** Gebruik `auto-sheet-provisioner.js` voor nieuwe sites.
3. **Synchroniseer:** Gebruik `sync-sheet-to-json.js`.
4. **Build:** Gebruik `rebuild-site.js`.
5. **Deploy:** Gebruik `sync-monorepo-to-github.js`.

---
*Status: V10.1 Unified AI Manifest - April 2026*
*Author: Antigravity AI*
