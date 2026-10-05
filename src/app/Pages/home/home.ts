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
  selector: 'app-home',

  standalone: true,

  imports: [
    RouterLink,
    TranslatePipe,
  ],

  templateUrl: './home.html',

  styleUrl: './home.css',
})
export class Home
  implements AfterViewInit, OnDestroy {


  // =========================================
  // PLATFORM
  // =========================================

  private readonly platformId =
    inject(PLATFORM_ID);


  // =========================================
  // LANGUAGE
  // =========================================

  readonly languageService =
    inject(Language);


  // =========================================
  // REVEAL ELEMENTS
  // =========================================

  @ViewChildren('reveal')
  private _revealElements!: QueryList<ElementRef>;
  public get revealElements(): QueryList<ElementRef> {
    return this._revealElements;
  }
  public set revealElements(value: QueryList<ElementRef>) {
    this._revealElements = value;
  }


  private observer?: IntersectionObserver;


  // =========================================
  // HERO 3D PARALLAX
  // =========================================

  mouseX = 0;

  mouseY = 0;


  // =========================================
  // SCROLL PROGRESS
  // =========================================

  scrollProgress = 0;


  // =========================================
  // MOUSE MOVE
  // =========================================

  onMouseMove(event: MouseEvent): void {

    // Don't run browser-only logic during SSR

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {

      return;

    }


    // Disable mouse parallax on mobile

    if (
      window.innerWidth <= 768
    ) {

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


    /*
     * Convert:
     *
     * 0 → -1
     * 0.5 → 0
     * 1 → 1
     */

    this.mouseX =
      (x - 0.5) * 2;


    this.mouseY =
      (y - 0.5) * 2;

  }


  // =========================================
  // RESET PARALLAX
  // =========================================

  resetParallax(): void {

    this.mouseX = 0;

    this.mouseY = 0;

  }


  // =========================================
  // WINDOW SCROLL
  // =========================================

  onWindowScroll(): void {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {

      return;

    }


    const scrollTop =
      window.scrollY;


    const documentHeight =
      document.documentElement
        .scrollHeight;


    const windowHeight =
      window.innerHeight;


    const maxScroll =
      documentHeight -
      windowHeight;


    /*
     * Prevent division by zero
     */

    if (
      maxScroll <= 0
    ) {

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
  // AFTER VIEW INIT
  // =========================================

  ngAfterViewInit(): void {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {

      return;

    }


    this.setupRevealObserver();


    /*
     * Calculate initial scroll position
     * in case the page loads somewhere
     * other than the top.
     */

    this.onWindowScroll();

  }


  // =========================================
  // INTERSECTION OBSERVER
  // =========================================

  private setupRevealObserver(): void {

    /*
     * Browser support check
     */

    if (
      typeof IntersectionObserver ===
      'undefined'
    ) {

      /*
       * Fallback:
       * Show everything if IntersectionObserver
       * isn't available.
       */

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
          entries: IntersectionObserverEntry[]
        ) => {

          entries.forEach(
            (
              entry: IntersectionObserverEntry
            ) => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  'is-visible'
                );


                /*
                 * Stop observing after
                 * the animation has started.
                 *
                 * This improves performance.
                 */

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
  // LANGUAGE HELPERS
  // =========================================

  get isArabic(): boolean {

    return this.languageService
      .isArabic();

  }


  get isEnglish(): boolean {

    return this.languageService
      .isEnglish();

  }


  // =========================================
  // DESTROY
  // =========================================

  ngOnDestroy(): void {

    /*
     * Disconnect IntersectionObserver
     */

    this.observer?.disconnect();


    /*
     * Reset values
     */

    this.mouseX = 0;

    this.mouseY = 0;

    this.scrollProgress = 0;

  }

}