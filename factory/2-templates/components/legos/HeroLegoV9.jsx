import React from 'react';

export default function HeroLegoV9({ data = {}, bind = {} }) {
  const { 
    tekst_titel = 'Athena V9.2 Hero',
    tekst_subtitel = 'De nieuwe standaard voor modulaire websites.',
    tekst_knop = 'Ontdek meer',
    afbeelding_bg = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1600'
  } = data;

  return (
    <section 
      className="relative bg-indigo-700 text-white py-32 px-6 text-center overflow-hidden"
      data-dock-type="HeroLegoV9"
    >
      {/* Achtergrond met binding */}
      <div className="absolute inset-0 z-0">
        <img 
          src={afbeelding_bg} 
          className="w-full h-full object-cover" 
          alt="Hero Background"
          data-dock-bind="afbeelding_bg"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <h1 
          className="text-5xl md:text-8xl font-black mb-8 tracking-tighter shadow-sm"
          data-dock-bind="tekst_titel"
        >
          {tekst_titel}
        </h1>
        <p 
          className="text-xl md:text-3xl mb-12 opacity-90 font-light"
          data-dock-bind="tekst_subtitel"
        >
          {tekst_subtitel}
        </p>
        <button 
          className="bg-white text-indigo-800 px-12 py-5 rounded-full font-bold text-2xl shadow-2xl hover:scale-105 transition-transform"
          data-dock-bind="tekst_knop"
        >
          {tekst_knop}
        </button>
      </div>
    </section>
  );
}
