import { Component, DOCUMENT, HostListener, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Language } from '../../Core/Services/language/language';

type WorkProject = {
  id: number;
  category: string;
  categoryAr: string;
  company: string;
  companyAr: string;
  description: string;
  descriptionAr: string;
  cover: string;
  images: string[];
  accent: string;
};

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './work.html',
  styleUrl: './work.css',
})
export class Work implements OnDestroy {
  private readonly languageService = inject(Language);

  private readonly document = inject(DOCUMENT);

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  searchQuery = '';
  selectedCategory = 'all';
  activeImage: string | null = null;
  activeProject: WorkProject | null = null;

  get isArabic(): boolean {
    return this.languageService.isArabic();
  }

  readonly categories = [
    { id: 'all', en: 'All Projects', ar: 'كل الأعمال', icon: 'fa-layer-group' },
    { id: 'cars', en: 'Car Showrooms', ar: 'معارض سيارات', icon: 'fa-car' },
    { id: 'restaurants', en: 'Restaurants', ar: 'مطاعم', icon: 'fa-utensils' },
    { id: 'cosmetics', en: 'Cosmetics', ar: 'كوزماتكس', icon: 'fa-spray-can-sparkles' },
    { id: 'beauty', en: 'Beauty Salons', ar: 'بيوتي صالون', icon: 'fa-spa' },
    { id: 'driving', en: 'Driving Schools', ar: 'مدارس تعليم القيادة', icon: 'fa-car-side' },
    { id: 'academies', en: 'Academies', ar: 'أكاديميات', icon: 'fa-graduation-cap' },
    { id: 'travel', en: 'Travel & Tourism', ar: 'سياحة', icon: 'fa-plane' },
    { id: 'fashion', en: 'Fashion', ar: 'ملابس', icon: 'fa-shirt' },
    { id: 'construction', en: 'Construction', ar: 'مقاولات وتشطيبات', icon: 'fa-building' },
    { id: 'rental', en: 'Car Rental', ar: 'إيجار سيارات', icon: 'fa-key' },
  ];

  private readonly photo = (id: string, width = 1000): string =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

  private readonly gallery = (cover: string, seeds: string[]): string[] => [
    this.photo(cover, 1400),
    ...seeds.map(seed => `https://picsum.photos/seed/benzx-${seed}/700/520`),
  ];

