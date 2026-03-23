import React from 'react';
import EditableText from './EditableText';

const Footer = ({ data = {}, siteSettings = {} }) => {
  return (
    <footer className="bg-[#050505] pt-24 pb-12 border-t border-primary/20 relative overflow-hidden">
      {/* Matrix-like Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* System Identity */}
          <div className="md:col-span-5 space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-primary flex items-center justify-center skew-x-[-12deg]">
                 <span className="text-black font-black text-2xl skew-x-[12deg]">
                   {siteSettings.bedrijfsnaam?.charAt(0) || "C"}
                 </span>
               </div>
               <div className="flex flex-col">
                 <span className="text-2xl font-serif font-black tracking-tighter text-primary uppercase">
                   <EditableText bind="_site_settings.bedrijfsnaam" value={siteSettings.bedrijfsnaam} />
                 </span>
               </div>
            </div>
            
            <p className="text-slate-400 text-lg leading-relaxed max-w-md font-mono border-l-2 border-secondary pl-6 py-2">
              <EditableText bind="footer.brand_description" value={data.brand_description} />
            </p>

            <div className="flex gap-4">
              {['linkedin', 'github', 'twitter'].map(platform => (
                <a 
                  key={platform}
                  href={siteSettings.socials?.[platform] || "#"} 
                  className="w-12 h-12 bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-all hover:shadow-[0_0_15px_rgba(0,243,255,0.5)] group"
                >
                  <i className={`fa-brands fa-${platform} group-hover:scale-110 transition-transform`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Core access nodes */}
          <div className="md:col-span-4 space-y-8">
            <h4 className="text-xs uppercase tracking-[0.4em] text-secondary font-black flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary animate-pulse"></span>
              Sys.Contact
            </h4>
            <div className="space-y-6 font-mono text-slate-300">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 border border-primary/20 flex items-center justify-center group-hover:border-primary transition-colors">
                  <i className="fa-solid fa-terminal text-primary text-xs"></i>
                </div>
                <span className="group-hover:text-primary transition-colors">
                  <EditableText bind="_site_settings.email" value={siteSettings.email} />
                </span>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 border border-primary/20 flex items-center justify-center group-hover:border-primary transition-colors">
                  <i className="fa-solid fa-signal text-primary text-xs"></i>
                </div>
                <span className="group-hover:text-primary transition-colors">
                  <EditableText bind="_site_settings.telefoon" value={siteSettings.telefoon} />
                </span>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 border border-primary/20 flex items-center justify-center group-hover:border-primary transition-colors">
                  <i className="fa-solid fa-map-pin text-primary text-xs"></i>
                </div>
                <span className="group-hover:text-primary transition-colors">
                  <EditableText bind="_site_settings.adres" value={siteSettings.adres} />
                </span>
              </div>
            </div>
          </div>

          {/* Cyber CTA */}
          <div className="md:col-span-3">
             <div className="p-8 border-2 border-primary/50 bg-black relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-primary/20 border-l border-b border-primary"></div>
                <h4 className="text-xl font-black text-primary mb-4 uppercase tracking-tighter">Initialize Link</h4>
                <p className="text-[10px] text-slate-500 mb-8 font-mono">ESTABLISHING SECURE PROTOCOL FOR ARCHITECTURAL OVERRIDE...</p>
                <button className="w-full py-4 bg-primary text-black font-black uppercase tracking-widest hover:bg-secondary transition-colors relative overflow-hidden group/btn">
                  <span className="relative z-10">CONNECT_ROOT</span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></div>
                </button>
             </div>
          </div>
        </div>

        <div className="pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-[10px] font-mono tracking-widest uppercase">
          <EditableText bind="footer.copyright" value={data.copyright} />
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors flex items-center gap-2">
              <span className="w-1 h-1 bg-primary rounded-full"></span>
              Privacy_Manifesto
            </a>
            <a href="#" className="hover:text-primary transition-colors flex items-center gap-2">
               <span className="w-1 h-1 bg-primary rounded-full"></span>
               Control_Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;