import {
  Injectable,
  Inject,
  PLATFORM_ID,
  signal,
  computed,
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class Theme {

  private readonly currentThemeSignal =
    signal<ThemeMode>('dark');


  // ============================
  // PUBLIC THEME
  // ============================

  readonly currentTheme =
    computed(() => this.currentThemeSignal());


  constructor(
    @Inject(PLATFORM_ID)
    private readonly platformId: object
  ) {

    if (isPlatformBrowser(this.platformId)) {
      this.loadTheme();
    }

  }


  // ============================
  // GET THEME
  // ============================

  getTheme(): ThemeMode {
    return this.currentThemeSignal();
  }


  // ============================
  // TOGGLE
  // ============================

  toggleTheme(): void {

    const nextTheme =
      this.currentThemeSignal() === 'dark'
        ? 'light'
        : 'dark';

    this.setTheme(nextTheme);
  }


  // ============================
  // SET THEME
  // ============================

  setTheme(theme: ThemeMode): void {

    this.currentThemeSignal.set(theme);

    this.applyTheme();

    this.saveTheme();
  }


  // ============================
  // LOAD
  // ============================

  private loadTheme(): void {

    const savedTheme =
      localStorage.getItem(
        'benzed-theme'
      );


    if (
      savedTheme === 'dark' ||
      savedTheme === 'light'
    ) {

      this.currentThemeSignal.set(
        savedTheme
      );

    }


    this.applyTheme();
  }


  // ============================
  // APPLY
  // ============================

  private applyTheme(): void {

    if (
      !isPlatformBrowser(this.platformId)
    ) {
      return;
    }


    document.documentElement.setAttribute(
      'data-theme',
      this.currentThemeSignal()
    );

  }


  // ============================
  // SAVE
  // ============================

  private saveTheme(): void {

    if (
      !isPlatformBrowser(this.platformId)
    ) {
      return;
    }


    localStorage.setItem(
      'benzed-theme',
      this.currentThemeSignal()
    );

  }

}