  readonly projects: WorkProject[] = [
    {
      id: 1,
      category: 'cars',
      categoryAr: 'معارض سيارات',
      company: 'Apex Motors',
      companyAr: 'أبيكس موتورز',
      description: 'Premium automotive branding and digital campaigns.',
      descriptionAr: 'هوية بصرية وحملات رقمية بمعايير احترافية لعالم السيارات.',
      cover: this.photo('photo-1492144534655-ae79c964c9d7', 1400),
      images: this.gallery('photo-1492144534655-ae79c964c9d7', [
        'apex-2', 'apex-3', 'apex-4', 'apex-5', 'apex-6', 'apex-7',
      ]),
      accent: '#ff343f',
    },
    {
      id: 2,
      category: 'restaurants',
      categoryAr: 'مطاعم',
      company: 'Bite House',
      companyAr: 'بايت هاوس',
      description: 'A bold food identity designed to make people crave more.',
      descriptionAr: 'هوية لمطعم تجمع بين الشهية والتصميم الجذاب.',
      cover: this.photo('photo-1517248135467-4c7edcad34c4', 1400),
      images: this.gallery('photo-1517248135467-4c7edcad34c4', [
        'bite-2', 'bite-3', 'bite-4', 'bite-5', 'bite-6', 'bite-7',
      ]),
      accent: '#ff8b36',
    },
    {
      id: 3,
      category: 'cosmetics',
      categoryAr: 'كوزماتكس',
      company: 'Veloura Beauty',
      companyAr: 'فيلورا بيوتي',
      description: 'Elegant beauty visuals and product-focused storytelling.',
      descriptionAr: 'تصميمات أنيقة تبرز جمال المنتجات وتفاصيلها.',
      cover: this.photo('photo-1608248543803-ba4f8c70ae0b', 1400),
      images: this.gallery('photo-1608248543803-ba4f8c70ae0b', [
        'veloura-2', 'veloura-3', 'veloura-4', 'veloura-5', 'veloura-6', 'veloura-7',
      ]),
      accent: '#ff55ad',
    },
    {
      id: 4,
      category: 'beauty',
      categoryAr: 'بيوتي صالون',
      company: 'Blush Studio',
      companyAr: 'بلش ستوديو',
      description: 'A refined salon identity with a modern, feminine feel.',
      descriptionAr: 'هوية عصرية لصالون تجميل بتفاصيل أنيقة.',
      cover: this.photo('photo-1560066984-138dadb4c035', 1400),
      images: this.gallery('photo-1560066984-138dadb4c035', [
        'blush-2', 'blush-3', 'blush-4', 'blush-5', 'blush-6', 'blush-7',
      ]),
      accent: '#d779bd',
    },
    {
      id: 5,
      category: 'driving',
      categoryAr: 'مدارس تعليم القيادة',
      company: 'Drive Smart',
      companyAr: 'درايف سمارت',
      description: 'Clear, confident branding for a driving education service.',
      descriptionAr: 'هوية واضحة وعصرية لخدمات تعليم القيادة.',
      cover: this.photo('photo-1449965408869-eaa3f722e40d', 1400),
      images: this.gallery('photo-1449965408869-eaa3f722e40d', [
        'drive-2', 'drive-3', 'drive-4', 'drive-5', 'drive-6', 'drive-7',
      ]),
      accent: '#50a8ff',
    },
    {
      id: 6,
      category: 'academies',
      categoryAr: 'أكاديميات',
      company: 'NextGen Academy',
      companyAr: 'نكست جين أكاديمي',
      description: 'A fresh identity built around learning and growth.',
      descriptionAr: 'هوية تعليمية عصرية تعكس التعلم والتطور.',
      cover: this.photo('photo-1523050854058-8df90110c9f1', 1400),
      images: this.gallery('photo-1523050854058-8df90110c9f1', [
        'nextgen-2', 'nextgen-3', 'nextgen-4', 'nextgen-5', 'nextgen-6', 'nextgen-7',
      ]),
      accent: '#a58bff',
    },
    {
      id: 7,
      category: 'travel',
      categoryAr: 'سياحة',
      company: 'Wander Egypt',
      companyAr: 'واندر إيجيبت',
      description: 'Travel campaigns that turn destinations into experiences.',
      descriptionAr: 'حملات سياحية تحول الوجهات إلى تجارب لا تنسى.',
      cover: this.photo('photo-1464822759023-fed622ff2c3b', 1400),
      images: this.gallery('photo-1464822759023-fed622ff2c3b', [
        'wander-2', 'wander-3', 'wander-4', 'wander-5', 'wander-6', 'wander-7',
      ]),
      accent: '#36d6b0',
    },
    {
      id: 8,
      category: 'fashion',
      categoryAr: 'ملابس',
      company: 'Thread District',
      companyAr: 'ثريد ديستريكت',
      description: 'Fashion-forward visuals for a distinctive local brand.',
      descriptionAr: 'محتوى بصري مميز لعلامة ملابس بطابع عصري.',
      cover: this.photo('photo-1483985988355-763728e1935b', 1400),
      images: this.gallery('photo-1483985988355-763728e1935b', [
        'thread-2', 'thread-3', 'thread-4', 'thread-5', 'thread-6', 'thread-7',
      ]),
      accent: '#e9a0ff',
    },
    {
      id: 9,
      category: 'construction',
      categoryAr: 'مقاولات وتشطيبات',
      company: 'Forma Interiors',
      companyAr: 'فورما للتشطيبات',
      description: 'Architectural visuals that showcase detail and craftsmanship.',
      descriptionAr: 'عرض بصري احترافي يبرز تفاصيل التصميم وجودة التشطيبات.',
      cover: this.photo('photo-1600210492486-724fe5c67fb0', 1400),
      images: this.gallery('photo-1600210492486-724fe5c67fb0', [
        'forma-2', 'forma-3', 'forma-4', 'forma-5', 'forma-6', 'forma-7',
      ]),
      accent: '#d8b47b',
    },
    {
      id: 10,
      category: 'rental',
      categoryAr: 'إيجار سيارات',
      company: 'Motion Rent',
      companyAr: 'موشن رينت',
      description: 'A sleek automotive rental identity focused on freedom and ease.',
      descriptionAr: 'هوية أنيقة لخدمات تأجير السيارات تركز على السهولة والحرية.',
      cover: this.photo('photo-1503376780353-7e6692767b70', 1400),
      images: this.gallery('photo-1503376780353-7e6692767b70', [
        'motion-2', 'motion-3', 'motion-4', 'motion-5', 'motion-6', 'motion-7',
      ]),
      accent: '#ff6b45',
    },
  ];

  get pageTitle(): string {
    return this.isArabic ? 'أعمالنا تتكلم.' : 'Our work speaks.';
  }

  get pageSubtitle(): string {
    return this.isArabic
      ? 'أفكار جريئة. هويات مميزة. تجارب تفضل في الذاكرة.'
      : 'Bold ideas. Distinctive identities. Experiences that stay.';
  }

  get resultsLabel(): string {
    return this.isArabic
      ? `${this.filteredProjects.length} مشروع`
      : `${this.filteredProjects.length} projects`;
  }

  get filteredProjects(): WorkProject[] {
    const query = this.searchQuery.trim().toLocaleLowerCase();

    return this.projects.filter(project => {
      const matchesCategory =
        this.selectedCategory === 'all' ||
        project.category === this.selectedCategory;

      const searchableText = [
        project.company,
        project.companyAr,
        project.category,
        project.categoryAr,
        project.description,
        project.descriptionAr,
      ].join(' ').toLocaleLowerCase();

      return matchesCategory &&
        (!query || searchableText.includes(query));
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  openImage(project: WorkProject, image: string): void {
    this.activeProject = project;
    this.activeImage = image;
    this.lockScroll(true);
  }

  closeImage(): void {
    this.activeImage = null;
    this.activeProject = null;
    this.lockScroll(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.activeImage) {
      this.closeImage();
    }
  }

  // Page must not scroll behind the lightbox (browser only: no DOM on the server)
  private lockScroll(lock: boolean): void {
    if (this.isBrowser) {
      this.document.body.style.overflow = lock ? 'hidden' : '';
    }
  }

  ngOnDestroy(): void {
    this.lockScroll(false);
  }

  trackProject(_: number, project: WorkProject): number {
    return project.id;
  }
}
