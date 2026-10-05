import {
  Component,
  HostListener,
  inject,
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { Language } from '../../Core/Services/language/language';


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
     MOBILE MENU
  ===================================================== */

  toggleMenu(): void {

    this.isMenuOpen =
      !this.isMenuOpen;

  }


  closeMenu(): void {

    this.isMenuOpen = false;

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
      window.innerWidth >= 1024
    ) {

      this.isMenuOpen = false;

    }

  }

}