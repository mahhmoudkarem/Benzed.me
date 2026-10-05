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
  selector: 'app-services',
  standalone: true,
  imports: [
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements AfterViewInit, OnDestroy {

  private readonly platformId =
    inject(PLATFORM_ID);

  readonly languageService =
    inject(Language);

  @ViewChildren('reveal')
  revealElements!: QueryList<ElementRef>;

  private observer?: IntersectionObserver;

  mouseX = 0;
  mouseY = 0;

  scrollProgress = 0;


  // =========================================
  // MOUSE PARALLAX
  // =========================================

  onMouseMove(event: MouseEvent): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (window.innerWidth <= 768) {
      this.mouseX = 0;
      this.mouseY = 0;
      return;
    }

    const x =
      event.clientX /
      window.innerWidth;

    const y =
      event.clientY /
      window.innerHeight;

    this.mouseX =
      (x - 0.5) * 2;

    this.mouseY =
      (y - 0.5) * 2;
  }


  resetParallax(): void {

    this.mouseX = 0;
    this.mouseY = 0;

  }


  // =========================================
  // SCROLL PROGRESS
  // =========================================

  onWindowScroll(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const scrollTop =
      window.scrollY;

    const documentHeight =
      document.documentElement.scrollHeight;

    const windowHeight =
      window.innerHeight;

    const maxScroll =
      documentHeight -
      windowHeight;

    if (maxScroll <= 0) {

      this.scrollProgress = 0;

      return;
    }

    this.scrollProgress =
      Math.min(
        100,
        Math.max(
          0,
          (scrollTop / maxScroll) * 100
        )
      );
  }


  // =========================================
  // INIT
  // =========================================

  ngAfterViewInit(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.setupRevealObserver();

    this.onWindowScroll();
  }


  // =========================================
  // REVEAL ANIMATION
  // =========================================

  private setupRevealObserver(): void {

    if (
      typeof IntersectionObserver ===
      'undefined'
    ) {

      this.revealElements.forEach(
        (element) => {

          element.nativeElement.classList.add(
            'is-visible'
          );

        }
      );

      return;
    }


    this.observer =
      new IntersectionObserver(
        (
          entries:
            IntersectionObserverEntry[]
        ) => {

          entries.forEach(
            (
              entry:
                IntersectionObserverEntry
            ) => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  'is-visible'
                );

                this.observer?.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold: 0.12,

          rootMargin:
            '0px 0px -40px 0px',
        }
      );


    this.revealElements.forEach(
      (element: ElementRef) => {

        this.observer?.observe(
          element.nativeElement
        );

      }
    );
  }


  // =========================================
  // LANGUAGE
  // =========================================

  get isArabic(): boolean {

    return this.languageService.isArabic();

  }


  get isEnglish(): boolean {

    return this.languageService.isEnglish();

  }


  // =========================================
  // DESTROY
  // =========================================

  ngOnDestroy(): void {

    this.observer?.disconnect();

    this.mouseX = 0;

    this.mouseY = 0;

    this.scrollProgress = 0;

  }

}