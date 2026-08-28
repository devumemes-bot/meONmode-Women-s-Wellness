import { BlogPost } from './types';
import { wantmoreArticles } from './data/blogArticlesWantmore';
import { alphamaxArticles } from './data/blogArticlesAlphamax';
import { womenArticles } from './data/blogArticlesWomen';
import { digestiveArticles } from './data/blogArticlesDigestive';

export const BLOG_POSTS: BlogPost[] = [
  ...womenArticles,
  ...wantmoreArticles,
  ...alphamaxArticles,
  ...digestiveArticles,
];

// Helper to find article by slug (supports legacy slugs as well)
export const findBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return BLOG_POSTS.find(p => p.slug === slug || (p.legacySlugs && p.legacySlugs.includes(slug)));
};
