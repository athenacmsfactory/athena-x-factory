import React, { useState } from 'react';

/**
 * Athena V9.2 compliant Contact Form Component
 */
export default function Contact({ data = {}, sectionName = 'contact', sectionTitle }) {
  const [status, setStatus] = useState('idle');
  
  const {
    tekst_sectie_titel = sectionTitle || 'Neem Contact Op',
    tekst_subtitel = 'Heeft u een vraag of wilt u een offerte? Laat uw gegevens achter.'
  } = (Array.isArray(data) ? data[0] : data) || {};

  return (
    <section 
      id={sectionName}
      className="py-32 px-6 bg-midnight border-t border-slate-900/50 relative overflow-hidden"
      data-dock-section={sectionName}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tighter"
            data-dock-bind={JSON.stringify({ file: sectionName, index: 0, key: 'tekst_sectie_titel' })}
          >
            {tekst_sectie_titel}
          </h2>
          <p 
            className="text-slate-400 font-mono text-lg"
            data-dock-bind={JSON.stringify({ file: sectionName, index: 0, key: 'tekst_subtitel' })}
          >
            {tekst_subtitel}
          </p>
        </div>

        <form 
          onSubmit={(e) => { e.preventDefault(); setStatus('success'); }} 
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Uw Naam"
              className="w-full bg-transparent border border-slate-800 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono text-lg"
            />
            <input 
              type="email" 
              placeholder="Uw E-mailadres"
              className="w-full bg-transparent border border-slate-800 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono text-lg"
            />
          </div>
          <textarea 
            placeholder="Uw Bericht"
            rows={5}
            className="w-full bg-transparent border border-slate-800 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none font-mono text-lg"
          />
          <button 
            type="submit"
            className="btn-sans w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 rounded-lg transition-colors uppercase tracking-widest text-lg shadow-lg"
          >
            {status === 'success' ? 'Bericht Verzonden!' : 'Verzenden'}
          </button>
        </form>
      </div>
    </section>
  );
}
