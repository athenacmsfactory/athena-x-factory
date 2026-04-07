import React from 'react';

export default function FeatureLegoV9({ data = {} }) {
  const { 
    tekst_titel = 'Feature Titel',
    tekst_beschrijving = 'Beschrijving van de feature.',
    afbeelding_feature = '',
    keuze_positie = 'rechts' 
  } = data;

  return (
    <section className="py-24 px-6 bg-white" data-dock-type="FeatureLegoV9">
      <div className={'max-w-7xl mx-auto flex flex-col ' + (keuze_positie === 'links' ? 'md:flex-row-reverse' : 'md:flex-row') + ' items-center gap-20'}>
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-8" data-dock-bind="tekst_titel">{tekst_titel}</h2>
          <p className="text-xl text-slate-600 leading-relaxed" data-dock-bind="tekst_beschrijving">{tekst_beschrijving}</p>
        </div>
        <div className="flex-1 w-full">
          <img 
            src={afbeelding_feature} 
            className="rounded-3xl shadow-2xl w-full h-[400px] object-cover" 
            alt={tekst_titel}
            data-dock-bind="afbeelding_feature"
          />
        </div>
      </div>
    </section>
  );
}
