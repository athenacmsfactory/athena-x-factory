import React from 'react';

export default function ReviewsLegoV9({ data = {} }) {
  const { 
    tekst_sectie_titel = 'Klantbeoordelingen',
    lijst_reviews = [] 
  } = data;

  return (
    <section className="py-24 px-6 bg-slate-900 text-white" data-dock-type="ReviewsLegoV9">
      <h2 className="text-4xl font-bold text-center mb-16" data-dock-bind="tekst_sectie_titel">{tekst_sectie_titel}</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {lijst_reviews.map((r, i) => (
          <div 
            key={i} 
            className="bg-slate-800 p-8 rounded-2xl border border-slate-700 max-w-sm"
            data-dock-group={'lijst_reviews.' + i}
          >
            <div className="text-yellow-400 mb-4">{'★'.repeat(r.cijfer_score || 5)}</div>
            <p className="text-lg mb-6 italic" data-dock-bind="tekst_content">"{r.tekst_content}"</p>
            <p className="font-bold text-indigo-400" data-dock-bind="tekst_naam">- {r.tekst_naam}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
