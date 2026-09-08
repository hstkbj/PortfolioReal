import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Clock, Calendar, Tag } from 'lucide-react';
import { useBlogPosts } from '../hooks/usePortfolio';
import { Badge } from '../components/common/Badge';

export const BlogPage: React.FC = () => {
  const { data: posts = [], isLoading } = useBlogPosts(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(posts.map((p) => p.category)))];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
            Publications & Blog
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
            Articles & Retours d'expérience technique
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">
            Analyses architecturales, optimisations de performances PostgreSQL/MySQL, bonnes pratiques Laravel & React.
          </p>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
                }`}
              >
                {cat === 'all' ? 'Tous les articles' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-zinc-400 font-mono text-sm">
            Chargement des articles...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl border border-zinc-200 p-8">
            <p className="text-sm text-zinc-500">Aucun article ne correspond à votre recherche.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-3 text-xs font-mono text-zinc-900 underline"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col rounded-xl border border-zinc-200 bg-white overflow-hidden hover:border-zinc-300 hover:shadow-md transition-all"
              >
                <div className="aspect-16/9 overflow-hidden bg-zinc-100">
                  <img
                    src={post.main_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                      <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-medium">
                        {post.category}
                      </span>
                      <span>•</span>
                      <span>{post.reading_time_minutes} min de lecture</span>
                    </div>

                    <h2 className="text-base font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors line-clamp-2">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-zinc-600 line-clamp-3 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-zinc-100">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[11px] font-mono text-zinc-500">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-zinc-400 font-mono">
                        {new Date(post.published_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="font-medium text-zinc-900 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Lire</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
