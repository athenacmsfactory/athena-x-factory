import React from 'react';
import EditableText from './EditableText';
import EditableMedia from './EditableMedia';

const Footer = ({ data = {}, siteSettings = {} }) => {
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

  return (
    <footer className="relative bg-[var(--color-background)] pt-24 pb-12 overflow-hidden">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-4">
              <img 
                src={getImageUrl(siteSettings.logo_url || "logo.png")} 
                alt="Logo" 
                className="h-12 w-auto object-contain brightness-110"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-serif font-black tracking-tight text-primary">
                  <EditableText bind="_site_settings.bedrijfsnaam" value={siteSettings.bedrijfsnaam} />
                </span>
              </div>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed max-w-md font-light italic">
              <EditableText bind="footer.brand_description" value={data.brand_description} />
            </p>
            <div className="flex gap-4">
              {['linkedin', 'github', 'twitter'].map(platform => (
                <a 
                  key={platform}
                  href={siteSettings.socials?.[platform] || "#"} 
                  className="w-10 h-10 rounded-xl bg-white/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  <i className={`fa-brands fa-${platform}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-8">
            <h4 className="text-xs uppercase tracking-[0.3em] text-accent font-bold">Contact</h4>
            <div className="space-y-4 text-slate-600">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-envelope text-primary"></i>
                </div>
                <EditableText bind="_site_settings.email" value={siteSettings.email} />
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-phone text-primary"></i>
                </div>
                <EditableText bind="_site_settings.telefoon" value={siteSettings.telefoon} />
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-location-dot text-primary"></i>
                </div>
                <EditableText bind="_site_settings.adres" value={siteSettings.adres} />
              </div>
            </div>
          </div>

          {/* CTA / Newsletter */}
          <div className="md:col-span-3">
             <div className="p-8 rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/40 shadow-xl relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <h4 className="text-xl font-bold text-primary mb-4">Let's build together</h4>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">Ready to transform your cloud infrastructure?</p>
                <button className="w-full py-3 bg-[var(--color-button-bg)] text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                  GET STARTED
                </button>
             </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
          <EditableText bind="footer.copyright" value={data.copyright} />
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;