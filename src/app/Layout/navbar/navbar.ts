import {
  Component,
  DOCUMENT,
  HostListener,
  PLATFORM_ID,
  inject,
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import {
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

import { Language } from '../../Core/Services/language/language';
import { Theme } from '../../Core/Services/theme/theme';


@Component({
  selector: 'app-navbar',
  standalone: true,

  imports: [
    RouterLink,
    RouterLinkActive,
  ],

  templateUrl: './navbar.html',

  styleUrl: './navbar.css',
})
export class Navbar {

  /* =====================================================
     SERVICES
  ===================================================== */

  readonly languageService =
    inject(Language);

  readonly themeService =
    inject(Theme);

  private readonly document =
    inject(DOCUMENT);

  private readonly isBrowser =
    isPlatformBrowser(inject(PLATFORM_ID));

  readonly currentYear =
    new Date().getFullYear();


  /* =====================================================
     STATE
  ===================================================== */

  isMenuOpen = false;

  isScrolled = false;


  /* =====================================================
     LANGUAGE
  ===================================================== */

  get currentLanguage() {
    return this.languageService.currentLanguage();
  }


  toggleLanguage(): void {

    this.languageService.toggleLanguage();

  }


  /* =====================================================
     THEME
  ===================================================== */

  get isDark(): boolean {
    return this.themeService.isDark();
  }


  toggleTheme(): void {

    this.themeService.toggleTheme();

  }


  /* =====================================================
     MOBILE MENU
  ===================================================== */

  toggleMenu(): void {

    this.setMenu(!this.isMenuOpen);

  }


  closeMenu(): void {

    this.setMenu(false);

  }


  private setMenu(open: boolean): void {

    this.isMenuOpen = open;

    // Don't let the page scroll behind the full-screen menu
    if (this.isBrowser) {

      this.document.body.style.overflow =
        open ? 'hidden' : '';

    }

  }


  @HostListener('document:keydown.escape')
  onEscape(): void {

    if (this.isMenuOpen) {
      this.closeMenu();
    }

  }


  /* =====================================================
     SCROLL
  ===================================================== */

  @HostListener(
    'window:scroll'
  )
  onWindowScroll(): void {

    this.isScrolled =
      window.scrollY > 30;

  }


  /* =====================================================
     RESIZE
  ===================================================== */

  @HostListener(
    'window:resize'
  )
  onWindowResize(): void {

    /*
      Close mobile menu automatically
      when returning to desktop.
    */

    if (
      window.innerWidth >= 1024 &&
      this.isMenuOpen
    ) {

      this.closeMenu();

    }

  }

}
