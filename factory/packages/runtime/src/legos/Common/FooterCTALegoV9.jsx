import React from 'react';

export default function FooterCTALegoV9({ data = {} }) {
  const { 
    tekst_titel = 'Klaar voor de start?',
    tekst_knop = 'Begin Nu' 
  } = data;

  return (
    <section className="py-32 px-6 bg-indigo-600 text-white text-center shadow-inner" data-dock-type="FooterCTALegoV9">
      <h2 className="text-4xl md:text-6xl font-black mb-10" data-dock-bind="tekst_titel">{tekst_titel}</h2>
      <button 
        className="bg-white text-indigo-600 px-16 py-6 rounded-full font-bold text-2xl shadow-2xl hover:scale-105 transition-transform"
        data-dock-bind="tekst_knop"
      >
        {tekst_knop}
      </button>
    </section>
  );
}
