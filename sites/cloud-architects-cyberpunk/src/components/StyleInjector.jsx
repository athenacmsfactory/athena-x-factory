import React, { useLayoutEffect } from 'react';

/**
 * StyleInjector
 * Synchronizes Athena JSON settings with CSS Custom Properties (Variables).
 * This ensures the site looks correct both in standalone mode and in the Dock.
 */
const StyleInjector = ({ siteSettings }) => {
  const config = Array.isArray(siteSettings) ? (siteSettings[0] || {}) : (siteSettings || {});

  useLayoutEffect(() => {
    const root = document.documentElement;
    const isDark = config.theme === 'dark';

    // 1. Theme Toggle
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    // 2. Map Config to CSS Variables
    const prefix = isDark ? 'dark_' : 'light_';
    
    // Core Colors Mapping
    const mappings = {
      'primary_color': ['--color-primary', '--primary-color'],
      'secondary_color': ['--color-secondary'],
      'accent_color': ['--color-accent'],
      'button_color': ['--color-button', '--color-button-bg'],
      'button_bg_color': ['--color-button', '--color-button-bg'],
      'card_color': ['--color-card', '--bg-surface'],
      'card_bg_color': ['--color-card', '--bg-surface'],
      'header_color': ['--color-header', '--bg-header'],
      'header_bg_color': ['--color-header', '--bg-header'],
      'bg_color': ['--color-background', '--bg-site'],
      'background_color': ['--color-background', '--bg-site'],
      'text_color': ['--color-text'],
      'heading_color': ['--color-heading'],
      'title_color': ['--color-title'],
      'surface_color': ['--color-surface']
    };

    // Iterate through all config keys
    Object.entries(config).forEach(([key, val]) => {
      if (!val) return;

      // Case A: Direct CSS Variable (e.g., "--color-primary")
      if (key.startsWith('--')) {
        root.style.setProperty(key, val);
        return;
      }

      // Case B: Prefixed Legacy Key (e.g., "light_primary_color")
      if (key === `${prefix}${key.replace(prefix, '')}`) {
        const cleanKey = key.replace(prefix, '');
        if (mappings[cleanKey]) {
          mappings[cleanKey].forEach(v => root.style.setProperty(v, val));
        }
        return;
      }

      // Case C: Unprefixed Legacy Key (e.g., "primary_color")
      if (mappings[key]) {
        mappings[key].forEach(v => root.style.setProperty(v, val));
        return;
      }
    });

    // 3. Global Variables (Direct mapping for standard Athena keys)
    const globals = {
      'global_radius': '--radius-custom',
      'radius_custom': '--radius-custom',
      'font_sans': '--font-sans',
      'font_serif': '--font-serif',
      'font_mono': '--font-mono',
      'header_height': '--header-height',
      'content_top_offset': '--content-top-offset'
    };

    Object.entries(globals).forEach(([key, varName]) => {
      if (config[key]) root.style.setProperty(varName, config[key]);
    });

    // Hero overlay logic
    if (config.hero_overlay_opacity !== undefined) {
      const opacity = parseFloat(config.hero_overlay_opacity) || 0.8;
      root.style.setProperty('--hero-overlay-start', `rgba(0, 0, 0, ${opacity})`);
      root.style.setProperty('--hero-overlay-end', `rgba(0, 0, 0, ${opacity * 0.4})`);
    }

    // Header transparency
    if (config.header_transparent === true) {
      root.style.setProperty('--header-bg', 'transparent');
      root.style.setProperty('--header-blur', 'none');
      root.style.setProperty('--header-border', 'none');
    } else if (config.header_transparent === false) {
      root.style.removeProperty('--header-bg');
      root.style.removeProperty('--header-blur');
      root.style.removeProperty('--header-border');
    }

  }, [config]);

  return null; // This component doesn't render anything
};

export default StyleInjector;
