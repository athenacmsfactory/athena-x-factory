import React, { useLayoutEffect } from 'react';

/**
 * StyleInjector (Auto-upgraded)
 * Synchronizes Athena JSON settings with CSS Custom Properties (Variables).
 */
const StyleInjector = ({ siteSettings }) => {
  const settings = Array.isArray(siteSettings) ? (siteSettings[0] || {}) : (siteSettings || {});

  useLayoutEffect(() => {
    const root = document.documentElement;
    const isDark = settings.theme === 'dark';

    // 1. Theme Toggle
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    // 2. Map Settings to CSS Variables
    const prefix = isDark ? 'dark_' : 'light_';
    
    const mappings = {
      'primary_color': ['--color-primary', '--primary-color'],
      'title_color': ['--color-title'],
      'heading_color': ['--color-heading'],
      'accent_color': ['--color-accent'],
      'button_color': ['--color-button', '--color-button-bg', '--btn-bg'],
      'card_color': ['--color-card', '--bg-surface', '--color-card-bg', '--card-bg', '--surface', '--color-surface'],
      'header_color': ['--color-header', '--bg-header', '--color-header-bg', '--nav-bg'],
      'bg_color': ['--color-background', '--bg-site'],
      'text_color': ['--color-text']
    };

    Object.entries(mappings).forEach(([key, vars]) => {
      const val = settings[prefix + key] || settings[key];
      if (val) {
        vars.forEach(v => root.style.setProperty(v, val));
      }
    });

    // 3. Spacing & Layout
    if (settings.content_top_offset !== undefined) root.style.setProperty('--content-top-offset', settings.content_top_offset + 'px');
    if (settings.header_height !== undefined) root.style.setProperty('--header-height', settings.header_height + 'px');
    if (settings.hero_padding_top !== undefined) root.style.setProperty('--hero-padding-top', settings.hero_padding_top + 'px');

    // 4. Header Styling (Transparency & Opacity)
    const headerColor = settings.header_color || '#ffffff';
    const opacityValue = settings.header_opacity ?? settings.header_transparantie ?? 95;
    const headerOpacity = (opacityValue <= 1) ? opacityValue : (opacityValue / 100);
    
    const hexToRgba = (hex, alpha) => {
      if (!hex || !hex.startsWith('#')) return `rgba(255, 255, 255, ${alpha})`;
      let r, g, b;
      if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
      } else if (hex.length === 7) {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
      } else {
        return `rgba(255, 255, 255, ${alpha})`;
      }
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    if (settings.header_transparent === true) {
      root.style.setProperty('--header-bg', 'transparent');
      root.style.setProperty('--header-blur', 'none');
      root.style.setProperty('--header-border', 'none');
    } else {
      root.style.setProperty('--header-bg', hexToRgba(headerColor, headerOpacity));
      root.style.removeProperty('--header-blur');
      root.style.removeProperty('--header-border');
    }

    // 5. Hero & Card Specifics
    if (settings.hero_overlay_opacity !== undefined) {
      let opacity = parseFloat(settings.hero_overlay_opacity);
      if (isNaN(opacity)) opacity = 0.8;
      root.style.setProperty('--hero-overlay-start', `rgba(0, 0, 0, ${opacity})`);
      root.style.setProperty('--hero-overlay-end', `rgba(0, 0, 0, ${opacity * 0.4})`);
    }

  }, [settings]);

  return null;
};

export default StyleInjector;