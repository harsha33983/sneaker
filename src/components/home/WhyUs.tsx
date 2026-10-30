import React from 'react';
import { Sparkles, Clock, Compass } from 'lucide-react';

export default function WhyUs() {
  const features = [
    {
      icon: Sparkles,
      title: 'CURATED DROPS',
      description:
        'Carefully selected sneaker collections designed and curated in collaboration with forward-thinking streetwear artisans.',
      tag: 'CRAFT',
    },
    {
      icon: Clock,
      title: 'EXCLUSIVE RELEASES',
      description:
        'Real-time access to ultra-limited quantities. Join waitlists for impending drops before public allocations sell out.',
      tag: 'SPEED',
    },
    {
      icon: Compass,
      title: 'SNEAKER CULTURE',
      description:
        'Built exclusively for aficionados who celebrate the historical, aesthetic, and architectural significance of sneaker design.',
      tag: 'COMMUNITY',
    },
  ];

  return (
    <section className="py-24 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-[#D7FF45] uppercase">
            WHY SNEAKERDROP
          </span>
          <h2 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#F5F3EE] mt-2">
            DESIGNED FOR THE OBSESSED
          </h2>
          <p className="text-sm text-[#A4A19B] mt-3">
            An ecosystem tailored specifically to the nuances of exclusive releases and modern footwear culture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group bg-[#181818] border border-[#2b2b2b] hover:border-[#D7FF45]/50 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#222222] border border-[#333333] flex items-center justify-center text-[#D7FF45] group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-[#777777] uppercase font-bold">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-space)] text-xl font-bold uppercase tracking-tight text-[#F5F3EE] mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#A4A19B] leading-relaxed font-light">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
