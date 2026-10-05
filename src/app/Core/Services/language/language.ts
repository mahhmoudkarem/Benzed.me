import {
  Injectable,
  Inject,
  PLATFORM_ID,
  signal,
  computed,
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

export type LanguageCode = 'en' | 'ar';

@Injectable({
  providedIn: 'root',
})
export class Language {

  private readonly currentLanguageSignal =
    signal<LanguageCode>('en');


  // ============================
  // PUBLIC LANGUAGE
  // ============================

  readonly currentLanguage =
    computed(() => this.currentLanguageSignal());


  constructor(
    @Inject(PLATFORM_ID)
    private readonly platformId: object
  ) {

    if (isPlatformBrowser(this.platformId)) {
      this.loadLanguage();
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

    const nextLanguage =
      this.currentLanguageSignal() === 'en'
        ? 'ar'
        : 'en';

    this.setLanguage(nextLanguage);
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

    const savedLanguage =
      localStorage.getItem(
        'benzed-language'
      );


    if (
      savedLanguage === 'en' ||
      savedLanguage === 'ar'
    ) {

      this.currentLanguageSignal.set(
        savedLanguage
      );

    }


    this.applyLanguage();
  }


  // ============================
  // APPLY
  // ============================

  private applyLanguage(): void {

    if (
      !isPlatformBrowser(this.platformId)
    ) {
      return;
    }


    const html =
      document.documentElement;


    html.setAttribute(
      'lang',
      this.currentLanguageSignal()
    );


    html.setAttribute(
      'dir',
      this.currentLanguageSignal() === 'ar'
        ? 'rtl'
        : 'ltr'
    );

  }


  // ============================
  // SAVE
  // ============================

  private saveLanguage(): void {

    if (
      !isPlatformBrowser(this.platformId)
    ) {
      return;
    }


    localStorage.setItem(
      'benzed-language',
      this.currentLanguageSignal()
    );

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