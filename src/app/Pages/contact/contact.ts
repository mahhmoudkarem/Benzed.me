import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DOCUMENT,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { TranslatePipe } from '../../Core/Pipes/translate/translate-pipe';
import { Language } from '../../Core/Services/language/language';


/**
 * Minimum length that ignores leading / trailing spaces,
 * so "          " (only spaces) is not accepted as a name or message.
 */
function minTrimmedLength(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '').toString().trim();
    return value.length >= min ? null : { minTrimmedLength: true };
  };
}


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements AfterViewInit, OnDestroy {

  private readonly platformId = inject(PLATFORM_ID);

  private readonly formBuilder = inject(FormBuilder);

  private readonly changeDetector = inject(ChangeDetectorRef);

  private readonly document = inject(DOCUMENT);

  readonly languageService = inject(Language);

  @ViewChildren('reveal')
  revealElements!: QueryList<ElementRef<HTMLElement>>;

  private observer?: IntersectionObserver;

  private successTimer?: ReturnType<typeof setTimeout>;

  mouseX = 0;
  mouseY = 0;

  scrollProgress = 0;

  isSubmitted = false;


  /* =====================================================
     CONTACT FORM
  ===================================================== */

  readonly contactForm = this.formBuilder.group({
    name: ['', [Validators.required, minTrimmedLength(2)]],

    email: ['', [Validators.required, Validators.email]],

    phone: [''],

    company: [''],

    service: ['', Validators.required],

    budget: [''],

    message: ['', [Validators.required, minTrimmedLength(10)]],
  });


  /* =====================================================
     MOUSE PARALLAX
  ===================================================== */

  onMouseMove(event: MouseEvent): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // No parallax on mobile, or when the user asked for less motion
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
     FORM SUBMIT
  ===================================================== */

  submitForm(): void {

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    // Send trimmed values
    const raw = this.contactForm.getRawValue();

    const payload = {
      name: (raw.name ?? '').trim(),
      email: (raw.email ?? '').trim(),
      phone: (raw.phone ?? '').trim(),
      company: (raw.company ?? '').trim(),
      service: raw.service,
      budget: raw.budget,
      message: (raw.message ?? '').trim(),
    };

    // There is no backend yet, so the message is handed to the visitor's mail app,
    // already addressed and filled in. Replace this with a real API / form service
    // (EmailJS, Formspree, your own endpoint...) when you have one.
    this.openMailClient(payload);

    this.isSubmitted = true;

    this.contactForm.reset({
      name: '',
      email: '',
      phone: '',
      company: '',
      service: '',
      budget: '',
      message: '',
    });

    // Don't stack timers if the form is submitted twice
    if (this.successTimer) {
      clearTimeout(this.successTimer);
    }

    this.successTimer = setTimeout(() => {
      this.isSubmitted = false;

      // Zoneless app: a timer does not trigger change detection by itself
      this.changeDetector.markForCheck();
    }, 5000);
  }


  /* =====================================================
     MAIL HANDOFF
  ===================================================== */

  private openMailClient(payload: {
    name: string;
    email: string;
    phone: string;
    company: string;
    service: string | null;
    budget: string | null;
    message: string;
  }): void {

    const subject = `Project inquiry — ${payload.name}`;

    const lines = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      payload.phone ? `Phone: ${payload.phone}` : '',
      payload.company ? `Company: ${payload.company}` : '',
      payload.service ? `Service: ${payload.service}` : '',
      payload.budget ? `Budget: ${payload.budget}` : '',
      '',
      payload.message,
    ].filter((line, index) => line !== '' || index > 0);

    const href =
      'mailto:benzed.me@gmail.com' +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(lines.join('\n'))}`;

    if (this.document.defaultView) {
      this.document.defaultView.location.href = href;
    }
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
     HELPERS
  ===================================================== */

  isInvalid(controlName: string): boolean {

    const control = this.contactForm.get(controlName);

    return !!(control && control.invalid && control.touched);
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

    if (this.successTimer) {
      clearTimeout(this.successTimer);
    }

    this.mouseX = 0;
    this.mouseY = 0;
    this.scrollProgress = 0;
  }
}