import React from 'react';

const CTA = ({ data, sectionName }) => {
    if (!data || data.length === 0) return null;
    const item = data[0];
    const titelKey = Object.keys(item).find(k => /titel|header/i.test(k)) || 'titel';
    const tekstKey = Object.keys(item).find(k => /tekst|beschrijving/i.test(k)) || 'tekst';
    const btnKey = Object.keys(item).find(k => /knop|label|button/i.test(k)) || 'knop_label';
    const urlKey = Object.keys(item).find(k => /url|link/i.test(k)) || 'knop_url';
    const bgKey = Object.keys(item).find(k => /achtergrond|foto|image/i.test(k));

    return (
        <section id={sectionName} data-dock-section={sectionName} className="py-32 px-6 relative overflow-hidden flex items-center justify-center text-center">
            {bgKey && item[bgKey] ? (
                <div className="absolute inset-0 z-0">
                    <img 
                        src={item[bgKey]} 
                        data-dock-type="media"
                        data-dock-bind={JSON.stringify({ file: sectionName, index: 0, key: bgKey })}
                        className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
                </div>
            ) : (
                <div className="absolute inset-0 bg-[var(--color-primary)] z-0"></div>
            )}

            <div className="relative z-10 max-w-4xl mx-auto text-white">
                <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 leading-tight">
                    <span data-dock-bind={JSON.stringify({ file: sectionName, index: 0, key: titelKey })}>{item[titelKey]}</span>
                </h2>
                {tekstKey && (
                    <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
                        <span data-dock-bind={JSON.stringify({ file: sectionName, index: 0, key: tekstKey })}>{item[tekstKey]}</span>
                    </p>
                )}
                <a
                    href={item[urlKey] || "#contact"}
                    data-dock-type="link"
                    data-dock-bind={JSON.stringify({ file: sectionName, index: 0, key: urlKey })}
                    className="bg-white text-primary px-12 py-5 rounded-full text-xl font-bold shadow-2xl hover:bg-accent hover:text-white transition-all transform hover:scale-105 inline-block"
                >
                    {item[btnKey] || "Start Nu"}
                </a>
            </div>
        </section>
    );
};

export default CTA;
