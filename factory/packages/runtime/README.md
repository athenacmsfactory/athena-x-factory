# @athena/runtime

Gedeelde runtime van de Athena-engine (Fase 1b — "Gedeelde packages i.p.v. site-kopieën").
Eén bron van waarheid voor de Lego-componenten, contexts en de fetch-data CLI die
eerder als kopie in elke gegeneerde site leefde (md5-drift over 3+ vault-sites).

## Inhoud (src → dist)

| Map | Inhoud | Herkomst |
|---|---|---|
| `src/legos/Common` | 14 universele sectie-lego's (Hero, FAQ, Team, CTA, …) | voorheen `2-templates/components/legos/Common` |
| `src/legos/Layout` | HeaderV9, FooterV9 | voorheen `2-templates/components/legos/Layout` |
| `src/legos/Shop` | CartOverlayV9, CheckoutHeaderV9, ProductCardV9, ProductGridV9 | voorheen `2-templates/components/legos/Shop` |
| `src/contexts` | StyleContext, DisplayConfigContext, CartContext (localStorage-variant) | voorheen `skeletons/shared/contexts`, `skeletons/SPA/components`, sitetype-standaard |
| `src/components` | StyleInjector | voorheen `skeletons/SPA/components` |
| `src/cli` | `fetch-data.js` + `mapper.js` (bin: `athena-fetch-data`) | voorheen `2-templates/logic` |

## Hoe sites dit consumeren

Gegenereerde sites bevatten **geen component-kopieën** meer, maar dunne shims:

```jsx
// src/components/Hero.jsx in een site
export { default } from '@athena/runtime/legos/Common/HeroLegoV9.js';
```

- Site-specifieke componenten (sitetype-layout, gegenereerde `Section.jsx`) overschrijven
  de shims gewoon lokaal — zelfde override-semantiek als voorheen.
- `@athena/runtime` wordt in elke site geïnstalleerd als **vendored tarball**:
  `"@athena/runtime": "file:vendor/athena-runtime-<versie>.tgz"` in `package.json`.
  Dit houdt sites 100% standalone bouwbaar (GitHub Actions `deploy.yml`, geen registry of
  netwerk nodig) en pin-t de runtime-versie per site.
- Het script `pnpm fetch-data` (bin) vervangt het oude `node fetch-data.js`;
  de CLI leest nog steeds site-lokale paden via `process.cwd()` (`src/data/schema.json`,
  `project-settings/url-sheet.json`).

## Engine-update doorvoeren naar alle sites

```bash
# 1. Pas de bron aan in packages/runtime/src/**
# 2. Bump de versie in packages/runtime/package.json
node factory/6-utilities/sync-runtime.js            # pack + vendortarball verversen in alle sites
node factory/6-utilities/sync-runtime.js --build    # ...en elke site herbouwen
```

Sites buiten de workspace (vault/parked): eerst retrieve-n, of geef expliciete paden mee
aan `sync-runtime.js`.

## Build & ontwikkel

```bash
cd factory/packages/runtime
pnpm install
pnpm build   # src -> dist (esbuild, per-file ESM, jsx automatic)
pnpm pack    # bouwt automatisch (prepack) en levert athena-runtime-<versie>.tgz
```

React/react-dom/react-router-dom zijn peer-dependencies (geen dubbele instanties);
`csvtojson` is een gewone dependency voor de CLI.
