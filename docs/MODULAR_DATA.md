# Athena V10: Modular Data & Section Standards

The Athena V10 ecosystem enforces a strict separation between **Content (Data)** and **Structure (Components)**. This allows for rapid site cloning and infinite layout flexibility via the Athena Dock.

## 🌟 The "1-to-1" Rule: Data Purity

In V10, every UI section behaves as a standalone modular unit. This is the cornerstone of the system:
**1 Component = 1 JSON File = 1 Sheet Tab.**

### 1. Section Content (Nederlands)
Tabs that are directly editable by the user must have clean, descriptive Dutch names (e.g., `header`, `hero`, `voordelen`, `footer`). These are automatically mapped to their respective JSON files in the site's `/data/` folder.

### 2. Configuration & Logic (Underscore Prefix)
Technical backend settings and architectural data must use an underscore (`_`) prefix. These are hidden from the user but remain accessible to the Athena Engine:
- `_site_settings`: Global site configuration.
- `_section_order`: The master manifest defining the sequence of sections.
- `_styles`: Preset themes and color palettes.

---

## 🎨 Unified Component Interaction

### The `data-dock-bind` Attribute
This is the **mandatory protocol** for V10 template development. Every section wrapper in a template must include the `data-dock-bind` attribute containing the section's JSON filename.
_Example_: `<section data-dock-bind="hero">`

### SmartIcon System
The V10 `GenericSection` renders icons intelligently from the Data layer:
1.  **SVG Path**: If the cell starts with `M` (e.g., `M10 20...`), it is rendered as an inline SVG.
2.  **Lucide / FontAwesome**: If the cell contains a known icon string (e.g., `star`, `fa-check`), it is rendered as a vector icon.
3.  **Images**: If it contains a URL, it is rendered as an `img` tag.

---

## 🏗️ Storage & Persistence Policy

Athena V10 maintains a aggressive storage management policy via the **DoctorController**:
- **Hydrated**: Local `node_modules` are present for active development.
- **Dormant**: `node_modules` are pruned to save disk space on the Chromebook.
_Command_: `athena storage prune-all` to dehydrate inactive sites.

_Last Updated: April 2026 (Modernization Completion)_
