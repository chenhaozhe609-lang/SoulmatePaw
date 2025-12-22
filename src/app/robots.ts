import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://soulmatepaw.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'], // Protect API and admin routes
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
