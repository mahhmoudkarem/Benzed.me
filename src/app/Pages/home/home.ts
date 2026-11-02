import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
  HostListener,
  signal,
} from '@angular/core';

import { NgClass, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TranslatePipe } from '../../Core/Pipes/translate/translate-pipe';
import { Language } from '../../Core/Services/language/language';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgClass, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit, OnDestroy {

  // =========================================
  // INJECTIONS
  // =========================================

  private readonly platformId = inject(PLATFORM_ID);

  readonly languageService = inject(Language);


  // =========================================
  // VIEW QUERIES
  // =========================================

  @ViewChildren('reveal')
  revealElements!: QueryList<ElementRef<HTMLElement>>;

  @ViewChildren('autoVideo')
  videoElements!: QueryList<ElementRef<HTMLVideoElement>>;

  @ViewChild('numbersSection')
  numbersSection?: ElementRef<HTMLElement>;

  @ViewChild('lightboxPanel')
  lightboxPanel?: ElementRef<HTMLElement>;

  private lastFocusedEl: HTMLElement | null = null;


  // =========================================
  // STATE
  // =========================================

  mouseX = 0;
  mouseY = 0;

  scrollY = 0;
  scrollProgress = 0;

  isMuted = true;

  // Video lightbox state
  isVideoModalOpen = false;
  activeVideoSrc = '';
  activeVideoTitle = '';
  private previousBodyOverflow = '';

  // A signal: the count-up runs inside requestAnimationFrame, which does not
  // trigger change detection by itself in a zoneless app.
  readonly counters = signal<number[]>([0, 0, 0, 0]);

  readonly currentYear = new Date().getFullYear();

  private revealObserver?: IntersectionObserver;
  private videoObserver?: IntersectionObserver;
  private numbersObserver?: IntersectionObserver;

  private countersStarted = false;
  private counterFrame = 0;


  // =========================================
  // DATA
  // =========================================

  readonly marqueeItems = [
    { en: 'STRATEGY',     ar: 'استراتيجية' },
    { en: 'CONTENT',      ar: 'محتوى' },
    { en: 'MEDIA BUYING', ar: 'ميديا باينج' },
    { en: 'DESIGN',       ar: 'تصميم' },
    { en: 'BRANDING',     ar: 'براندينج' },
    { en: 'DIGITAL',      ar: 'ديجيتال' },
  ];

  // Videos 2 → 5 (video 1 is the main showreel in the template)
  readonly smallVideos = [
    { src: 'assets/videos/2.mp4', label: 'VIDEO 02', labelAr: 'فيديو 02', color: 'video-purple', delay: 'reveal-delay-one',   en: 'SOCIAL MEDIA', ar: 'سوشيال ميديا', time: '00:24' },
    { src: 'assets/videos/3.mp4', label: 'VIDEO 03', labelAr: 'فيديو 03', color: 'video-red',    delay: 'reveal-delay-two',   en: 'CAMPAIGN',     ar: 'حملة إعلانية', time: '00:31' },
    { src: 'assets/videos/4.mp4', label: 'VIDEO 04', labelAr: 'فيديو 04', color: 'video-orange', delay: 'reveal-delay-three', en: 'CONTENT',      ar: 'محتوى',        time: '00:18' },
    { src: 'assets/videos/5.mp4', label: 'VIDEO 05', labelAr: 'فيديو 05', color: 'video-dark',   delay: 'reveal-delay-four',  en: 'BRANDING',     ar: 'براندينج',     time: '00:42' },
  ];

  readonly services = [
    {
      number: '01', color: 'service-card-red', icon: 'fa-hashtag',
      miniEn: 'SOCIAL', miniAr: 'سوشيال',
      titleOneEn: 'SOCIAL MEDIA', titleOneAr: 'إدارة السوشيال ميديا',
      titleTwoEn: 'MANAGEMENT',   titleTwoAr: 'والحسابات',
      descEn: 'Strategy, calendars, community, content and consistent brand presence.',
      descAr: 'استراتيجية، خطط محتوى، إدارة المجتمع، محتوى وحضور مستمر للعلامة التجارية.',
    },
    {
      number: '02', color: 'service-card-pink', icon: 'fa-chart-line',
      miniEn: 'PERFORMANCE', miniAr: 'أداء',
      titleOneEn: 'MEDIA BUYING', titleOneAr: 'الميديا باينج',
      titleTwoEn: '& ADS',        titleTwoAr: 'والإعلانات',
      descEn: 'Performance campaigns designed around reach, leads and growth.',
      descAr: 'حملات إعلانية قائمة على الوصول والعملاء المحتملين والنمو.',
    },
    {
      number: '03', color: 'service-card-orange', icon: 'fa-video',
      miniEn: 'CREATIVE', miniAr: 'إبداع',
      titleOneEn: 'CONTENT',  titleOneAr: 'صناعة',
      titleTwoEn: 'CREATION', titleTwoAr: 'المحتوى',
      descEn: 'Reels, photography, concepts, storytelling and creative production.',
      descAr: 'ريلز، تصوير، أفكار، ستوري تيلنج وإنتاج إبداعي متكامل.',
    },
    {
      number: '04', color: 'service-card-purple', icon: 'fa-pen-nib',
      miniEn: 'VISUAL', miniAr: 'بصري',
      titleOneEn: 'GRAPHIC', titleOneAr: 'جرافيك',
      titleTwoEn: 'DESIGN',  titleTwoAr: 'ديزاين',
      descEn: 'Social designs, campaigns, ads, carousels and visual systems.',
      descAr: 'تصميمات سوشيال، حملات، إعلانات، كاروسيل وأنظمة بصرية متكاملة.',
    },
    {
      number: '05', color: 'service-card-dark', icon: 'fa-shapes',
      miniEn: 'IDENTITY', miniAr: 'هوية',
      titleOneEn: 'BRANDING',   titleOneAr: 'بناء العلامة',
      titleTwoEn: '& IDENTITY', titleTwoAr: 'والهوية البصرية',
      descEn: 'Brands with a clear visual language, personality and direction.',
      descAr: 'نبني علامات تجارية بهوية واضحة وشخصية واتجاه بصري مميز.',
    },
    {
      number: '06', color: 'service-card-gradient', icon: 'fa-bolt',
      miniEn: 'DIGITAL', miniAr: 'ديجيتال',
      titleOneEn: 'WEB &',    titleOneAr: 'المواقع و',
      titleTwoEn: 'SOFTWARE', titleTwoAr: 'البرمجيات',
      descEn: 'Websites, landing pages and digital products that complete the experience.',
      descAr: 'مواقع، لاندنج بيدج ومنتجات رقمية تكمل تجربة العلامة التجارية.',
    },
  ];

  // Doubled so the rail loops forever without a gap
  readonly servicesLoop = [...this.services, ...this.services];

  readonly stats = [
    { value: 50,  suffix: '+',  en: 'PROJECTS', ar: 'مشروع', delay: '' },
    { value: 30,  suffix: '+',  en: 'BRANDS',   ar: 'براند', delay: 'reveal-delay-one' },
    { value: 100, suffix: '%',  en: 'CREATIVE', ar: 'إبداع', delay: 'reveal-delay-two' },
    { value: 24,  suffix: '/7', en: 'IDEAS',    ar: 'أفكار', delay: 'reveal-delay-three' },
  ];


  // =========================================
  // MOUSE MOVE
  // =========================================

  onMouseMove(event: MouseEvent): void {

    if (!isPlatformBrowser(this.platformId)) return;

    // Disable mouse parallax on mobile
    if (window.innerWidth <= 768) {
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


  // =========================================
  // WINDOW SCROLL
  // =========================================

  onWindowScroll(): void {

    if (!isPlatformBrowser(this.platformId)) return;

    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    // Parallax for the hero 3D object (stops after the hero)
    this.scrollY = window.innerWidth > 768
      ? Math.min(scrollTop, window.innerHeight)
      : 0;

    // Prevent division by zero
    if (maxScroll <= 0) {
      this.scrollProgress = 0;
      return;
    }

    this.scrollProgress = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
  }


  // =========================================
  // SMOOTH SCROLL (brand section → hero)
  // =========================================

  scrollToHero(event: Event): void {
    event.preventDefault();

    if (!isPlatformBrowser(this.platformId)) return;

    document
      .getElementById('hero-start')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }


  // =========================================
  // AFTER VIEW INIT
  // =========================================

  ngAfterViewInit(): void {

    if (!isPlatformBrowser(this.platformId)) return;

    this.setupRevealObserver();
    this.setupVideoObserver();
    this.setupNumbersObserver();

    // In case the page loads somewhere other than the top
    this.onWindowScroll();
  }


  // =========================================
  // REVEAL OBSERVER
  // =========================================

  private setupRevealObserver(): void {

    // Fallback: show everything if IntersectionObserver isn't available
    if (typeof IntersectionObserver === 'undefined') {
      this.revealElements.forEach((el) => el.nativeElement.classList.add('is-visible'));
      return;
    }

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Stop observing once the animation has started
            this.revealObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    this.revealElements.forEach((el) => this.revealObserver?.observe(el.nativeElement));
  }


  // =========================================
  // VIDEOS (play only while visible)
  // =========================================

  private setupVideoObserver(): void {

    // The `muted` attribute isn't always applied by Angular,
    // and autoplay is blocked without it
    this.videoElements.forEach((v) => {
      v.nativeElement.muted = true;
    });

    if (typeof IntersectionObserver === 'undefined') {
      this.videoElements.forEach((v) => v.nativeElement.play().catch(() => {}));
      return;
    }

    this.videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;

          // Never start background previews while the lightbox is open
          if (entry.isIntersecting && !this.isVideoModalOpen) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.35 },
    );

    this.videoElements.forEach((v) => this.videoObserver?.observe(v.nativeElement));
  }

  toggleSound(video: HTMLVideoElement): void {
    video.muted = !video.muted;
    this.isMuted = video.muted;

    if (!video.muted) {
      video.play().catch(() => {});
    }
  }

  // =========================================
  // VIDEO LIGHTBOX
  // =========================================

  openVideoModal(src: string, title: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.lastFocusedEl = document.activeElement as HTMLElement | null;

    // Only remember the original overflow once (not on re-open)
    if (!this.isVideoModalOpen) {
      this.previousBodyOverflow = document.body.style.overflow;
    }

    this.activeVideoSrc = src;
    this.activeVideoTitle = title;
    this.isVideoModalOpen = true;

    // Stop all background previews while the modal is open.
    this.videoElements.forEach(({ nativeElement }) => nativeElement.pause());

    document.body.style.overflow = 'hidden';

    // Focus the panel (not the close button, so a Space keyup can't close it instantly)
    requestAnimationFrame(() => this.lightboxPanel?.nativeElement.focus());
  }

  closeVideoModal(): void {
    if (!isPlatformBrowser(this.platformId) || !this.isVideoModalOpen) return;

    this.isVideoModalOpen = false;
    this.activeVideoSrc = '';
    document.body.style.overflow = this.previousBodyOverflow;

    // Give focus back to whatever opened the modal
    this.lastFocusedEl?.focus();
    this.lastFocusedEl = null;

    // Resume visible preview videos after closing.
    requestAnimationFrame(() => {
      this.videoElements.forEach(({ nativeElement }) => {
        const rect = nativeElement.getBoundingClientRect();
        const visible = rect.bottom > 0 && rect.top < window.innerHeight;

        if (visible) {
          nativeElement.play().catch(() => {});
        }
      });
    });
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isVideoModalOpen) {
      this.closeVideoModal();
    }
  }

  stopModalClick(event: MouseEvent): void {
    event.stopPropagation();
  }


  // =========================================
  // NUMBERS COUNT-UP
  // =========================================

  private setupNumbersObserver(): void {

    if (!this.numbersSection) return;

    if (typeof IntersectionObserver === 'undefined') {
      this.counters.set(this.stats.map((s) => s.value));
      return;
    }

    this.numbersObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.countersStarted) {
          this.countersStarted = true;
          this.runCounters();
          this.numbersObserver?.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    this.numbersObserver.observe(this.numbersSection.nativeElement);
  }

  private runCounters(): void {

    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart

      this.counters.set(this.stats.map((s) => Math.round(s.value * eased)));

      if (t < 1) {
        this.counterFrame = requestAnimationFrame(tick);
      }
    };

    this.counterFrame = requestAnimationFrame(tick);
  }


  // =========================================
  // LANGUAGE HELPERS
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

    this.revealObserver?.disconnect();
    this.videoObserver?.disconnect();
    this.numbersObserver?.disconnect();

    // Only restore body scroll if the lightbox was actually open
    if (isPlatformBrowser(this.platformId) && this.isVideoModalOpen) {
      document.body.style.overflow = this.previousBodyOverflow;
    }

    if (this.counterFrame && isPlatformBrowser(this.platformId)) {
      cancelAnimationFrame(this.counterFrame);
    }

    this.mouseX = 0;
    this.mouseY = 0;
    this.scrollY = 0;
    this.scrollProgress = 0;
  }

}