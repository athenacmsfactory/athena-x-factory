import React from 'react';

export default function Footer({ data }) {
  const settingsSource = data?.site_settings || {};
  const settings = Array.isArray(settingsSource) ? (settingsSource[0] || {}) : settingsSource;
  const contactInfo = data?.contact?.[0] || {};

  const naam = settings.site_name || "gentse-dakwerken-v10";
  const email = contactInfo.email || settings.email || '';
  const locatie = contactInfo.location || '';
  const btw = contactInfo.btw_nummer || contactInfo.btw || '';
  const linkedin = contactInfo.linkedin_url || contactInfo.linkedin || '';

  return (
    <footer
      className="py-24 text-slate-400 border-t border-slate-900 bg-midnight relative overflow-hidden"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 mb-20">

          {/* Brand Identity */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white uppercase tracking-tighter">
              {naam}
            </h3>
            <p className="text-lg leading-relaxed font-mono opacity-80">
              {settings.tagline}
            </p>
          </div>

          {/* Opening Hours */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-400">
              Openingsuren
            </h4>
            <div className="space-y-3 font-mono text-base">
               {(data.openingHours || []).map((oh, i) => (
                 <div key={i} className="flex justify-between border-b border-white/5 pb-1">
                   <span className="text-slate-500">{oh.tekst_dag}:</span>
                   <span className="text-white">{oh.tekst_uren}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-400">
              Contact
            </h4>
            <ul className="space-y-4 font-mono text-base">
              <li>{email || 'info@gentsedakwerken.be'}</li>
              <li>{contactInfo.telefoon || settings.telefoon || '+32 470 00 00 00'}</li>
              <li>{locatie || 'Industrieweg 12, 9000 Gent'}</li>
            </ul>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-mono uppercase tracking-[0.2em] opacity-60 text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} {naam}. All rights reserved.</p>
          <p>{settings.footer_credit_text || 'Powered by Auto-F | Generation 2 AI Factory'}</p>
        </div>
      </div>
    </footer>
  );
}