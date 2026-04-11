import React from 'react';

/**
 * Athena V9.2 compliant Contact Info Component
 */
export default function ContactInfo({ data = {}, sectionName = 'contact_info', sectionTitle }) {
  const {
    tekst_email = 'info@voorbeeld.be',
    tekst_telefoon = '+32 000 00 00',
    tekst_adres = 'Straat 1, Stad'
  } = (Array.isArray(data) ? data[0] : data) || {};

  return (
    <section 
      id={sectionName}
      className="py-20 px-6 bg-midnight text-white border-t border-slate-900/50"
      data-dock-section={sectionName}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 tracking-tighter">
          {sectionTitle || 'Contact Us'}
        </h2>
        <div className="space-y-6 text-xl md:text-2xl text-slate-400 font-bold">
          <p data-dock-bind={JSON.stringify({ file: 'contact', index: 0, key: 'email' })}>Email: {tekst_email || data.email}</p>
          <p data-dock-bind={JSON.stringify({ file: 'contact', index: 0, key: 'telefoon' })}>Phone: {tekst_telefoon || data.telefoon}</p>
          <p data-dock-bind={JSON.stringify({ file: 'contact', index: 0, key: 'locatie' })}>Address: {tekst_adres || data.locatie}</p>
        </div>
      </div>
    </section>
  );
}
