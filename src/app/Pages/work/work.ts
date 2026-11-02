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
  // images[0] = the “Welcome to Benzed X Brand” poster (or the brand's main visual),
  // images[1..6] = six selected posts from the brand's folder
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
    { id: 'beauty', en: 'Beauty Salons & Clinics', ar: 'بيوتي سنتر وعيادات', icon: 'fa-spa' },
    { id: 'academies', en: 'Academies', ar: 'أكاديميات', icon: 'fa-graduation-cap' },
    { id: 'restaurants', en: 'Restaurants & Cafes', ar: 'مطاعم وكافيهات', icon: 'fa-utensils' },
    { id: 'food', en: 'Food & Supplies', ar: 'أغذية وتوريدات', icon: 'fa-boxes-stacked' },
    { id: 'cars', en: 'Car Showrooms', ar: 'معارض سيارات', icon: 'fa-car' },
    { id: 'carservices', en: 'Car Services', ar: 'خدمات سيارات', icon: 'fa-screwdriver-wrench' },
    { id: 'rental', en: 'Car Rental', ar: 'إيجار سيارات', icon: 'fa-key' },
    { id: 'fashion', en: 'Fashion', ar: 'ملابس', icon: 'fa-shirt' },
    { id: 'construction', en: 'Construction & Interiors', ar: 'مقاولات وتشطيبات', icon: 'fa-building' },
    { id: 'industrial', en: 'Industrial', ar: 'صناعة وتصنيع', icon: 'fa-industry' },
    { id: 'retail', en: 'Retail & Stores', ar: 'محلات وتجزئة', icon: 'fa-store' },
  ];

  /**
   * Image files live in public/images/work/<brand-slug>/1.webp … N.webp
   *  - 1.webp  → the large featured visual (the “Welcome to Benzed X Brand” poster)
   *  - 2…7.webp → the six gallery images
   * A brand with no gallery images only has 1.webp.
   * To change a visual, just replace the file with the same name.
   */
  private brandImages(slug: string, count: number): string[] {
    return Array.from(
      { length: count },
      (_, index) => `images/work/${slug}/${index + 1}.webp`,
    );
  }

  readonly projects: WorkProject[] = [
    {
      id: 1,
      category: 'beauty',
      categoryAr: 'بيوتي سنتر وعيادات',
      company: 'Heels & Laila',
      companyAr: 'Heels & Laila',
      description: 'Glamorous social content for a beauty salon, from offers to nail art.',
      descriptionAr: 'محتوى سوشيال أنيق لصالون تجميل، من العروض لتفاصيل الأظافر.',
      images: this.brandImages('heels-laila', 7),
      accent: '#ff4062',
    },
    {
      id: 2,
      category: 'beauty',
      categoryAr: 'بيوتي سنتر وعيادات',
      company: 'Dahab Gold',
      companyAr: 'Dahab Gold',
      description: 'Warm, feminine visuals for a beauty salon and its care products.',
      descriptionAr: 'تصميمات دافئة وأنثوية لصالون تجميل ومنتجات العناية.',
      images: this.brandImages('dahab-gold', 7),
      accent: '#ff9752',
    },
    {
      id: 3,
      category: 'beauty',
      categoryAr: 'بيوتي سنتر وعيادات',
      company: 'S&A Beauty Center',
      companyAr: 'S&A Beauty Center',
      description: 'Soft, elegant posts for a beauty center: brows, skincare and offers.',
      descriptionAr: 'بوستات ناعمة وأنيقة لسنتر تجميل: الحواجب والعناية بالبشرة والعروض.',
      images: this.brandImages('s-and-a', 7),
      accent: '#ff8552',
    },
    {
      id: 4,
      category: 'beauty',
      categoryAr: 'بيوتي سنتر وعيادات',
      company: 'Twela',
      companyAr: 'Twela',
      description: 'Calm, premium visuals for nails, massage and skincare.',
      descriptionAr: 'تصميمات هادئة وفخمة للأظافر والمساج والعناية بالبشرة.',
      images: this.brandImages('twela', 7),
      accent: '#ff9852',
    },
    {
      id: 5,
      category: 'beauty',
      categoryAr: 'بيوتي سنتر وعيادات',
      company: 'Perfect Spa',
      companyAr: 'Perfect Spa',
      description: 'A relaxing spa identity, welcomed into the Benzed family.',
      descriptionAr: 'هوية سبا مريحة انضمت لعائلة Benzed.',
      images: this.brandImages('perfect-spa', 1),
      accent: '#ff526f',
    },
    {
      id: 6,
      category: 'beauty',
      categoryAr: 'بيوتي سنتر وعيادات',
      company: 'Divan Beauty Clinic',
      companyAr: 'Divan Beauty Clinic',
      description: 'A refined clinic identity with an emerald-and-gold feel.',
      descriptionAr: 'هوية عيادة تجميل راقية بطابع زمردي وذهبي.',
      images: this.brandImages('divan-clinic', 1),
      accent: '#ffb652',
    },
    {
      id: 7,
      category: 'beauty',
      categoryAr: 'بيوتي سنتر وعيادات',
      company: 'Dove Clinic',
      companyAr: 'دوف كلينيك',
      description: 'A premium clinic identity in gold and deep black.',
      descriptionAr: 'هوية عيادة فاخرة بالذهبي والأسود.',
      images: this.brandImages('dove-clinic', 1),
      accent: '#ffb452',
    },
    {
      id: 8,
      category: 'beauty',
      categoryAr: 'بيوتي سنتر وعيادات',
      company: 'Hi Bella Clinic',
      companyAr: 'Hi Bella Clinic',
      description: 'A soft rose-gold identity for a beauty clinic.',
      descriptionAr: 'هوية بدرجات الروز جولد لعيادة تجميل.',
      images: this.brandImages('hi-bella-clinic', 1),
      accent: '#ff6752',
    },
    {
      id: 9,
      category: 'academies',
      categoryAr: 'أكاديميات',
      company: 'Hi Bella Academy',
      companyAr: 'Hi Bella Academy',
      description: 'Educational and promotional content for a beauty academy.',
      descriptionAr: 'محتوى تعليمي وترويجي لأكاديمية بيوتي.',
      images: this.brandImages('hi-bella-academy', 7),
      accent: '#ff9d52',
    },
    {
      id: 10,
      category: 'academies',
      categoryAr: 'أكاديميات',
      company: 'International Academy',
      companyAr: 'الأكاديمية الدولية',
      description: 'Clear, colourful content for an accredited courses academy.',
      descriptionAr: 'محتوى واضح وملوّن لأكاديمية كورسات معتمدة.',
      images: this.brandImages('international-academy', 7),
      accent: '#b233ff',
    },
    {
      id: 11,
      category: 'academies',
      categoryAr: 'أكاديميات',
      company: 'Miss Esraa',
      companyAr: 'Miss Esraa',
      description: 'Playful, parent-friendly content for an English learning brand.',
      descriptionAr: 'محتوى مرح وقريب من الأهالي لعلامة تعليم لغة إنجليزية.',
      images: this.brandImages('miss-esraa', 7),
      accent: '#ff3e45',
    },
    {
      id: 12,
      category: 'restaurants',
      categoryAr: 'مطاعم وكافيهات',
      company: 'Spicy Tala',
      companyAr: 'Spicy Tala',
      description: 'Bold social content that makes every bite look irresistible.',
      descriptionAr: 'محتوى سوشيال جريء يخلّي كل لقمة تبان لا تُقاوَم.',
      images: this.brandImages('spicy-tala', 7),
      accent: '#ff271b',
    },
    {
      id: 13,
      category: 'restaurants',
      categoryAr: 'مطاعم وكافيهات',
      company: 'Marasi',
      companyAr: 'مراسي',
      description: 'Social content for a seafood restaurant with a refined, coastal mood.',
      descriptionAr: 'محتوى سوشيال لمطعم مأكولات بحرية بطابع ساحلي راقٍ.',
      images: this.brandImages('marasi', 7),
      accent: '#ff8d4b',
    },
    {
      id: 14,
      category: 'restaurants',
      categoryAr: 'مطاعم وكافيهات',
      company: 'Abu Hazem Grills',
      companyAr: 'مطعم أبو حازم للمشويات',
      description: 'Fire-grilled food visuals with a warm, appetising look.',
      descriptionAr: 'تصميمات مشويات بإحساس دافئ ومُشهّي.',
      images: this.brandImages('abu-hazem', 7),
      accent: '#ff8844',
    },
    {
      id: 15,
      category: 'restaurants',
      categoryAr: 'مطاعم وكافيهات',
      company: 'Hekaya',
      companyAr: 'حكاية',
      description: 'Family trays and grilled favourites, designed to make people order.',
      descriptionAr: 'صواني عائلية ومشويات متصمّمة عشان الناس تطلب.',
      images: this.brandImages('hekaya', 7),
      accent: '#ff8f3e',
    },
    {
      id: 16,
      category: 'restaurants',
      categoryAr: 'مطاعم وكافيهات',
      company: '2 Coffee',
      companyAr: '2 قهوة',
      description: 'Rich, moody visuals for a coffee brand and its roastery.',
      descriptionAr: 'تصميمات دافئة وغنية لعلامة قهوة ومحمصتها.',
      images: this.brandImages('2-coffee', 7),
      accent: '#ffa152',
    },
    {
      id: 17,
      category: 'restaurants',
      categoryAr: 'مطاعم وكافيهات',
      company: 'Vicino',
      companyAr: 'Vicino',
      description: 'A golden coffee-house identity, welcomed into the Benzed family.',
      descriptionAr: 'هوية كوفي شوب بالذهبي انضمت لعائلة Benzed.',
      images: this.brandImages('vicino', 1),
      accent: '#ffb14f',
    },
    {
      id: 18,
      category: 'food',
      categoryAr: 'أغذية وتوريدات',
      company: 'Zad Supplies',
      companyAr: 'زاد للتوريدات',
      description: 'Product-led content for restaurant and hotel supplies.',
      descriptionAr: 'محتوى يبرز المنتجات لتوريدات المطاعم والفنادق.',
      images: this.brandImages('zad-supplies', 7),
      accent: '#ffb741',
    },
    {
      id: 19,
      category: 'food',
      categoryAr: 'أغذية وتوريدات',
      company: 'Alzainhom Poultry',
      companyAr: 'الزينهم للدواجن',
      description: 'Product-focused content for poultry care and veterinary supplies.',
      descriptionAr: 'محتوى يركز على المنتجات لرعاية الدواجن والمستلزمات البيطرية.',
      images: this.brandImages('alzainhom', 7),
      accent: '#ff9652',
    },
    {
      id: 20,
      category: 'food',
      categoryAr: 'أغذية وتوريدات',
      company: 'Fresh Freeze Group',
      companyAr: 'فريش فريز جروب',
      description: 'A bold, high-energy identity for a meat and frozen-food supplier.',
      descriptionAr: 'هوية جريئة وحيوية لمورّد لحوم وأغذية مجمدة.',
      images: this.brandImages('fresh-freeze', 1),
      accent: '#ffbf3e',
    },
    {
      id: 21,
      category: 'cars',
      categoryAr: 'معارض سيارات',
      company: 'Hero Car',
      companyAr: 'Hero Car',
      description: 'Showroom visuals and campaigns for a Hyundai dealership.',
      descriptionAr: 'تصميمات وحملات لمعرض سيارات هيونداي.',
      images: this.brandImages('hero-car', 7),
      accent: '#ffbc52',
    },
    {
      id: 22,
      category: 'carservices',
      categoryAr: 'خدمات سيارات',
      company: 'Hemed Tire',
      companyAr: 'Hemed Tire',
      description: 'Strong visuals for tire sales and wheel services.',
      descriptionAr: 'تصميمات قوية لبيع الكاوتش وخدمات العجلات.',
      images: this.brandImages('hemed-tire', 7),
      accent: '#ff272d',
    },
    {
      id: 23,
      category: 'carservices',
      categoryAr: 'خدمات سيارات',
      company: 'C.I.C Inspection Center',
      companyAr: 'C.I.C لفحص السيارات',
      description: 'Trust-building content for a car inspection center.',
      descriptionAr: 'محتوى يبني الثقة لمركز فحص وكشف سيارات.',
      images: this.brandImages('cic', 7),
      accent: '#ff8527',
    },
    {
      id: 24,
      category: 'carservices',
      categoryAr: 'خدمات سيارات',
      company: 'The King Battery Terminal',
      companyAr: 'The King Battery Terminal',
      description: 'A premium golden identity for a car battery terminal.',
      descriptionAr: 'هوية ذهبية فاخرة لمحل بطاريات سيارات.',
      images: this.brandImages('the-king', 1),
      accent: '#ffb152',
    },
    {
      id: 25,
      category: 'rental',
      categoryAr: 'إيجار سيارات',
      company: 'Benzed Limousine',
      companyAr: 'Benzed Limousine',
      description: 'Luxury limousine visuals with a refined, cinematic feel.',
      descriptionAr: 'تصميمات ليموزين فاخرة بإحساس سينمائي راقٍ.',
      images: this.brandImages('benzed-limousine', 7),
      accent: '#ff343f',
    },
    {
      id: 26,
      category: 'rental',
      categoryAr: 'إيجار سيارات',
      company: 'Elfeky Limousine',
      companyAr: 'Elfeky Limousine',
      description: 'Airport transfers and long-term rental campaigns for a limousine service.',
      descriptionAr: 'حملات توصيل المطار والإيجار طويل المدة لخدمة ليموزين.',
      images: this.brandImages('elfeky-limousine', 7),
      accent: '#ff9a52',
    },
    {
      id: 27,
      category: 'fashion',
      categoryAr: 'ملابس',
      company: 'Fox Man Fashion',
      companyAr: 'Fox Man Fashion',
      description: 'Clean, product-led content for a men’s fashion brand.',
      descriptionAr: 'محتوى نظيف يبرز المنتج لعلامة ملابس رجالي.',
      images: this.brandImages('fox-man', 7),
      accent: '#ff9752',
    },
    {
      id: 28,
      category: 'construction',
      categoryAr: 'مقاولات وتشطيبات',
      company: 'Mars Stone',
      companyAr: 'Mars Stone',
      description: 'A bold gold-and-stone identity for marble and granite.',
      descriptionAr: 'هوية جريئة بالذهبي والحجر للرخام والجرانيت.',
      images: this.brandImages('mars-stone', 1),
      accent: '#ffb94d',
    },
    {
      id: 29,
      category: 'construction',
      categoryAr: 'مقاولات وتشطيبات',
      company: 'Elite Quarry',
      companyAr: 'محجر النخبة',
      description: 'A premium identity for a natural stone quarry.',
      descriptionAr: 'هوية فاخرة لمحجر أحجار طبيعية.',
      images: this.brandImages('elite-quarry', 1),
      accent: '#ffaf52',
    },
    {
      id: 30,
      category: 'construction',
      categoryAr: 'مقاولات وتشطيبات',
      company: 'Pillar',
      companyAr: 'Pillar',
      description: 'A strong, minimal identity for a construction company.',
      descriptionAr: 'هوية قوية ومينيمال لشركة مقاولات.',
      images: this.brandImages('pillar', 1),
      accent: '#ff343f',
    },
    {
      id: 31,
      category: 'construction',
      categoryAr: 'مقاولات وتشطيبات',
      company: 'Luxury Kitchen',
      companyAr: 'Luxury Kitchen',
      description: 'A refined identity for custom luxury kitchens.',
      descriptionAr: 'هوية راقية لمطابخ فاخرة.',
      images: this.brandImages('luxury-kitchen', 1),
      accent: '#ffac52',
    },
    {
      id: 32,
      category: 'construction',
      categoryAr: 'مقاولات وتشطيبات',
      company: 'Mohamed Rizk Decor',
      companyAr: 'محمد رزق للديكورات',
      description: 'A clean, modern identity for a decoration company.',
      descriptionAr: 'هوية عصرية ونظيفة لشركة ديكورات.',
      images: this.brandImages('mohamed-rizk', 1),
      accent: '#4bc1ff',
    },
    {
      id: 33,
      category: 'construction',
      categoryAr: 'مقاولات وتشطيبات',
      company: 'Elhamed Professional',
      companyAr: 'Elhamed Professional',
      description: 'A warm, crafted identity for wooden furniture.',
      descriptionAr: 'هوية دافئة بطابع حِرفي لأثاث خشبي.',
      images: this.brandImages('elhamed-professional', 1),
      accent: '#ff9552',
    },
    {
      id: 34,
      category: 'industrial',
      categoryAr: 'صناعة وتصنيع',
      company: 'El Wahsh Footwear',
      companyAr: 'الوحش لصناعة الأحذية',
      description: 'Factory-to-trader content for a footwear manufacturer.',
      descriptionAr: 'محتوى من المصنع للتاجر لمصنع أحذية.',
      images: this.brandImages('elwahsh', 7),
      accent: '#ff964e',
    },
    {
      id: 35,
      category: 'industrial',
      categoryAr: 'صناعة وتصنيع',
      company: 'El Sherbiny Metalworks',
      companyAr: 'الشربيني خراطة معادن',
      description: 'A rugged metallic identity for a metal-turning workshop.',
      descriptionAr: 'هوية معدنية قوية لورشة خراطة معادن.',
      images: this.brandImages('el-sherbiny', 1),
      accent: '#52c1ff',
    },
    {
      id: 36,
      category: 'retail',
      categoryAr: 'محلات وتجزئة',
      company: 'Happy Corner',
      companyAr: 'Happy Corner',
      description: 'A playful, colourful identity for a gifts and lifestyle store.',
      descriptionAr: 'هوية مرحة وملوّنة لمحل هدايا ولايف ستايل.',
      images: this.brandImages('happy-corner', 1),
      accent: '#ff4786',
    },
    {
      id: 37,
      category: 'retail',
      categoryAr: 'محلات وتجزئة',
      company: 'Elpop Optic',
      companyAr: 'Elpop Optic',
      description: 'A premium identity for an upcoming optical store.',
      descriptionAr: 'هوية فاخرة لمحل نظارات قيد الافتتاح.',
      images: this.brandImages('elpop-optic', 1),
      accent: '#ffb952',
    },
  ];

  /** Number of industries that really have at least one project */
  get industriesCount(): number {
    return new Set(this.projects.map(project => project.category)).size;
  }

  /** Rounded down to the nearest ten so it can be shown as "160+" */
  get visualsApprox(): number {
    return Math.floor(this.visualsCount / 10) * 10;
  }

  get brandsCount(): number {
    return this.projects.length;
  }

  get visualsCount(): number {
    return this.projects.reduce((total, project) => total + project.images.length, 0);
  }

  /** "Benzed X Brand name" — the title shown on every project */
  projectTitle(project: WorkProject): string {
    return `Benzed X ${this.isArabic ? project.companyAr : project.company}`;
  }

  visualsLabel(project: WorkProject): string {
    const count = project.images.length;

    if (this.isArabic) {
      return count === 1 ? 'صورة واحدة في المشروع' : `${count} صور في المشروع`;
    }

    return count === 1 ? '1 visual in this project' : `${count} visuals in this project`;
  }

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
