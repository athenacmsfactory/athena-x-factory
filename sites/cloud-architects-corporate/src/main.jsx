import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './css/corporate.css';
import './dock-connector.js';

async function init() {
  const data = {};
  // Dummy data loading logic for local development
  try {
    
    const dataModules = import.meta.glob('./data/*.json', { eager: true });
    const siteData = {};
    Object.entries(dataModules).forEach(([path, module]) => {
      const key = path.split('/').pop().replace('.json', '');
      const content = module.default;
      siteData[key] = content;
    });

    // Robust Unwrapping Pattern
    const unwrap = (val) => (Array.isArray(val) ? (val[0] || {}) : (val || {}));

    Object.assign(data, {
      ...siteData,
      _site_settings: unwrap(siteData._site_settings || siteData.site_settings),
      _style_config: unwrap(siteData._style_config || siteData.style_config),
      section_order: siteData.section_order || ["hero", "expertise", "projects", "packages"]
    });

    // Ensure section data is always handled as an array for the Section component
    const coreSections = ['hero', 'expertise', 'projects', 'packages'];
    coreSections.forEach(s => {
      if (data[s] && !Array.isArray(data[s])) {
        data[s] = [data[s]];
      } else if (!data[s]) {
        // Fallback for basis -> hero
        if (s === 'hero' && siteData.basis) data[s] = Array.isArray(siteData.basis) ? siteData.basis : [siteData.basis];
        else data[s] = [];
      }
    });
    if (window.athenaScan) window.athenaScan(data);
  } catch (e) {
    console.error("Data laad fout:", e);
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App data={data} />
    </React.StrictMode>
  );
}

init();
