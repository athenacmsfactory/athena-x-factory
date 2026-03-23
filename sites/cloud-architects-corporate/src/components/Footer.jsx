import React from 'react';
import EditableText from './EditableText';

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
    <footer className="bg-white border-t border-slate-200 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-4">
              <img 
                src={getImageUrl(siteSettings.logo_url || "logo.png")} 
                alt="Logo" 
                className="h-10 w-auto object-contain"
              />
              <span className="text-xl font-bold tracking-tight text-primary">
                <EditableText bind="_site_settings.bedrijfsnaam" value={siteSettings.bedrijfsnaam} />
              </span>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed max-w-md">
              <EditableText bind="footer.brand_description" value={data.brand_description} />
            </p>
            <div className="flex gap-4">
              {['linkedin', 'github', 'twitter'].map(platform => (
                <a 
                  key={platform}
                  href={siteSettings.socials?.[platform] || "#"} 
                  className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all"
                >
                  <i className={`fa-brands fa-${platform}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Contact */}
          <div className="md:col-span-4 space-y-6">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Corporate Headquarters</h4>
            <div className="space-y-4 text-slate-600">
              <div className="flex items-start gap-4">
                <i className="fa-solid fa-location-dot mt-1 text-primary"></i>
                <EditableText bind="_site_settings.adres" value={siteSettings.adres} />
              </div>
              <div className="flex items-center gap-4">
                <i className="fa-solid fa-envelope text-primary"></i>
                <EditableText bind="_site_settings.email" value={siteSettings.email} />
              </div>
              <div className="flex items-center gap-4">
                <i className="fa-solid fa-phone text-primary"></i>
                <EditableText bind="_site_settings.telefoon" value={siteSettings.telefoon} />
              </div>
            </div>
          </div>

          {/* Business Hours / Status */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Business Support</h4>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 italic text-slate-500 text-sm">
              Our enterprise support team is available 24/7 for premium tier clients.
            </div>
            <button className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all shadow-md">
              CLIENT LOGIN
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs font-medium">
          <EditableText bind="footer.copyright" value={data.copyright} />
          <div className="flex gap-8 uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">Compliance</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;