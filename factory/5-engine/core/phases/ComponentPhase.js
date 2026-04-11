import fs from 'fs';
import path from 'path';
import { BasePhase } from './BasePhase.js';
import { generateSectionComponent } from '../../logic/standard-layout-generator.js';

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
        const essential = [
            { name: 'CartContext.jsx', srcName: 'CartContext.jsx' },
            { name: 'CartOverlay.jsx', srcName: 'CartOverlayV9.jsx' },
            { name: 'Checkout.jsx', srcName: 'CheckoutHeaderV9.jsx' },
            { name: 'RepeaterControls.jsx', srcName: 'RepeaterControls.jsx' },
            { name: 'Header.jsx', srcName: 'HeaderV9.jsx' },
            { name: 'Footer.jsx', srcName: 'FooterV9.jsx' },
            { name: 'SectionToolbar.jsx', srcName: 'SectionToolbar.jsx' },
            { name: 'MetadataConfigModal.jsx', srcName: 'MetadataConfigModal.jsx' },
            { name: 'AboutSection.jsx', srcName: 'TextLegoV9.jsx' },
            { name: 'StyleContext.jsx', srcName: 'StyleContext.jsx' },
            { name: 'DisplayConfigContext.jsx', srcName: 'DisplayConfigContext.jsx' },
            { name: 'Hero.jsx', srcName: 'HeroLegoV9.jsx' },
            { name: 'Testimonials.jsx', srcName: 'TestimonialsLegoV9.jsx' },
            { name: 'Team.jsx', srcName: 'TeamLegoV9.jsx' },
            { name: 'FAQ.jsx', srcName: 'FAQLegoV9.jsx' },
            { name: 'CTA.jsx', srcName: 'CTALegoV9.jsx' },
            { name: 'ProductGrid.jsx', srcName: 'ProductGridV9.jsx' },
            { name: 'Benefits.jsx', srcName: 'BenefitsLegoV9.jsx' },
            { name: 'GenericSection.jsx', srcName: 'GenericSectionV9.jsx' },
            { name: 'StyleInjector.jsx', srcName: 'StyleInjector.jsx' }
        ];
        
        essential.forEach(item => {
            const comp = item.name;
            const srcFile = item.srcName;
            
            let src = [
                path.join(ctx.paths.modelBoilerplate, 'components', srcFile),
                path.join(ctx.tplRoot, 'components/legos/Common', srcFile),
                path.join(ctx.tplRoot, 'components/legos/Layout', srcFile),
                path.join(ctx.tplRoot, 'components/legos/Shop', srcFile),
                path.join(ctx.paths.globalShared, 'components', srcFile),
                path.join(ctx.tplRoot, 'components', srcFile),
                path.join(ctx.configManager.get('paths.root'), 'factory/deprecated/templates/components', srcFile),
                // Fallback to non-V9 names
                path.join(ctx.tplRoot, 'components/legos/Common', comp),
                path.join(ctx.tplRoot, 'components/legos/Layout', comp)
            ].find(fs.existsSync);
            
            if (src) {
                fs.writeFileSync(
                    path.join(ctx.projectDir, 'src/components', comp), 
                    ctx.engine.transform(fs.readFileSync(src, 'utf8'), comp)
                );
            }
        });

        // Copy custom components from sitetype
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

        // Shared UI components (flat copy)
        [path.join(ctx.paths.globalShared, 'components/ui'), path.join(ctx.paths.trackBoilerplate, 'components/legos/Common/ui')].forEach(src => {
            if (fs.existsSync(src)) fs.cpSync(src, path.join(ctx.projectDir, 'src/components/ui'), { recursive: true });
        });

        // Special: dock-connector.js (only for docked track)
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
