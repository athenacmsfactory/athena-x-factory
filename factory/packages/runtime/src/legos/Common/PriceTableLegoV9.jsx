import React from 'react';

export default function PriceTableLegoV9({ data = {} }) {
  const { 
    tekst_sectie_titel = 'Prijzen',
    lijst_prijzen = [] 
  } = data;

  return (
    <section className="py-24 px-6" data-dock-type="PriceTableLegoV9">
      <h2 className="text-4xl font-bold text-center mb-16" data-dock-bind="tekst_sectie_titel">{tekst_sectie_titel}</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {lijst_prijzen.map((p, i) => (
          <div 
            key={i} 
            className={'p-12 rounded-3xl border-2 ' + (p.keuze_populair === 'Ja' ? 'border-indigo-600 shadow-2xl scale-105' : 'border-slate-200')}
            data-dock-group={'lijst_prijzen.' + i}
          >
            <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2" data-dock-bind="tekst_naam">{p.tekst_naam}</h3>
            <div className="text-5xl font-black mb-8">€{p.tekst_prijs}</div>
            <ul className="mb-10 space-y-4">
              {(p.lijst_kenmerken || []).map((k, j) => <li key={j} className="flex items-center gap-3">✅ {k}</li>)}
            </ul>
            <button 
              className={'w-full py-4 rounded-xl font-bold ' + (p.keuze_populair === 'Ja' ? 'bg-indigo-600 text-white' : 'bg-slate-100')}
              data-dock-bind="tekst_knop"
            >
              {p.tekst_knop || 'Kies Plan'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
