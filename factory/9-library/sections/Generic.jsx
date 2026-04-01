import React from 'react';
import { useLego, bindProps } from '../lib/LegoUtils';

function GenericSection({ data, sectionName = 'generic' }) {
  const item = data?.[0] || {
    titel: 'Sectie Titel',
    tekst: 'Voeg hier jouw inhoud toe. Dit is een generieke sectie die je volledig kan aanpassen.',
    cta: 'Meer Info'
  };

  const title = useLego(item, 'titel', 'Sectie Titel');
  const text = useLego(item, 'tekst', 'Voeg hier jouw inhoud toe.');
  const cta = useLego(item, 'cta', 'Meer Info');

  return (
    <section id={sectionName} className="py-24 px-8 bg-white" data-dock-section={sectionName}>
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-blue-600 font-black text-sm uppercase tracking-widest mb-4 block">Sectie</span>
        <h2 
          className="text-5xl font-black text-slate-900 tracking-tighter mb-8"
          {...bindProps(title, sectionName, 0)}
        >
          {title.content}
        </h2>
        <p 
          className="text-xl text-slate-500 leading-relaxed mb-12 max-w-2xl mx-auto"
          {...bindProps(text, sectionName, 0)}
        >
          {text.content}
        </p>
        {cta.content && (
          <button 
            className="bg-slate-900 text-white font-black px-10 py-4 rounded-2xl hover:bg-black transition-all"
            {...bindProps(cta, sectionName, 0)}
          >
            {cta.content}
          </button>
        )}
      </div>
    </section>
  );
}

export default GenericSection;
