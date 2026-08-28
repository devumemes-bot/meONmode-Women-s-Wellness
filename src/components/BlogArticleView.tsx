import React from 'react';
import { BlogArticle } from './BlogArticle';
import { BLOG_POSTS } from '../blogData';
import { Product } from '../types';

interface BlogArticleViewProps {
  slug: string | null;
  onGoBackToBlog: () => void;
  onSelectArticle: (slug: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const BlogArticleView: React.FC<BlogArticleViewProps> = ({
  slug,
  onGoBackToBlog,
  onSelectArticle,
  onSelectProduct,
  onAddToCart,
}) => {
  const matchedPost = BLOG_POSTS.find(p => 
    p.slug === slug || (p.legacySlugs && slug && p.legacySlugs.includes(slug))
  ) || BLOG_POSTS[0];
  return (
    <BlogArticle
      post={matchedPost}
      onGoBackToBlog={onGoBackToBlog}
      onSelectArticle={onSelectArticle}
      onSelectProduct={onSelectProduct}
      onAddToCart={onAddToCart}
    />
  );
};
