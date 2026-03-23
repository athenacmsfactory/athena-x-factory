import React from 'react';
import EditableText from './EditableText';

export default function Footer({ data, siteSettings = {} }) {
  const footerSource = data?.footer || [];
  const footerData = Array.isArray(footerSource) ? (footerSource[0] || {}) : footerSource;
  const settings = Array.isArray(siteSettings) ? (siteSettings[0] || {}) : siteSettings;
  
  const naam = settings.bedrijfsnaam || 'Cloud Architects';
  const tagline = settings.tagline || 'Future-Proof Architecture';
  const email = settings.email || 'hello@cloudarchitects.io';
  const adres = settings.adres || 'Innovation Drive 42, Brussel';

  return (
    <footer className="py-24 bg-black text-white border-t border-white/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -mr-48 -mt-48 opacity-50"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 mb-20">
          
          {/* Brand Identity */}
          <div className="space-y-8">
            <h3 className="text-4xl font-serif font-bold tracking-tighter">
              <EditableText value={naam} cmsBind={{ file: '_site_settings', index: 0, key: 'bedrijfsnaam' }} />
            </h3>
            <p className="text-xl leading-relaxed font-light opacity-70">
              <EditableText value={tagline} cmsBind={{ file: '_site_settings', index: 0, key: 'tagline' }} />
            </p>
            <div className="flex gap-4 pt-4">
               <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">
                  <i className="fa-brands fa-linkedin-in"></i>
               </div>
               <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">
                  <i className="fa-brands fa-x-twitter"></i>
               </div>
            </div>
          </div>

          {/* Quick Contact */}
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-accent">Connect</h4>
            <ul className="space-y-6">
              <li className="group flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Email</span>
                <span className="text-lg font-bold group-hover:text-accent transition-colors">
                   <EditableText value={email} cmsBind={{ file: '_site_settings', index: 0, key: 'email' }} />
                </span>
              </li>
              <li className="group flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Location</span>
                <span className="text-lg font-bold">
                   <EditableText value={adres} cmsBind={{ file: '_site_settings', index: 0, key: 'adres' }} />
                </span>
              </li>
            </ul>
          </div>

          {/* Call to Action Small */}
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-accent">Vision</h4>
            <div className="space-y-6">
              <p className="text-lg font-light leading-relaxed italic opacity-80">
                <EditableText 
                  value={footerData.beschrijving || 'Wij transformeren complexe uitdagingen in schaalbare cloud oplossingen.'} 
                  cmsBind={{ file: 'footer', index: 0, key: 'beschrijving' }} 
                />
              </p>
              <div className="pt-4 flex items-center gap-2 opacity-30 text-[10px] font-black uppercase tracking-widest">
                 <img src="./athena-icon.svg" alt="Athena" className="w-4 h-4 grayscale invert" />
                 <span>Athena Factory Certified</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest opacity-50">
          <p>© {new Date().getFullYear()} {naam}. All Scale Secured.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}