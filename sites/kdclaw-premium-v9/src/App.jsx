import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, Workflow, Cpu, Database, Layout, Sparkles, Send } from 'lucide-react';

const App = () => {
  return (
    <div className="min-h-screen font-body scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-on-surface/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-display font-bold tracking-tighter text-primary">
            KD<span className="text-on-surface">CLAW</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#hero" className="nav-link">Home</a>
            <a href="#skills" className="nav-link">Resilience</a>
            <a href="#journey" className="nav-link">Journey</a>
            <button className="btn-primary flex items-center gap-2 text-sm px-5 py-2">
              <Send size={16} /> Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Abstract Background Glow */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        
        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high/50 border border-on-surface/10 text-primary text-sm font-medium"
          >
            <Sparkles size={14} /> Athena V9.2 Standard
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-8xl font-display font-bold tracking-tighter leading-tight"
          >
            Resilient <span className="text-primary">Innovation</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-on-surface/70 leading-relaxed"
          >
            A focus on <span className="text-on-surface font-semibold">Node.js</span>, 
            <span className="text-on-surface font-semibold"> pnpm</span> precision, 
            and <span className="text-on-surface font-semibold">Athena V9</span> ecosystem engineering. 
            Architecting solutions with unwavering focus and high-end aesthetics.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <button className="btn-primary px-8 py-4 text-lg">
              Collaborate Now
            </button>
            <button className="px-8 py-4 text-lg rounded-xl border border-on-surface/10 hover:bg-on-surface/5 transition-colors">
              Explore Journey
            </button>
          </motion.div>
        </div>
      </section>

      {/* Skills / Resilience Section */}
      <section id="skills" className="py-24 px-6 bg-surface-container-low/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="w-full md:w-1/3 space-y-6">
              <h2 className="text-4xl font-display font-bold">Resilient Problem Solving</h2>
              <p className="text-on-surface/60 leading-relaxed text-lg">
                Leveraging ASS-driven attention to detail to build hyper-precise engineering solutions. My approach is rooted in technical rigor and professional recovery.
              </p>
              <div className="p-6 glass-card space-y-4 border-primary/20">
                <div className="flex items-center gap-3 text-primary">
                  <Shield size={24} />
                  <span className="font-bold">Dignity & Strength</span>
                </div>
                <p className="text-sm text-on-surface/70">
                  Transforming challenges into strategic advantages through dedicated focus and continuous learning.
                </p>
              </div>
            </div>
            
            <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: <Cpu />, title: 'Core Engineering', desc: 'Expertise in Node.js, V8 optimization, and persistent systems.', tech: ['Node.js', 'V8', 'Concurrency'] },
                { icon: <Workflow />, title: 'Athena Ecosystem', desc: 'Deep involvement in V9 monorepo orchestration and tooling.', tech: ['Athena V9', 'Monorepos', 'CI/CD'] },
                { icon: <Database />, title: 'Package Mastery', desc: 'Highly efficient dependency management using pnpm structures.', tech: ['pnpm', 'NPM', 'Security'] },
                { icon: <Layout />, title: 'Frontend UI/UX', desc: 'Building premium, high-performance interfaces with React & Vite.', tech: ['React 19', 'Tailwind v4', 'Framer'] },
              ].map((skill, i) => (
                <div key={i} className="p-8 glass-card group hover:border-primary/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    {skill.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{skill.title}</h3>
                  <p className="text-on-surface/60 text-sm mb-6 leading-relaxed">{skill.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {skill.tech.map((t, j) => (
                      <span key={j} className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold bg-on-surface/5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section id="journey" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -z-10" />
        
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-display font-bold">The Architect's Ascent</h2>
            <p className="text-on-surface/60 text-lg">A story of professional recovery, technical growth, and mission-driven focus.</p>
          </div>

          <div className="relative border-l-2 border-on-surface/10 pl-8 ml-4 space-y-12">
            {[
              { year: 'Phase I', title: 'Building Through Challenges', content: 'Developing a foundation in systems engineering and architectural rigor despite external hurdles. Factual focus on recovery and skill acquisition.' },
              { year: 'Phase II', title: 'Ecosystem Mastery', content: 'Diving deep into the Athena V9 ecosystem. Mastering pnpm and large-scale Node.js architectures as part of a strategic re-integration goal.' },
              { year: 'Phase III', title: 'Resilient Innovation', content: 'Current mission: Achieving financial independence through professional tech contributions and high-end solution delivery.' },
            ].map((step, i) => (
              <div key={i} className="relative group">
                <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary transition-transform group-hover:scale-125" />
                <div className="inline-block px-3 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase mb-4">
                  {step.year}
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-on-surface/70 leading-relaxed">
                  {step.content}
                </p>
              </div>
            ))}
          </div>

          <div className="p-8 glass-card bg-primary/5 border-primary/20 text-center space-y-6">
            <h3 className="text-2xl font-bold">Our Mission</h3>
            <p className="text-on-surface/80 leading-relaxed mx-auto max-w-2xl">
              Success through resilience. Contributing to the global tech ecosystem while maintaining a factual, substantiating presence aimed at recovery and professional excellence.
            </p>
            <button className="btn-primary">
              View Extended Portfolio
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-on-surface/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-display font-bold tracking-tighter">
            KD<span className="text-primary">CLAW</span> &copy; 2026
          </div>
          <div className="text-sm text-on-surface/40">
            Powered by Athena V9.2 Engine • Resilient Innovation
          </div>
          <div className="flex gap-6">
            <a href="#" className="nav-link text-sm">GitHub</a>
            <a href="#" className="nav-link text-sm">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
