import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const services = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/data/services' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    headline: z.string().optional(),
    image: z.string().optional(),
    features: z.array(z.string()).default([]),
    applications: z.array(z.string()).default([]),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/data/products' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    headline: z.string().optional(),
    image: z.string().optional(),
    features: z.array(z.string()).default([]),
    applications: z.array(z.string()).default([]),
    category: z.string().optional(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

const industries = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/data/industries' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    headline: z.string().optional(),
    image: z.string().optional(),
    services: z.array(z.string()).default([]),
    products: z.array(z.string()).default([]),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

const materials = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/data/materials' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    headline: z.string().optional(),
    image: z.string().optional(),
    category: z.enum([
      'perspex',
      'acrylic',
      'engineering',
      'specialty',
      'overview',
    ]),
    properties: z.array(z.string()).default([]),
    applications: z.array(z.string()).default([]),
    formats: z.array(z.string()).default([]),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/data/gallery' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    images: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/data/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

const faqs = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/data/faqs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    questions: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { services, products, industries, materials, gallery, blog, faqs };
