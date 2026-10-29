import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Known pages are pre-rendered once at build time
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'work', renderMode: RenderMode.Prerender },
  { path: 'services', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },

  // Any other URL is rendered on demand so the 404 page is shown
  // (before, the server answered with a bare "Cannot GET /xyz")
  { path: '**', renderMode: RenderMode.Server },
];
