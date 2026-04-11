import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import AboutSection from './AboutSection';
import GenericSection from './GenericSection';
import Benefits from './Benefits';
import Contact from './Contact';
import ContactInfo from './ContactInfo';
import ProductGrid from './ProductGrid';

const Section = ({ data }) => {
  const getImageUrl = (url) => {
    if (!url) return '';
    if (typeof url === 'object') url = url.text || url.url || '';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    const base = import.meta.env.BASE_URL || '/';
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
    if (cleanUrl.startsWith(base.slice(1)) && base !== '/') return cleanUrl;
    const isRootPublic = cleanUrl.startsWith('./') || cleanUrl.endsWith('.svg') || cleanUrl.endsWith('.ico') || cleanUrl === 'site-logo.svg' || cleanUrl === 'athena-icon.svg';
    const hasImagesPrefix = cleanUrl.includes('/images/') || cleanUrl.startsWith('images/');
    const pathPrefix = (isRootPublic || hasImagesPrefix) ? '' : 'images/';
    return (base + pathPrefix + cleanUrl.replace('./', '')).replace(new RegExp('/+', 'g'), '/');
  };

  const sectionOrder = data.section_order || [];
  const layoutSettings = data.layout_settings || {};
  const sectionSettings = data.section_settings || {};

  useEffect(() => {
    if (window.athenaScan) {
      window.athenaScan(data);
    }
  }, [data, sectionOrder]);

  const getComponent = (sectionName) => {
      const lower = sectionName.toLowerCase();
      if (lower === 'basis' || lower === 'basisgegevens' || lower === 'hero') return Hero;
      if (lower.includes('about') || lower.includes('info')) return AboutSection;
      if (lower.includes('voordelen') || lower.includes('benefits')) return Benefits;
      if (lower === 'contact') return Contact;
      if (lower.includes('contact_info') || lower.includes('contactgegevens')) return ContactInfo;
      if (lower.includes('productengrid') || lower.includes('productgrid')) return ProductGrid;
      return GenericSection;
  };

  const headerData = data.header?.[0] || data.header || {};
  const heroData = data.hero?.[0] || data.hero || {};
  const footerData = data.footer?.[0] || data.footer || {};

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section (Explicitly rendered if exists) */}
      {(heroData && Object.keys(heroData).length > 0) && (
        <section
          id="hero"
          data-dock-section="hero"
          className="relative w-full h-auto min-h-[80vh] flex items-center justify-center overflow-hidden bg-slate-900 pt-24"
        >
          <div className="absolute inset-0 z-0">
             <img 
                src={getImageUrl(heroData.afbeelding_bg || heroData.hero_image)} 
                className="w-full h-full object-cover" 
                data-dock-type="media" 
                data-dock-bind={JSON.stringify({ file: 'hero', index: 0, key: heroData.afbeelding_bg ? 'afbeelding_bg' : 'hero_image' })} 
             />
             <div className="absolute inset-0 bg-black/50 z-10"></div>
          </div>
          <div className="relative z-20 text-center px-6 max-w-5xl text-white">
            <h1 className="text-4xl md:text-7xl font-bold mb-6">
              <span data-dock-type="text" data-dock-bind={JSON.stringify({ file: 'hero', index: 0, key: heroData.tekst_titel ? 'tekst_titel' : 'hero_header' })}>{heroData.tekst_titel || heroData.hero_header}</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 opacity-90">
              <span data-dock-type="text" data-dock-bind={JSON.stringify({ file: 'hero', index: 0, key: heroData.tekst_subtitel ? 'tekst_subtitel' : 'hero_tagline' })}>{heroData.tekst_subtitel || heroData.hero_tagline}</span>
            </p>
            {(heroData.tekst_knop || heroData.cta_text) && (
              <a 
                href={heroData.link_knop || heroData.cta_url || "#"} 
                className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-slate-200 transition-all" 
                data-dock-type="link" 
                data-dock-bind={JSON.stringify({ file: 'hero', index: 0, key: heroData.tekst_knop ? 'tekst_knop' : 'cta_text' })}
              >
                {heroData.tekst_knop || heroData.cta_text}
              </a>
            )}
          </div>
        </section>
      )}

      {/* 2. Dynamic Sections Loop */}
      {sectionOrder.filter(name => !['site_settings', 'basis', 'header', 'footer', 'hero'].includes(name.toLowerCase())).map((sectionName, idx) => {
        const items = data[sectionName] || [];
        if (items.length === 0) return null;
        
        const Component = getComponent(sectionName);
        const layout = layoutSettings[sectionName] || 'list';
        const currentSectionSettings = data.section_settings?.[sectionName] || {};
        const sectionBgColor = currentSectionSettings.backgroundColor || null;
        const sectionStyle = sectionBgColor ? { backgroundColor: sectionBgColor } : {};
        
        const schemaSection = data.schema?.sections?.find(s => s.id === sectionName);
        const sectionTitle = schemaSection?.title || sectionName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

        // Some components expect a single object (Lego V9 style), others expect the full array
        let componentData = items;
        if (Component === Hero || Component === AboutSection) {
            componentData = items[0];
        } else if (Component === Benefits) {
            componentData = { tekst_sectie_titel: sectionTitle, items: items };
        }

        return (
            <Component 
                key={idx} 
                sectionName={sectionName} 
                sectionTitle={sectionTitle}
                data={componentData} 
                layout={layout}
                style={sectionStyle}
                features={data.schema?.features || {"ecommerce":false,"google_search_links":false}} 
            />
        );
      })}
    </div>
  );
};

export default Section;