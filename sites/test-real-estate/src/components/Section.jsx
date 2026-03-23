import React from 'react';

const Section = ({ data }) => {
        const getImageUrl = (url) => {
    if (!url) return '';
    if (typeof url === 'object') url = url.text || url.url || '';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    const base = import.meta.env.BASE_URL || '/';
    if (url.startsWith(base) && base !== '/') return url;
    const isRootPublic = url.startsWith('./') || url.endsWith('.svg') || url.endsWith('.ico') || url === 'site-logo.svg' || url === 'athena-icon.svg';
    const hasImagesPrefix = url.includes('/images/') || url.startsWith('images/');
    const pathPrefix = (isRootPublic || hasImagesPrefix) ? '' : 'images/';
    return (base + pathPrefix + url.replace('./', '')).replace(new RegExp('/+', 'g'), '/');
  };
  const sections = [{"table":"Agency_Info"},{"table":"Panden"},{"table":"Agenten"}];

  return (
    <>
      {sections.map((sec, idx) => {
        const items = data[sec.table] || [];
        return (
          <section key={idx} id={"sectie-" + sec.table.toLowerCase()} className="py-20 px-6 max-w-7xl mx-auto border-b border-slate-50 last:border-0">
            <h2 className="text-3xl font-black mb-12 text-slate-900 uppercase tracking-tighter">
              {sec.table}
            </h2>
            <div className="flex flex-wrap justify-center gap-10">
              {items.map((item, index) => (
                <div key={index} className="group p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                   {Object.entries(item).map(([key, val]) => {
                      if (typeof val !== 'string' || key.includes('_url')) return null;
                      const isTitle = key.toLowerCase().includes('titel') || key.toLowerCase().includes('naam');
                      return (
                        <div key={key} className={isTitle ? 'text-2xl font-bold mb-3 text-slate-900' : 'text-slate-500 text-sm leading-relaxed'}>
                          {val}
                        </div>
                      );
                   })}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
};

export default Section;