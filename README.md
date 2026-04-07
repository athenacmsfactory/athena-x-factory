# 🔱 Athena CMS Factory (v10.1 - Unified)

Welkom bij de Athena CMS Factory, de definitieve monorepo voor het genereren en beheren van React 19 + Tailwind v4 websites. Deze omgeving is 100% geoptimaliseerd voor de **V10 Unified Architecture**, waarbij de scheiding tussen "Docked" en "Autonomous" tracks volledig is opgeheven.

## 🚀 Snel aan de slag

### 1. Servers opstarten
Gebruik de nieuwe geconsolideerde launcher vanuit de factory root:
```bash
./athena.sh
```
*Dit start het Dashboard (poort 5000/5001), het Dock (poort 5002) en biedt toegang tot alle actieve sites.*

### 2. Dashboard Toegang
Open je browser op: `http://localhost:5000`

---

## 🏛️ Architectuur (V10 Unified)

Het systeem is nu volledig geflatteerd voor maximale snelheid en AI-vriendelijkheid:

1.  **Docs**: De [V10_STRUCTURE.md](docs/V10_STRUCTURE.md) is de enige bron van waarheid voor de projectstructuur.
2.  **Factory**: De engine die sites bouwt op basis van Blauwdrukken (`3-sitetypes/`) en een centrale Lego-bibliotheek (`2-templates/components/legos/`).
3.  **Dock (v10.1)**: De externe visual editor (poort 5002) die real-time communiceert met sites via de `data-dock-bind` protocol.
4.  **Sites**: 100% data-driven React applicaties in de `/sites/` map.

---

## ⚙️ Systeembeheer & Poorten

- **API / Dashboard**: 5000 / 5001
- **Visual Dock**: 5002
- **Sites**: 5100+ (toegewezen via de `PortRegistry`)
- **Config**: Centraal beheerd in `factory/5-engine/lib/ConfigManager.js`.

---

## 🧙‍♂️ AI Agents (Jules & Antigravity)

Deze repo is ontworpen voor naadloze samenwerking met AI:
- **Jules**: Voor grootschalige refactoring en data-migraties.
- **Antigravity**: Voor agentic coding, browser-validatie en architectuur-bewaking.
- **Manifest**: Zie [AI-MANIFEST.md](AI-MANIFEST.md) voor alle operationele commando's.

---

## 🧭 Ontwikkelingstips
- Gebruik **ALTIJD `pnpm`** voor Node.js operaties om schijfruimte te besparen.
- Houd de `factory/output/logs/` in de gaten voor real-time debugging.
- Gebruik `node factory/cli/pm-cli.js list` om actieve processen te monitoren.

---
*Status: 100% Unified V10 Architecture - April 2026*
*Author: Antigravity AI*
