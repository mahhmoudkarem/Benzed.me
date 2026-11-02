import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../Core/Pipes/translate/translate-pipe';
import { Language } from '../../Core/Services/language/language';


@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements AfterViewInit, OnDestroy {

  private readonly platformId = inject(PLATFORM_ID);

  readonly languageService = inject(Language);

  @ViewChildren('reveal')
  revealElements!: QueryList<ElementRef<HTMLElement>>;

  private observer?: IntersectionObserver;

  mouseX = 0;
  mouseY = 0;

  scrollProgress = 0;


  /* =====================================================
     MOUSE PARALLAX
  ===================================================== */

  onMouseMove(event: MouseEvent): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // No parallax on mobile / tablets-in-portrait, or when the user asked for less motion
    if (window.innerWidth <= 768 || this.prefersReducedMotion()) {
      this.mouseX = 0;
      this.mouseY = 0;
      return;
    }

    // 0 → -1 | 0.5 → 0 | 1 → 1
    this.mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    this.mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
  }

  resetParallax(): void {
    this.mouseX = 0;
    this.mouseY = 0;
  }

  private prefersReducedMotion(): boolean {
    return (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }


  /* =====================================================
     SCROLL
  ===================================================== */

  onWindowScroll(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    // Prevent division by zero
    if (maxScroll <= 0) {
      this.scrollProgress = 0;
      return;
    }

    this.scrollProgress = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
  }


  /* =====================================================
     INIT
  ===================================================== */

  ngAfterViewInit(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.setupRevealObserver();

    // In case the page loads somewhere other than the top
    this.onWindowScroll();
  }


  /* =====================================================
     REVEAL OBSERVER
  ===================================================== */

  private setupRevealObserver(): void {

    // Fallback: show everything if IntersectionObserver isn't available
    if (typeof IntersectionObserver === 'undefined') {
      this.revealElements.forEach((element) => {
        element.nativeElement.classList.add('is-visible');
      });
      return;
    }

    this.observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');

            // Stop observing once the animation has started
            this.observer?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      },
    );

    this.revealElements.forEach((element) => {
      this.observer?.observe(element.nativeElement);
    });
  }


  /* =====================================================
     LANGUAGE
  ===================================================== */

  get isArabic(): boolean {
    return this.languageService.isArabic();
  }

  get isEnglish(): boolean {
    return this.languageService.isEnglish();
  }


  /* =====================================================
     DESTROY
  ===================================================== */

  ngOnDestroy(): void {

    this.observer?.disconnect();

    this.mouseX = 0;
    this.mouseY = 0;
    this.scrollProgress = 0;
  }
}