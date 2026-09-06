import fs from 'fs';
import path from 'path';
import { BasePhase } from './BasePhase.js';
import { generateSectionComponent } from '../../logic/standard-layout-generator.js';

// Fase 1b — Gedeelde packages: de engine-generieke componenten leven in
// @athena/runtime (factory/packages/runtime). Gegenereerde sites krijgen dunne
// re-export shims i.p.v. volledige kopieën; site-specifieke componenten
// (sitetype-layout, gegenereerde Section.jsx) overschrijven de shims daarna.
const RUNTIME = '@athena/runtime';

const RUNTIME_SHIMS = [
    { name: 'Hero.jsx', spec: `${RUNTIME}/legos/Common/HeroLegoV9.js` },
    { name: 'Testimonials.jsx', spec: `${RUNTIME}/legos/Common/TestimonialsLegoV9.js` },
    { name: 'Team.jsx', spec: `${RUNTIME}/legos/Common/TeamLegoV9.js` },
    { name: 'FAQ.jsx', spec: `${RUNTIME}/legos/Common/FAQLegoV9.js` },
    { name: 'CTA.jsx', spec: `${RUNTIME}/legos/Common/CTALegoV9.js` },
    { name: 'Benefits.jsx', spec: `${RUNTIME}/legos/Common/BenefitsLegoV9.js` },
    { name: 'AboutSection.jsx', spec: `${RUNTIME}/legos/Common/TextLegoV9.js` },
    { name: 'GenericSection.jsx', spec: `${RUNTIME}/legos/Common/GenericSectionV9.js` },
    { name: 'Header.jsx', spec: `${RUNTIME}/legos/Layout/HeaderV9.js` },
    { name: 'Footer.jsx', spec: `${RUNTIME}/legos/Layout/FooterV9.js` },
    { name: 'ProductGrid.jsx', spec: `${RUNTIME}/legos/Shop/ProductGridV9.js` },
    { name: 'CartOverlay.jsx', spec: `${RUNTIME}/legos/Shop/CartOverlayV9.js` },
    { name: 'Checkout.jsx', spec: `${RUNTIME}/legos/Shop/CheckoutHeaderV9.js` },
    { name: 'StyleInjector.jsx', spec: `${RUNTIME}/components/StyleInjector.js` },
    // Contexts: named exports (eventueel + default)
    { name: 'CartContext.jsx', spec: `${RUNTIME}/contexts/CartContext.js`, named: true },
    { name: 'DisplayConfigContext.jsx', spec: `${RUNTIME}/contexts/DisplayConfigContext.js`, named: true },
    { name: 'StyleContext.jsx', spec: `${RUNTIME}/contexts/StyleContext.js`, named: true, default: true }
];

export class ComponentPhase extends BasePhase {
    constructor() {
        super('Component');
    }

    async execute(ctx) {
        this.log('Assembling UI components...');
        this.assembleComponents(ctx);
        this.generateSpecialComponents(ctx);
    }

    assembleComponents(ctx) {
        // 1. Runtime shims (defaults; overschrijfbaar door sitetype-layout hieronder)
        RUNTIME_SHIMS.forEach(shim => {
            const lines = [];
            if (!shim.named) lines.push(`export { default } from '${shim.spec}';`);
            else {
                lines.push(`export * from '${shim.spec}';`);
                if (shim.default) lines.push(`export { default } from '${shim.spec}';`);
            }
            fs.writeFileSync(path.join(ctx.projectDir, 'src/components', shim.name), lines.join('\n') + '\n');
        });

        // 2. Copy custom components from sitetype (overschrijven shims indien aanwezig)
        const customCompDir = path.join(ctx.paths.sourceLayout, 'components');
        if (fs.existsSync(customCompDir)) {
            const customFiles = fs.readdirSync(customCompDir).filter(f => f.endsWith('.jsx'));
            customFiles.forEach(comp => {
                const src = path.join(customCompDir, comp);
                fs.writeFileSync(
                    path.join(ctx.projectDir, 'src/components', comp),
                    ctx.engine.transform(fs.readFileSync(src, 'utf8'), comp)
                );
            });
        }

        // 3. Shared UI components (flat copy)
        [path.join(ctx.paths.globalShared, 'components/ui'), path.join(ctx.paths.trackBoilerplate, 'components/legos/Common/ui')].forEach(src => {
            if (fs.existsSync(src)) fs.cpSync(src, path.join(ctx.projectDir, 'src/components/ui'), { recursive: true });
        });

        // 4. Special: dock-connector.js (only for docked track)
        if (ctx.config.editorStrategy === 'unified') {
            const connSrc = path.join(ctx.paths.trackBoilerplate, 'shared/public/dock-connector.js');
            if (fs.existsSync(connSrc)) {
                fs.copyFileSync(connSrc, path.join(ctx.projectDir, 'src/dock-connector.js'));
            }
        }
    }

    generateSpecialComponents(ctx) {
        try {
            const customSectionSrc = [
                path.join(ctx.paths.sourceLayout, 'components/Section.jsx'),
                path.join(ctx.paths.sourceLayout, 'Section.jsx')
            ].find(fs.existsSync);

            if (customSectionSrc) {
                this.log(`🎨 Using sitetype-specific Section.jsx`);
                fs.writeFileSync(
                    path.join(ctx.projectDir, 'src/components/Section.jsx'),
                    ctx.engine.transform(fs.readFileSync(customSectionSrc, 'utf8'), 'Section.jsx')
                );
            } else {
                const code = generateSectionComponent(ctx.blueprint, ctx.editorStrategy);
                fs.writeFileSync(path.join(ctx.projectDir, 'src/components/Section.jsx'), code);
            }
        } catch (e) { this.log(`⚠️ Failed to generate Section.jsx: ${e.message}`); }

        // Local CSS File
        const styleFileName = ctx.config.styleName.endsWith('.css') ? ctx.config.styleName : `${ctx.config.styleName}.css`;
        const styleSrc = path.join(ctx.tplRoot, 'skeletons/css', styleFileName);
        if (fs.existsSync(styleSrc)) fs.copyFileSync(styleSrc, path.join(ctx.projectDir, 'src', styleFileName));
    }
}
