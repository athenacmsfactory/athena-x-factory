import React, { useMemo } from 'react';
import { HashRouter as Router } from 'react-router-dom';

import Header from './components/Header';
import Section from './components/Section';
import Footer from './components/Footer';
import StyleInjector from './components/StyleInjector';

import { DisplayConfigProvider } from './components/DisplayConfigContext';

const App = ({ data }) => {
  const primaryTable = Object.keys(data)[0];

  const content = (
    <DisplayConfigProvider data={data}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] transition-colors duration-500 selection:bg-accent selection:text-white">
          <StyleInjector siteSettings={data._style_config} />
          
          <Header siteSettings={data._site_settings} />
          
          <main style={{ paddingTop: 'var(--content-top-offset, 0px)' }}>
            <Section data={data} />
          </main>

          <Footer data={data.footer} siteSettings={data._site_settings} />
        </div>
      </Router>
    </DisplayConfigProvider>
  );

  

    return content;
};

export default App;