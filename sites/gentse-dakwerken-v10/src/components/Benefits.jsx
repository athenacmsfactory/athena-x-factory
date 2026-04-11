import React from 'react';

const iconMap = {
  roof: "/images/roof.webp",
  solar: "/images/solar.webp",
  repair: "/images/repair.webp"
};

/**
 * Athena V9.2 compliant Benefits Component
 * Style: Modern Midnight Tech (Slate cards)
 */
export default function BenefitsLegoV9({ data = {}, sectionName = 'voordelen' }) {
  const {
    tekst_sectie_titel = 'Onze Specialisaties',
    items = []
  } = data;

  const base = import.meta.env.BASE_URL || '/';
  const getFullImgPath = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return (base + (url.startsWith('/') ? url.slice(1) : url)).replace(/\/+/g, '/');
  };

  return (
    <section 
      id={sectionName}
      className="py-24 px-6 bg-midnight"
      data-dock-section={sectionName}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 
          className="text-3xl md:text-5xl font-bold text-white mb-20 tracking-tighter"
          data-dock-bind={JSON.stringify({ file: sectionName, index: 0, key: 'tekst_sectie_titel' })}
        >
          {tekst_sectie_titel}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => {
            const rawImg = item.afbeelding_thumbnail || iconMap[item.icoon_type] || "images/roof.webp";
            const finalImg = getFullImgPath(rawImg);
            
            return (
              <div
                key={item.id || index}
                className="p-10 bg-[#1e293b] border border-[#334155] rounded-xl text-left transition-all hover:border-indigo-500/50 hover:shadow-2xl"
              >
                <div className="mb-8 w-24 h-14 flex items-center justify-start overflow-hidden rounded-lg bg-black/20">
                  <img 
                    src={finalImg} 
                    alt={item.tekst_titel} 
                    className="w-full h-full object-contain p-1"
                    data-dock-type="media"
                    data-dock-bind={JSON.stringify({ file: sectionName, index, key: 'afbeelding_thumbnail' })}
                  />
                </div>
              
              <h3 
                className="text-xl font-bold text-[#818cf8] mb-6 font-mono tracking-tight"
                data-dock-bind={JSON.stringify({ file: sectionName, index, key: 'tekst_titel' })}
              >
                {item.tekst_titel}
              </h3>
              
              <p 
                className="text-[#cbd5e1] leading-relaxed font-mono text-xl opacity-95"
                data-dock-bind={JSON.stringify({ file: sectionName, index, key: 'tekst_beschrijving' })}
              >
                {item.tekst_beschrijving}
              </p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
