import React, { useState } from 'react';
import { Code2, Server, Database, Wrench, CheckCircle } from 'lucide-react';
import { useSkills } from '../hooks/usePortfolio';
import { SkillCategoryType } from '../types';

export const SkillsPage: React.FC = () => {
  const { data: skills = [], isLoading } = useSkills();
  const [activeTab, setActiveTab] = useState<'all' | SkillCategoryType>('all');

  const categories = [
    { type: 'all', label: 'Toutes les compétences' },
    { type: 'frontend', label: 'Frontend' },
    { type: 'backend', label: 'Backend' },
    { type: 'database', label: 'Bases de données' },
    { type: 'tools', label: 'Outils & DevOps' },
  ];

  const filteredSkills = skills.filter(
    (s) => activeTab === 'all' || s.category === activeTab
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'frontend':
        return <Code2 className="w-4 h-4 text-blue-600" />;
      case 'backend':
        return <Server className="w-4 h-4 text-emerald-600" />;
      case 'database':
        return <Database className="w-4 h-4 text-amber-600" />;
      case 'tools':
      default:
        return <Wrench className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
            Expertise & Stack
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
            Compétences techniques & technologies
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">
            Une vision pragmatique des technologies web : choisir les bons outils adaptés aux exigences de performance, de fiabilité et de maintenabilité.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 pb-4 border-b border-zinc-200">
          {categories.map((cat) => (
            <button
              key={cat.type}
              onClick={() => setActiveTab(cat.type as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === cat.type
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-zinc-400 font-mono text-sm">
            Chargement des compétences...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-5 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-zinc-100 border border-zinc-200/80 shrink-0">
                      {getCategoryIcon(skill.category)}
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 text-base">{skill.name}</h3>
                      <span className="text-xs font-mono text-zinc-400 capitalize">{skill.category}</span>
                    </div>
                  </div>
                  {skill.is_featured && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-100 text-zinc-800 border border-zinc-200">
                      Top
                    </span>
                  )}
                </div>

                {/* Level / Progress */}
                {skill.level_percentage && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-mono text-zinc-500">
                      <span>Maîtrise</span>
                      <span>{skill.level_percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full bg-zinc-900 rounded-full transition-all duration-500"
                        style={{ width: `${skill.level_percentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Years of practice */}
                {skill.years_experience && (
                  <div className="text-xs text-zinc-500 font-mono pt-1 flex justify-between border-t border-zinc-100">
                    <span>Pratique en production</span>
                    <span className="font-semibold text-zinc-700">{skill.years_experience} ans</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
