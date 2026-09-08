import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, Tag, Share2, ArrowRight } from 'lucide-react';
import { useBlogPost, useBlogPosts } from '../hooks/usePortfolio';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = useBlogPost(slug || '');
  const { data: allPosts = [] } = useBlogPosts(true);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-zinc-400 font-mono text-sm">
        Chargement de l'article...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto px-4 space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900">Article introuvable</h1>
        <p className="text-zinc-600 text-sm">
          Cet article n'existe pas ou n'est plus accessible publiquement.
        </p>
        <Button variant="outline" onClick={() => navigate('/blog')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Retour au blog
        </Button>
      </div>
    );
  }

  // Find related articles (same category or sharing tags, excluding current post)
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && (p.category === post.category || p.tags.some(t => post.tags.includes(t))))
    .slice(0, 2);

  return (
    <article className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb */}
        <div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tous les articles</span>
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-500">
            <span className="px-2.5 py-0.5 rounded bg-zinc-100 text-zinc-800 font-medium">
              {post.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.published_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.reading_time_minutes} min de lecture
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 tracking-tight leading-[1.2]">
            {post.title}
          </h1>

          <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl">
            {post.summary}
          </p>

          <div className="flex items-center gap-3 pt-2 text-xs font-mono text-zinc-500 border-t border-zinc-100">
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <span>Rédigé par <strong className="text-zinc-800 font-semibold">{post.author}</strong></span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100 shadow-sm aspect-16/9">
          <img
            src={post.main_image}
            alt={post.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Article Body Content */}
        <div className="prose prose-zinc max-w-none text-zinc-800 leading-relaxed space-y-6 text-base border-b border-zinc-200 pb-12">
          {post.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-2xl font-bold text-zinc-950 pt-4 pb-1 border-b border-zinc-100">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-xl font-bold text-zinc-900 pt-3">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('```')) {
              const codeClean = paragraph.replace(/```[a-z]*\n?/g, '');
              return (
                <div key={index} className="p-4 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto my-4 border border-zinc-800">
                  <pre>{codeClean}</pre>
                </div>
              );
            }
            return (
              <p key={index} className="whitespace-pre-line text-zinc-700 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-zinc-400 mr-2">Mots clés :</span>
          {post.tags.map((tag) => (
            <Badge key={tag} variant="neutral" size="sm">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Related articles */}
        {relatedPosts.length > 0 && (
          <div className="pt-12 border-t border-zinc-200 space-y-6">
            <h3 className="text-xl font-bold text-zinc-950">
              Articles similaires recommandés
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <div
                  key={related.id}
                  className="p-5 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all space-y-3"
                >
                  <span className="text-xs font-mono text-zinc-400">{related.category}</span>
                  <h4 className="font-bold text-zinc-900 text-base line-clamp-2">
                    <Link to={`/blog/${related.slug}`} className="hover:underline">
                      {related.title}
                    </Link>
                  </h4>
                  <p className="text-xs text-zinc-600 line-clamp-2">{related.summary}</p>
                  <Link
                    to={`/blog/${related.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-zinc-900 hover:underline pt-1"
                  >
                    <span>Consulter l'article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
};
