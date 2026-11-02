import {
  DOCUMENT,
  Injectable,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'benzed-theme';

const THEME_COLOR: Record<ThemeMode, string> = {
  dark: '#0D0D0B',
  light: '#F5F5F3',
};

@Injectable({
  providedIn: 'root',
})
export class Theme {

  private readonly document = inject(DOCUMENT);

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly currentThemeSignal = signal<ThemeMode>('dark');


  // ============================
  // PUBLIC THEME
  // ============================

  readonly currentTheme = computed(() => this.currentThemeSignal());

  readonly isDark = computed(() => this.currentThemeSignal() === 'dark');

  readonly isLight = computed(() => this.currentThemeSignal() === 'light');


  constructor() {

    if (this.isBrowser) {

      this.loadTheme();

      // Keep several open tabs in sync
      window.addEventListener('storage', (event: StorageEvent) => {

        if (
          event.key === STORAGE_KEY &&
          (event.newValue === 'dark' || event.newValue === 'light') &&
          event.newValue !== this.currentThemeSignal()
        ) {
          this.currentThemeSignal.set(event.newValue);
          this.applyTheme(false);
        }

      });

    }

  }


  // ============================
  // GET / TOGGLE / SET
  // ============================

  getTheme(): ThemeMode {
    return this.currentThemeSignal();
  }

  toggleTheme(): void {
    this.setTheme(this.currentThemeSignal() === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: ThemeMode): void {

    this.currentThemeSignal.set(theme);

    this.applyTheme(true);

    this.saveTheme();
  }


  // ============================
  // LOAD
  // ============================

  private loadTheme(): void {

    let saved: string | null = null;

    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* storage blocked (private mode / privacy settings) */
    }

    if (saved === 'dark' || saved === 'light') {
      this.currentThemeSignal.set(saved);
    }

    this.applyTheme(false);
  }


  // ============================
  // APPLY
  // ============================

  private applyTheme(animate: boolean): void {

    if (!this.isBrowser) {
      return;
    }

    const theme = this.currentThemeSignal();

    const root = this.document.documentElement;

    if (animate) {
      root.classList.add('theme-animating');
      window.setTimeout(() => root.classList.remove('theme-animating'), 500);
    }

    root.setAttribute('data-theme', theme);

    root.style.colorScheme = theme;

    this.document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLOR[theme]);
  }


  // ============================
  // SAVE
  // ============================

  private saveTheme(): void {

    if (!this.isBrowser) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, this.currentThemeSignal());
    } catch {
      /* storage blocked: the choice still applies for this visit */
    }
  }

}
