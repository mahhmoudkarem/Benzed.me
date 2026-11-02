import {
  DOCUMENT,
  Injectable,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

export type LanguageCode = 'en' | 'ar';

const STORAGE_KEY = 'benzed-language';

const PAGE_TITLE: Record<LanguageCode, string> = {
  en: 'Benzed — Creative Digital Agency',
  ar: 'Benzed — وكالة إبداعية رقمية',
};

const PAGE_DESCRIPTION: Record<LanguageCode, string> = {
  en: 'Benzed is a creative digital agency specializing in social media, media buying, content creation, branding, digital marketing, web and software.',
  ar: 'Benzed وكالة إبداعية رقمية متخصصة في السوشيال ميديا والميديا باينج وصناعة المحتوى والهوية البصرية والتسويق الرقمي والمواقع والبرمجيات.',
};

@Injectable({
  providedIn: 'root',
})
export class Language {

  private readonly document = inject(DOCUMENT);

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly currentLanguageSignal = signal<LanguageCode>('en');


  // ============================
  // PUBLIC LANGUAGE
  // ============================

  readonly currentLanguage = computed(() => this.currentLanguageSignal());


  constructor() {

    if (this.isBrowser) {

      this.loadLanguage();

      // Keep several open tabs in sync
      window.addEventListener('storage', (event: StorageEvent) => {

        if (
          event.key === STORAGE_KEY &&
          (event.newValue === 'en' || event.newValue === 'ar') &&
          event.newValue !== this.currentLanguageSignal()
        ) {
          this.currentLanguageSignal.set(event.newValue);
          this.applyLanguage();
        }

      });

    }

  }


  // ============================
  // GET LANGUAGE
  // ============================

  getLanguage(): LanguageCode {
    return this.currentLanguageSignal();
  }


  // ============================
  // TOGGLE
  // ============================

  toggleLanguage(): void {
    this.setLanguage(this.currentLanguageSignal() === 'en' ? 'ar' : 'en');
  }


  // ============================
  // SET LANGUAGE
  // ============================

  setLanguage(language: LanguageCode): void {

    this.currentLanguageSignal.set(language);

    this.applyLanguage();

    this.saveLanguage();
  }


  // ============================
  // LOAD
  // ============================

  private loadLanguage(): void {

    let saved: string | null = null;

    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* storage blocked (private mode / privacy settings) */
    }

    if (saved === 'en' || saved === 'ar') {
      this.currentLanguageSignal.set(saved);
    }

    this.applyLanguage();
  }


  // ============================
  // APPLY
  // ============================

  private applyLanguage(): void {

    if (!this.isBrowser) {
      return;
    }

    const language = this.currentLanguageSignal();

    const html = this.document.documentElement;

    html.setAttribute('lang', language);

    html.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');

    // Browser tab title + search description follow the language too
    this.document.title = PAGE_TITLE[language];

    this.document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', PAGE_DESCRIPTION[language]);
  }


  // ============================
  // SAVE
  // ============================

  private saveLanguage(): void {

    if (!this.isBrowser) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, this.currentLanguageSignal());
    } catch {
      /* storage blocked: the choice still applies for this visit */
    }
  }


  // ============================
  // HELPERS
  // ============================

  isArabic(): boolean {
    return this.currentLanguageSignal() === 'ar';
  }

  isEnglish(): boolean {
    return this.currentLanguageSignal() === 'en';
  }

}
