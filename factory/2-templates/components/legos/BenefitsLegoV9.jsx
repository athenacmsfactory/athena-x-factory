import React from 'react';

export default function BenefitsLegoV9({ data = {} }) {
  const { 
    tekst_sectie_titel = 'Onze Voordelen',
    lijst_voordelen = [] 
  } = data;

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto" data-dock-type="BenefitsLegoV9">
      <h2 
        className="text-4xl font-bold text-center mb-16"
        data-dock-bind="tekst_sectie_titel"
      >
        {tekst_sectie_titel}
      </h2>
      <div className="grid md:grid-cols-3 gap-10">
        {lijst_voordelen.map((item, i) => (
          <div 
            key={i} 
            className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all"
            data-dock-group={'lijst_voordelen.' + i}
          >
            <div className="text-5xl mb-6" data-dock-bind="icoon_emoji">{item.icoon_emoji}</div>
            <h3 className="text-2xl font-bold mb-4" data-dock-bind="tekst_titel">{item.tekst_titel}</h3>
            <p className="text-slate-600" data-dock-bind="tekst_omschrijving">{item.tekst_omschrijving}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
