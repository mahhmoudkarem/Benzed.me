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


interface ServiceTag {
  en: string;
  ar: string;
}

interface ServiceItem {
  number: string;
  color: string;
  delay: string;
  icon: string;
  catEn: string;
  catAr: string;
  titleOneEn: string;
  titleOneAr: string;
  titleTwoEn?: string;
  titleTwoAr?: string;
  descEn: string;
  descAr: string;
  tags: ServiceTag[];
}


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

  private readonly platformId = inject(PLATFORM_ID);

  readonly languageService = inject(Language);

  @ViewChildren('reveal')
  revealElements!: QueryList<ElementRef<HTMLElement>>;

  private observer?: IntersectionObserver;

  mouseX = 0;
  mouseY = 0;

  scrollProgress = 0;


  // =========================================
  // DATA
  // (same content as before, now with Arabic for the category labels,
  //  the tags and the "& ADS" line, which used to stay in English)
  // =========================================

  readonly services: ServiceItem[] = [
    {
      number: '01', color: 'service-red', delay: '', icon: 'fa-hashtag',
      catEn: 'SOCIAL', catAr: 'سوشيال',
      titleOneEn: 'SOCIAL MEDIA', titleOneAr: 'إدارة السوشيال ميديا',
      descEn: 'We manage your social presence from strategy and content calendars to community management and daily execution.',
      descAr: 'ندير حضورك على السوشيال ميديا بداية من الاستراتيجية وخطط المحتوى وحتى إدارة المجتمع والتنفيذ اليومي.',
      tags: [
        { en: 'Strategy',   ar: 'استراتيجية' },
        { en: 'Content',    ar: 'محتوى' },
        { en: 'Community',  ar: 'مجتمع' },
        { en: 'Management', ar: 'إدارة' },
      ],
    },
    {
      number: '02', color: 'service-pink', delay: 'reveal-delay-one', icon: 'fa-chart-line',
      catEn: 'PERFORMANCE', catAr: 'أداء',
      titleOneEn: 'MEDIA BUYING', titleOneAr: 'الميديا باينج',
      titleTwoEn: '& ADS',        titleTwoAr: 'والإعلانات',
      descEn: 'Data-driven campaigns focused on reach, leads, conversions and measurable business growth.',
      descAr: 'حملات إعلانية تعتمد على البيانات وتركز على الوصول والعملاء والتحويلات والنمو القابل للقياس.',
      tags: [
        { en: 'Meta Ads',    ar: 'إعلانات ميتا' },
        { en: 'Google Ads',  ar: 'إعلانات جوجل' },
        { en: 'Retargeting', ar: 'إعادة استهداف' },
        { en: 'Analytics',   ar: 'تحليلات' },
      ],
    },
    {
      number: '03', color: 'service-orange', delay: 'reveal-delay-two', icon: 'fa-video',
      catEn: 'CREATIVE', catAr: 'إبداع',
      titleOneEn: 'CONTENT',  titleOneAr: 'صناعة',
      titleTwoEn: 'CREATION', titleTwoAr: 'المحتوى',
      descEn: 'Reels, photography, scripts, concepts and visual storytelling designed to make people stop and watch.',
      descAr: 'ريلز وتصوير وسكريبتات وأفكار وستوري تيلنج بصري مصمم لجذب الانتباه وتحقيق التفاعل.',
      tags: [
        { en: 'Reels',       ar: 'ريلز' },
        { en: 'Photography', ar: 'تصوير' },
        { en: 'Scripts',     ar: 'سكريبتات' },
        { en: 'Production',  ar: 'إنتاج' },
      ],
    },
    {
      number: '04', color: 'service-purple', delay: 'reveal-delay-three', icon: 'fa-pen-nib',
      catEn: 'VISUAL', catAr: 'بصري',
      titleOneEn: 'GRAPHIC DESIGN', titleOneAr: 'التصميم الجرافيكي',
      descEn: 'Social media designs, campaign visuals, ads, carousels and complete visual systems.',
      descAr: 'تصميمات السوشيال ميديا والحملات والإعلانات والكارويسيل والأنظمة البصرية المتكاملة.',
      tags: [
        { en: 'Social',    ar: 'سوشيال' },
        { en: 'Ads',       ar: 'إعلانات' },
        { en: 'Campaigns', ar: 'حملات' },
        { en: 'Visuals',   ar: 'بصريات' },
      ],
    },
    {
      number: '05', color: 'service-dark', delay: 'reveal-delay-four', icon: 'fa-shapes',
      catEn: 'IDENTITY', catAr: 'هوية',
      titleOneEn: 'BRANDING',          titleOneAr: 'البراندينج',
      titleTwoEn: '& VISUAL IDENTITY', titleTwoAr: 'والهوية البصرية',
      descEn: 'We build memorable brands with a clear personality, visual language and strong positioning.',
      descAr: 'نبني علامات تجارية مميزة بشخصية واضحة ولغة بصرية قوية ومكانة واضحة في السوق.',
      tags: [
        { en: 'Logo',       ar: 'لوجو' },
        { en: 'Identity',   ar: 'هوية' },
        { en: 'Guidelines', ar: 'دليل الهوية' },
        { en: 'Strategy',   ar: 'استراتيجية' },
      ],
    },
    {
      number: '06', color: 'service-mix', delay: '', icon: 'fa-bolt',
      catEn: 'DIGITAL', catAr: 'ديجيتال',
      titleOneEn: 'WEB & SOFTWARE', titleOneAr: 'المواقع والبرمجيات',
      descEn: 'Websites, landing pages, digital platforms and software solutions that turn your ideas into real products.',
      descAr: 'مواقع ولاندنج بيدج ومنصات رقمية وحلول برمجية نحول بها أفكارك إلى منتجات حقيقية.',
      tags: [
        { en: 'Websites',  ar: 'مواقع' },
        { en: 'Web Apps',  ar: 'تطبيقات ويب' },
        { en: 'Platforms', ar: 'منصات' },
        { en: 'Software',  ar: 'برمجيات' },
      ],
    },
    {
      number: '07', color: 'service-red', delay: 'reveal-delay-one', icon: 'fa-bullhorn',
      catEn: 'DIGITAL', catAr: 'ديجيتال',
      titleOneEn: 'DIGITAL MARKETING', titleOneAr: 'التسويق الرقمي',
      descEn: 'Integrated digital strategies that connect content, advertising, social media and business goals.',
      descAr: 'استراتيجيات تسويق رقمية متكاملة تربط المحتوى والإعلانات والسوشيال ميديا بأهداف البيزنس.',
      tags: [
        { en: 'Strategy', ar: 'استراتيجية' },
        { en: 'SEO',      ar: 'سيو' },
        { en: 'Ads',      ar: 'إعلانات' },
        { en: 'Growth',   ar: 'نمو' },
      ],
    },
    {
      number: '08', color: 'service-pink', delay: 'reveal-delay-two', icon: 'fa-wand-magic-sparkles',
      catEn: 'CREATIVE', catAr: 'إبداع',
      titleOneEn: 'CREATIVE CAMPAIGNS', titleOneAr: 'الحملات الإبداعية',
      descEn: 'Big ideas transformed into campaigns that people remember, talk about and share.',
      descAr: 'نحول الأفكار الكبيرة إلى حملات إبداعية يتذكرها الناس ويتحدثون عنها ويشاركونها.',
      tags: [
        { en: 'Concepts',     ar: 'أفكار' },
        { en: 'Campaigns',    ar: 'حملات' },
        { en: 'Storytelling', ar: 'ستوري تيلنج' },
        { en: 'Activation',   ar: 'تفعيل' },
      ],
    },
  ];


  // =========================================
  // MOUSE PARALLAX
  // =========================================

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


  // =========================================
  // SCROLL PROGRESS
  // =========================================

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


  // =========================================
  // INIT
  // =========================================

  ngAfterViewInit(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.setupRevealObserver();

    // In case the page loads somewhere other than the top
    this.onWindowScroll();
  }


  // =========================================
  // REVEAL ANIMATION
  // =========================================

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