"use client";

import { SpaNavbar } from '@/components/public/SpaNavbar';
import { getQuickBriefOptionValue, normalizeMentorshipBriefConfig, normalizeQuickBriefConfig } from '@/lib/quick-brief';
import { useEffect } from 'react';
import WorldMap from '@/components/public/WorldMap';

const getServiceIcon = (icon: string) => {
  switch (icon) {
    case 'editing':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>;
    case 'cinematography':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'social':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
    case 'documentary':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
    case 'mentorship':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="8" r="4"/><path d="M4 20v-2a8 8 0 0 1 16 0v2"/></svg>;
    case 'motion':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
    default:
      return null;
  }
};

const getProcessIcon = (icon: string) => {
  switch (icon) {
    case 'discovery':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>;
    case 'proposal':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
    case 'production':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>;
    case 'delivery':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
    default:
      return null;
  }
};

const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
    case 'tiktok':
      return <svg viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>;
    case 'linkedin':
      return <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
    case 'youtube':
      return <svg viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>;
    default:
      return null;
  }
};

const fallbackPortfolioWorks = [
  { serviceKey: 'editing', cat: 'Brand Film', catAr: 'فيلم براند', name: 'Tech Launch Video', nameAr: 'فيديو إطلاق منتج تقني' },
  { serviceKey: 'editing', cat: 'Music Video', catAr: 'فيديو موسيقي', name: 'Indie Artist Reel', nameAr: 'ريل فنان مستقل' },
  { serviceKey: 'editing', cat: 'Corporate', catAr: 'شركات', name: 'Annual Report Film', nameAr: 'فيلم التقرير السنوي' },
  { serviceKey: 'editing', cat: 'Cinematic', catAr: 'سينمائي', name: 'Travel Diary 2025', nameAr: 'يوميات سفر 2025' },
  { serviceKey: 'cinematography', cat: 'Commercial', catAr: 'إعلان', name: 'Fashion Brand Shoot', nameAr: 'تصوير براند أزياء' },
  { serviceKey: 'cinematography', cat: 'Documentary', catAr: 'وثائقي', name: 'Cairo Streets Story', nameAr: 'حكاية شوارع القاهرة' },
  { serviceKey: 'cinematography', cat: 'Event', catAr: 'فعالية', name: 'Wedding Cinematography', nameAr: 'تصوير زفاف سينمائي' },
  { serviceKey: 'cinematography', cat: 'Lifestyle', catAr: 'لايف ستايل', name: 'Coffee Brand Visual', nameAr: 'فيديو براند قهوة' },
  { serviceKey: 'social', cat: 'Reel', catAr: 'ريل', name: 'Viral Fashion Reel', nameAr: 'ريل أزياء سريع الانتشار' },
  { serviceKey: 'social', cat: 'TikTok', catAr: 'تيك توك', name: 'Food Brand Series', nameAr: 'سلسلة براند أكل' },
  { serviceKey: 'social', cat: 'Short', catAr: 'فيديو قصير', name: 'Tech Product Demo', nameAr: 'عرض منتج تقني' },
  { serviceKey: 'social', cat: 'Story Pack', catAr: 'باقة ستوري', name: 'Influencer Campaign', nameAr: 'حملة مؤثرين' },
  { serviceKey: 'documentary', cat: 'Documentary', catAr: 'وثائقي', name: 'The Maker Story', nameAr: 'حكاية الصانع' },
  { serviceKey: 'documentary', cat: 'Brand Film', catAr: 'فيلم براند', name: 'Heritage Brand Doc', nameAr: 'وثائقي براند تراثي' },
  { serviceKey: 'documentary', cat: 'Profile', catAr: 'بروفايل', name: 'Athlete Portrait', nameAr: 'بورتريه رياضي' },
  { serviceKey: 'documentary', cat: 'Series', catAr: 'سلسلة', name: 'Cultural Voices Series', nameAr: 'سلسلة أصوات ثقافية' },
  { serviceKey: 'mentorship', cat: 'Course', catAr: 'كورس', name: 'Premiere Pro Masterclass', nameAr: 'ماستر كلاس بريمير برو' },
  { serviceKey: 'mentorship', cat: 'Workshop', catAr: 'ورشة', name: 'Color Grading Bootcamp', nameAr: 'ورشة تدريج ألوان' },
  { serviceKey: 'mentorship', cat: '1:1', catAr: 'جلسة 1:1', name: 'Portfolio Coaching', nameAr: 'توجيه بورتفوليو' },
  { serviceKey: 'mentorship', cat: 'Online', catAr: 'أونلاين', name: 'Reels Editing Course', nameAr: 'كورس مونتاج ريلز' },
  { serviceKey: 'motion', cat: 'Logo Reveal', catAr: 'ظهور لوجو', name: 'Brand Identity Animation', nameAr: 'تحريك هوية براند' },
  { serviceKey: 'motion', cat: 'Title Sequence', catAr: 'تتر', name: 'Documentary Opener', nameAr: 'افتتاحية وثائقي' },
  { serviceKey: 'motion', cat: 'Lower Thirds', catAr: 'عناوين سفلية', name: 'News Show Pack', nameAr: 'باقة برنامج إخباري' },
  { serviceKey: 'motion', cat: 'Explainer', catAr: 'شرح', name: 'SaaS Product Animation', nameAr: 'أنيميشن شرح منتج SaaS' },
];

export default function ClientPage({
  heroData,
  servicesData,
  statsData,
  brandsData,
  testimonialsData,
  trainingData,
  trainingStatsData,
  processData,
  storyData,
  countriesData,
  faqsData,
  socialData,
  worksData,
  welcomeChaptersData,
  contactData,
  quickBriefData,
  mentorshipBriefData
}: {
  heroData: any,
  servicesData: any[],
  statsData: any[],
  brandsData: any[],
  testimonialsData: any[],
  trainingData: any,
  trainingStatsData: any[],
  processData: any[],
  storyData: any[],
  countriesData: any[],
  faqsData: any[],
  socialData: any[],
  worksData?: any[],
  welcomeChaptersData?: any[],
  contactData?: any,
  quickBriefData?: any,
  mentorshipBriefData?: any
}) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__WORKS_DATA__ = worksData;
      (window as any).__TESTIMONIALS_DATA__ = (testimonialsData || []).map((t: any) => ({
        name: t.name,
        name_ar: t.nameAr,
        role: t.role,
        role_ar: t.roleAr,
        stars: t.rating ?? 5,
        initials: t.name ? t.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'C',
        text: t.text,
        text_ar: t.textAr,
        row: t.row
      }));
      (window as any).__COUNTRIES_DATA__ = countriesData;
    }
  }, [worksData, testimonialsData, countriesData]);

  const profileImage = heroData?.image || '/images/karim.jpg';
  const displayName = heroData?.name || 'Karim Abdelaziz';
  const displayNameAr = heroData?.nameAr || 'كريم عبدالعزيز';
  const [firstName, ...restName] = displayName.split(' ');
  const lastName = restName.join(' ') || 'Abdelaziz';
  const quickBrief = normalizeQuickBriefConfig(quickBriefData);
  const mentorshipBrief = normalizeMentorshipBriefConfig(mentorshipBriefData);
  const isBookingPhrase = (value?: string | null) => Boolean(value && /book|booking|call|discovery|احجز|حجز|مكالمة|استكشاف/i.test(value));
  const cleanLink = (value?: string | null, fallback = '#') => {
    const target = value?.trim();
    if (!target || target === '/book' || target.startsWith('/book')) return fallback;
    if (target === '#work' || target === '/work' || target.startsWith('/work')) return '#services';
    return target;
  };
  const heroPrimaryText = isBookingPhrase(heroData?.ctaPrimaryText) ? 'Start a Project' : (heroData?.ctaPrimaryText || 'Start a Project');
  const heroPrimaryTextAr = isBookingPhrase(heroData?.ctaPrimaryTextAr) ? 'ابدأ مشروع' : (heroData?.ctaPrimaryTextAr || 'ابدأ مشروع');
  const heroPrimaryLink = cleanLink(heroData?.ctaPrimaryLink, '#');
  const heroSecondaryText = heroData?.ctaSecondaryText || 'See My Work';
  const heroSecondaryTextAr = heroData?.ctaSecondaryTextAr || 'شاهد أعمالي';
  const heroSecondaryLink = cleanLink(heroData?.ctaSecondaryLink, '#services');
  const contactTagline = isBookingPhrase(contactData?.tagline)
    ? 'Have a project in mind? Send a quick brief and I will get back to you with the best next step.'
    : (contactData?.tagline || 'Have a project in mind? Send a quick brief and I will get back to you with the best next step.');
  const contactTaglineAr = isBookingPhrase(contactData?.taglineAr)
    ? 'عندك مشروع في بالك؟ ابعت بريف سريع وهرد عليك بأفضل خطوة نبدأ منها.'
    : (contactData?.taglineAr || 'عندك مشروع في بالك؟ ابعت بريف سريع وهرد عليك بأفضل خطوة نبدأ منها.');
  const splitCopy = (value: string) => value.split(/\n+/).map((part) => part.trim()).filter(Boolean);
  const fallbackTrainingDescription = [
    'Learn from a working professional.',
    'Focused, practical training for aspiring editors and videographers who want real-world skills - not textbook theory.',
    "Whether you're starting out or trying to break into professional work, my mentorship is built around your specific goals.",
  ].join('\n');
  const fallbackTrainingDescriptionAr = [
    'تعلم من محترف يمارس المجال',
    'تدريب عملي ومركز للمونتيرز والمصورين الطامحين اللي عايزين مهارات حقيقية - مش نظريات.',
    'سواء بتبدأ أو بتحاول تدخل المجال الاحترافي، الإرشاد بتاعي مصمم حوالين أهدافك الخاصة.',
  ].join('\n');
  const trainingDescriptionParts = splitCopy(trainingData?.description || fallbackTrainingDescription);
  const trainingDescriptionArParts = splitCopy(trainingData?.descriptionAr || fallbackTrainingDescriptionAr);
  const activeWorks = (worksData || []).filter((w: any) => w.active !== false);
  const portfolioWorks = activeWorks.length > 0
    ? activeWorks.map((work: any) => ({ ...work, isFallback: false }))
    : fallbackPortfolioWorks.map((work, idx) => ({
        id: `fallback-${work.serviceKey}-${idx}`,
        slug: '',
        title: work.name,
        titleAr: work.nameAr || work.name,
        category: work.cat,
        categoryAr: work.catAr || work.cat,
        thumbnail: '/images/karim.jpg',
        serviceKey: work.serviceKey,
        serviceId: '',
        isFallback: true,
      }));

  const handleDynamicLink = (e: any, link?: string | null, fallbackSection?: string) => {
    const target = link?.trim();
    if (!target || target === '#') {
      e.preventDefault();
      if (typeof window !== 'undefined' && (window as any).qbOpen) {
        (window as any).qbOpen();
      }
      return;
    }

    if (target.startsWith('#')) {
      e.preventDefault();
      const section = target.slice(1) || fallbackSection;
      if (typeof window !== 'undefined' && section && (window as any).spaGo) {
        (window as any).spaGo(section);
      }
    }
  };
  const openServiceWork = (e: any, serviceKey?: string) => {
    if (!serviceKey) return;
    e.preventDefault();
    const selector = `.svc-card[data-service="${serviceKey}"]`;
    const card = typeof document !== 'undefined' ? document.querySelector<HTMLElement>(selector) : null;
    card?.click();
  };

  return (
    <main>
{/* ══════════════════ LOADING SCREEN ══════════════════ */}
<div id="pageLoader" className="page-loader">
  <div className="loader-inner">
    <div className="loader-logo">
      <img src={profileImage} id="loaderPhotoBase" className="loader-photo-base" alt={displayName} />
      <img src={profileImage} id="loaderPhotoColor" className="loader-photo-color" alt={displayName} />
    </div>
    <div className="loader-name">{displayName}</div>
    <div className="loader-bar"><div className="loader-bar-fill" id="loaderBarFill"></div></div>
    <div className="loader-percentage" id="loaderPercentage">0%</div>
  </div>
</div>

{/* ══════════════════ PAGE TRANSITION OVERLAY ══════════════════ */}
<div className="page-transition" id="pageTransition">
  <div className="page-transition-panel"></div>
  <div className="page-transition-panel"></div>
  <div className="page-transition-panel"></div>
</div>

{/* ══════════════════ WELCOME SECTION ══════════════════ */}
<div id="welcome-section">


{/* Scroll track (gives scrollable length) */}
<div className="scroll-track"></div>

{/* Fixed viewport where everything renders */}
<div className="viewport">
  {/* Atmosphere */}
  <div className="orb orb1"></div>
  <div className="orb orb2"></div>
  <div className="orb orb3"></div>

  {/* Photo reveal layer */}
  <div className="photo-reveal" id="photoReveal">
    <div className="photo-reveal-img" id="photoRevealImg"></div>
  </div>

  {/* Stage */}
  <div className="stage" id="stage">

    {(welcomeChaptersData || []).map((chap: any, idx: number) => {
      if (chap.isIntro) {
        return (
          <div key={chap.id || idx} className="chapter chapter-intro active" data-chapter="0">
            <div className="chapter-inner">
              <div className="intro-logo">
                <img src={profileImage} alt={displayName} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
              </div>
              <h1 className="intro-title" data-en={chap.phrase} data-ar={chap.phraseAr} dangerouslySetInnerHTML={{ __html: chap.phrase }}></h1>
              <p className="intro-sub" data-en={chap.subText} data-ar={chap.subTextAr}>{chap.subText}</p>
            </div>
          </div>
        );
      }

      if (chap.isFinal) {
        return (
          <div key={chap.id || idx} className="chapter chapter-final" data-chapter={chap.order}>
            <div className="chap-glow"></div>
            <div className="chapter-inner">
              <div className="chap-label">
                <div className="chap-label-line"></div>
                <span data-en={chap.label} data-ar={chap.labelAr}>{chap.label}</span>
                <div className="chap-label-line"></div>
              </div>
              <h2 className="final-title" data-en={chap.phrase} data-ar={chap.phraseAr} dangerouslySetInnerHTML={{ __html: chap.phrase }}></h2>
            </div>
          </div>
        );
      }

      return (
        <div key={chap.id || idx} className="chapter" data-chapter={chap.order}>
          <div className="chap-glow"></div>
          <div className="chapter-inner">
            <div className="chap-label">
              <div className="chap-label-line"></div>
              <span data-en={chap.label} data-ar={chap.labelAr}>{chap.label}</span>
              <div className="chap-label-line"></div>
            </div>
            <div className="chap-number">
              <span className="num-counter" data-target={chap.number}>0</span>
              {chap.suffix && <span className="num-suffix" data-en={chap.suffix} data-ar={chap.suffixAr || chap.suffix}>{chap.suffix}</span>}
            </div>
            <p className="chap-phrase" data-en={chap.phrase} data-ar={chap.phraseAr} dangerouslySetInnerHTML={{ __html: chap.phrase }}></p>
            {chap.subText && <div className="chap-sub" data-en={chap.subText} data-ar={chap.subTextAr || chap.subText}>{chap.subText}</div>}
          </div>
        </div>
      );
    })}

  </div>
</div>

{/* Top Bar */}
<div className="top-bar">
  <div className="brand-mark">
    <div className="brand-mark-logo">
      <img src={profileImage} alt={displayName} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
    </div>
    <span data-en={displayName} data-ar={displayNameAr}>{displayName}</span>
  </div>
  <div className="top-actions flex flex-col md:flex-row gap-4">
    <button className="lang-btn" id="langBtn">العربية</button>
  </div>
</div>

{/* Large floating skip button (always visible during welcome) */}
<button className="skip-btn-floating" onClick={() => { if(typeof window !== "undefined" && (window as any).enterSite) { (window as any).enterSite() } } } id="welcomeSkipBtn">
  <span data-en="Skip to Portfolio" data-ar="تخطي للمعرض">Skip to Portfolio</span>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
</button>

{/* Progress Rail (vertical line on left) */}
<div className="progress-rail">
  <div className="rail-track">
    <div className="rail-fill" id="railFill"></div>
  </div>
  <div className="rail-labels" id="railLabels"></div>
</div>

{/* Chapter counter */}
<div className="chapter-counter">
  <span className="chapter-counter-current" id="chapterCurrent">01</span>
  <div className="chapter-counter-divider"></div>
  <span data-en="of 07" data-ar="من ٠٧">of 07</span>
</div>

{/* Scroll hint */}
<div className="scroll-hint" id="scrollHint">
  <span data-en="Scroll to begin" data-ar="مرر للبدء">Scroll to begin</span>
  <div className="scroll-hint-icon"></div>
</div>



</div>

{/* ══════════════════ PORTFOLIO SECTION ══════════════════ */}
<div id="portfolio-section">


<div className="atmosphere"></div>
<div className="orb orb-1"></div>
<div className="orb orb-2"></div>
<div className="orb orb-3"></div>

{/* NAV */}
<SpaNavbar />

{/* HERO (original style with portrait BG) */}
<section id="hero" data-page="home">
  <div className="hero-image">
    <div className="photo-bg" style={{ backgroundImage: heroData?.image ? `url(${heroData.image})` : undefined }}></div>
  </div>
  <div className="hero-content">
    <div className="hero-greet" data-en={heroData?.greeting || "Hi I'm"} data-ar={heroData?.greetingAr || "أهلاً، أنا"}>{heroData?.greeting || "Hi I'm"}</div>
    <h1 className="hero-name" data-en-only="true">
      <span style={{ display: 'block' }}>{firstName}</span>
      <span style={{ display: 'block' }}>{lastName}</span>
    </h1>
    <h1 className="hero-name" data-ar-only="true" style={{ display: 'none' }}>
      {heroData?.nameAr || 'كريم عبدالعزيز'}
    </h1>
    <p
      className="hero-tagline"
      data-en={heroData?.tagline || "I edit branded videos that turn <em>viewers into customers.</em> Cinematic craft for brands that need their content to <em>perform</em> — not just look pretty."}
      data-ar={heroData?.taglineAr || "بعمل فيديوهات براند بتحوّل <em>المشاهدين لعملاء.</em> حرفة سينمائية للبراندات اللي محتاجة محتواها <em>يحقق نتائج</em> — مش بس يبقى جميل."}
      dangerouslySetInnerHTML={{ __html: heroData?.tagline || "I edit branded videos that turn <em>viewers into customers.</em> Cinematic craft for brands that need their content to <em>perform</em> — not just look pretty." }}
    ></p>
    <div className="hero-ctas">
      <a href={heroPrimaryLink} onClick={(e) => handleDynamicLink(e, heroPrimaryLink)} className="cta-primary">
        <span data-en={heroPrimaryText} data-ar={heroPrimaryTextAr}>{heroPrimaryText}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
      </a>
      <a href={heroSecondaryLink} onClick={(e) => handleDynamicLink(e, heroSecondaryLink, 'services')} className="cta-secondary">
        <span data-en={heroSecondaryText} data-ar={heroSecondaryTextAr}>{heroSecondaryText}</span>
      </a>
    </div>
    <div className="hero-trust">
      <div className="trust-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        <span data-en="Quick project brief" data-ar="بريف مشروع سريع">Quick project brief</span>
      </div>
      <div className="trust-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        <span data-en="No commitment required" data-ar="بدون أي التزام">No commitment required</span>
      </div>
      <div className="trust-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        <span data-en="Reply within 24h" data-ar="رد خلال ٢٤ ساعة">Reply within 24h</span>
      </div>
    </div>
  </div>
</section>

{/* ═══════════════════ HOME — BRANDS TEASER ═══════════════════ */}
<section id="home-brands" data-page="home">
  <div className="container">
    <div className="home-brands-wrap reveal">
      <div className="home-brands-label" data-en="Trusted by teams at" data-ar="بثقة فرق من">Trusted by teams at</div>
      <div className="home-brands-marquee">
        <div className="home-brands-track">
          {(brandsData || []).concat(brandsData || []).map((brand: any, idx: number) => (
            <span key={idx}>
              <span className={`hb-item ${brand.style || ''}`}>{brand.name}</span>
              <span className="hb-dot">●</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

{/* ═══════════════════ HOME — SERVICES TEASER ═══════════════════ */}
<section id="home-services" data-page="home">
  <div className="container">
    <div className="eyebrow reveal" data-en="What I Do" data-ar="خدماتي">What I Do</div>
    <h2 className="heading reveal" data-en="Crafted for the moment." data-ar="مصنوع للحظة.">Crafted for the moment.</h2>
    <p className="home-section-sub reveal" data-en="From cinematic edits to brand stories — every project gets the same care." data-ar="من مونتاج سينمائي لقصص براندات — كل مشروع بياخد نفس الاهتمام.">From cinematic edits to brand stories — every project gets the same care.</p>

    <div className="home-svc-grid">
      {(servicesData || []).slice(0, 3).map((service: any, idx: number) => (
        <div key={service.id || idx} className="home-svc-card reveal" onClick={() => { if(typeof window !== "undefined" && (window as any).spaGo) { (window as any).spaGo('services'); } } }>
          <div className="home-svc-icon">
            {getServiceIcon(service.icon)}
          </div>
          <div className="home-svc-title" data-en={service.title} data-ar={service.titleAr}>{service.title}</div>
          <div className="home-svc-desc" data-en={service.description} data-ar={service.descriptionAr}>{service.description}</div>
        </div>
      ))}
    </div>

    <div className="home-section-cta reveal">
      <a href="#services" onClick={(e) => { e.preventDefault(); if(typeof window !== "undefined" && (window as any).spaGo) { (window as any).spaGo('services'); } }} className="ghost-link">
        <span data-en="See all services" data-ar="شاهد كل الخدمات">See all services</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
      </a>
    </div>
  </div>
</section>

{/* ═══════════════════ HOME — FINAL CTA ═══════════════════ */}
<section id="home-cta" data-page="home">
  <div className="container">
    <div className="home-cta-wrap reveal">
      <div className="home-cta-eyebrow" data-en="Let's create together" data-ar="خلينا نبدع سوا">Let's create together</div>
      <h2 className="home-cta-title" data-en="Ready to make <em>something real?</em>" data-ar="جاهز نعمل <em>حاجة حقيقية؟</em>">Ready to make <em>something real?</em></h2>
      <p className="home-cta-sub" data-en="Send the essentials in under a minute, and I will reply with a clear next step." data-ar="ابعت الأساسيات في أقل من دقيقة، وهرد عليك بخطوة واضحة نبدأ منها.">Send the essentials in under a minute, and I will reply with a clear next step.</p>
      <div className="home-cta-actions">
        <a href="#" onClick={(e) => { e.preventDefault(); if(typeof window !== "undefined" && (window as any).qbOpen) { (window as any).qbOpen(); } }} className="cta-primary">
          <span data-en="Start your project" data-ar="ابدأ مشروعك">Start your project</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </a>
        <a href="#about" onClick={(e) => { e.preventDefault(); if(typeof window !== "undefined" && (window as any).spaGo) { (window as any).spaGo('about'); } }} className="cta-secondary">
          <span data-en="Learn more about Karim" data-ar="اعرف أكثر عن كريم">Learn more about Karim</span>
        </a>
      </div>
    </div>
  </div>
</section>

  <section id="testimonials" data-page="home">
  <div className="container">
    <div style={{ textAlign: 'center' }}>
      <div className="eyebrow" data-en="See My Customers" data-ar="عملائي">See My Customers</div>
      <h2 className="heading" data-en="Awesome Clients." data-ar="عملاء مميزون">Awesome Clients.</h2>
      <p style={{ fontSize: '16px', color: 'var(--muted)', maxWidth: '540px', margin: '0 auto', lineHeight: '1.6' }} data-en="My foundation is in storytelling, with a keen eye for craft. I specialize in creating cinematic, engaging, and impactful video content." data-ar="أساسي هو حكاية القصص بعين فنية. متخصص في صناعة محتوى فيديو سينمائي مؤثر وجذاب.">My foundation is in storytelling, with a keen eye for craft. I specialize in creating cinematic, engaging, and impactful video content.</p>
    </div>
  </div>
  <div className="testi-marquee-wrap" id="testiCarousel">
    {/* Rows are generated by JS */}
  </div>
</section>

{/* MERGED ABOUT + GLOBAL */}
<section id="about" data-page="about">
  {/* Cinematic storytelling — scroll-driven journey */}
  <div className="story-stage">
    {/* Background atmosphere layers */}
    <div className="story-bg-layer story-bg-1"></div>
    <div className="story-bg-layer story-bg-2"></div>
    <div className="story-bg-layer story-bg-3"></div>

    {/* Floating particles */}
    <div className="story-particles">
      <span className="particle"></span><span className="particle"></span><span className="particle"></span>
      <span className="particle"></span><span className="particle"></span><span className="particle"></span>
      <span className="particle"></span><span className="particle"></span><span className="particle"></span>
      <span className="particle"></span><span className="particle"></span><span className="particle"></span>
    </div>

    {/* Journey line — vertical thread that grows with scroll, connecting chapters */}
    <div className="journey-line">
      <div className="journey-line-track"></div>
      <div className="journey-line-progress" id="journeyProgress"></div>
      <div className="journey-line-tip" id="journeyTip">
        <div className="journey-tip-pulse"></div>
        <div className="journey-tip-core"></div>
      </div>
      {/* Connection nodes at each chapter */}
      <div className="journey-node" data-node="1"></div>
      <div className="journey-node" data-node="2"></div>
      <div className="journey-node" data-node="3"></div>
      <div className="journey-node" data-node="4"></div>
      <div className="journey-node" data-node="5"></div>
    </div>

    {/* Vertical progress rail (sticky) */}
    {(storyData || []).map((chap: any, idx: number) => {
      const orderNum = chap.order;
      const isReverse = chap.reversed;
      const isFinal = chap.order === 5;

      const renderVisual = () => {
        switch (orderNum) {
          case 1:
            return (
              <div className="story-photo-frame">
                <div className="story-photo-bg" id="storyPhoto1"></div>
                <div className="story-photo-overlay"></div>
              </div>
            );
          case 2:
            return (
              <div className="story-glyph">
                <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="100" cy="100" r="80" opacity="0.3"/>
                  <circle cx="100" cy="100" r="60" opacity="0.5"/>
                  <circle cx="100" cy="100" r="40" opacity="0.7"/>
                  <circle cx="100" cy="100" r="20" fill="currentColor" opacity="0.8"/>
                  <path d="M100 20 L100 180 M20 100 L180 100" opacity="0.2"/>
                </svg>
              </div>
            );
          case 3:
            return (
              <div className="story-photo-frame story-photo-tilted">
                <div className="story-photo-bg" id="storyPhoto2"></div>
                <div className="story-photo-overlay"></div>
                <div className="story-photo-badge">
                  <span data-en={chap.imageBadge || "The craft"} data-ar={chap.imageBadgeAr || "الحرفة"}>
                    {chap.imageBadge || "The craft"}
                  </span>
                </div>
              </div>
            );
          case 4:
            return (
              <div className="story-globe">
                <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth={1}>
                  <circle cx="100" cy="100" r="85" opacity="0.4"/>
                  <ellipse cx="100" cy="100" rx="85" ry="35" opacity="0.4"/>
                  <ellipse cx="100" cy="100" rx="85" ry="55" opacity="0.3"/>
                  <ellipse cx="100" cy="100" rx="35" ry="85" opacity="0.4"/>
                  <ellipse cx="100" cy="100" rx="55" ry="85" opacity="0.3"/>
                  <circle cx="100" cy="100" r="3" fill="#5fa3e0"/>
                  <circle cx="55" cy="80" r="2" fill="#5fa3e0"/>
                  <circle cx="140" cy="120" r="2" fill="#5fa3e0"/>
                  <circle cx="70" cy="140" r="2" fill="#5fa3e0"/>
                  <circle cx="155" cy="65" r="2" fill="#5fa3e0"/>
                </svg>
              </div>
            );
          default:
            return null;
        }
      };

      if (isFinal) {
        return (
          <div key={chap.id || idx} className="story-chapter story-chapter-final" data-story-chapter={orderNum}>
            <div className="story-content story-content-centered">
              <div className="story-eyebrow reveal-story"><span data-en={chap.eyebrow} data-ar={chap.eyebrowAr}>{chap.eyebrow}</span></div>
              <h2 className="story-title-big reveal-story" data-en={chap.title} data-ar={chap.titleAr} dangerouslySetInnerHTML={{ __html: chap.title }}></h2>
              <p className="story-text-big reveal-story" data-en={chap.text} data-ar={chap.textAr}>{chap.text}</p>
              <div className="story-cta-wrap reveal-story">
                <a href="#" onClick={(e) => { e.preventDefault(); if(typeof window !== "undefined" && (window as any).qbOpen) { (window as any).qbOpen(); } }} className="cta-primary">
                  <span data-en="Let's create together" data-ar="خلينا نبدع سوا">Let's create together</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </a>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div key={chap.id || idx} className={`story-chapter ${isReverse ? 'story-chapter-reverse' : ''}`} data-story-chapter={orderNum}>
          <div className="story-content">
            <div className="story-eyebrow reveal-story"><span data-en={chap.eyebrow} data-ar={chap.eyebrowAr}>{chap.eyebrow}</span></div>
            <h2 className="story-title reveal-story" data-en={chap.title} data-ar={chap.titleAr} dangerouslySetInnerHTML={{ __html: chap.title }}></h2>
            <p className="story-text reveal-story" data-en={chap.text} data-ar={chap.textAr}>{chap.text}</p>
            {chap.imageBadge && orderNum === 1 && (
              <div className="story-year reveal-story" data-en={chap.imageBadge} data-ar={chap.imageBadgeAr}>{chap.imageBadge}</div>
            )}
            {chap.stats && (chap.stats as any[]).length > 0 && (
              <div className="story-stats reveal-story">
                {(chap.stats as any[]).map((s: any, sIdx: number) => (
                  <div key={sIdx} className="story-stat-item">
                    <span className="story-stat-num" data-count-target={s.number}>0</span>
                    <span className="story-stat-lbl" data-en={s.label} data-ar={s.labelAr}>{s.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="story-visual">
            {renderVisual()}
          </div>
        </div>
      );
    })}

  </div>
</section>

{/* WORLD MAP (SPA section) */}
<section id="map" data-page="about">
  <div className="container">
    {/* World map full width below the about grid */}
    <div style={{ marginTop: '0' }}>
      <div className="world-stats-bar">
        <div className="ws-item"><span className="ws-num"><span className="count" data-target="1318" data-suffix="+">0</span></span><span className="ws-lbl" data-en="Projects" data-ar="مشروع">Projects</span></div>
        <span className="ws-globe">🌍</span>
        <div className="ws-divider"></div>
        <div className="ws-item"><span className="ws-num"><span className="count" data-target="14" data-suffix="+">0</span></span><span className="ws-lbl" data-en="Countries" data-ar="دولة">Countries</span></div>
        <div className="ws-divider"></div>
        <div className="ws-item"><span className="ws-num"><span className="count" data-target="470" data-suffix="+">0</span></span><span className="ws-lbl" data-en="Clients" data-ar="عميل">Clients</span></div>
      </div>

      <WorldMap />
    </div>
  </div>
</section>

{/* HOW I WORK */}
<section id="process" data-page="about">
  <div className="container">
    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
      <div className="eyebrow" data-en="The Process" data-ar="رحلة العمل">The Process</div>
      <h2 className="heading" data-en="Simple. Transparent. Fast." data-ar="بسيط. واضح. سريع.">Simple. Transparent. Fast.</h2>
      <p className="lead" data-en="From the first message to final delivery — here's exactly how we'll work together." data-ar="من أول رسالة لحد التسليم النهائي — اعرف بالظبط هنشتغل مع بعض إزاي.">From the first message to final delivery — here's exactly how we'll work together.</p>
    </div>

    <div className="process-grid">
      {(processData || []).map((step: any, idx: number) => (
        <div key={step.id || idx} className="process-step">
          <div className="process-num">{String(idx + 1).padStart(2, '0')}</div>
          <div className="process-icon">
            {getProcessIcon(step.icon)}
          </div>
          <h3 className="process-title" data-en={step.title} data-ar={step.titleAr}>{step.title}</h3>
          <p className="process-desc" data-en={step.description} data-ar={step.descriptionAr}>{step.description}</p>
          <div className="process-time" data-en={step.timeLabel} data-ar={step.timeLabelAr}>{step.timeLabel}</div>
        </div>
      ))}
    </div>

    {/* What I Need From You — Collaboration expectations */}
    <div className="process-expectations reveal">
      <div className="exp-header">
        <div className="exp-eyebrow" data-en="Your Part" data-ar="دورك">Your Part</div>
        <h3 className="exp-title" data-en="What I'll need from <em>you</em>" data-ar="اللي محتاجه <em>منك</em>">What I'll need from <em>you</em></h3>
        <p className="exp-sub" data-en="Great work is a two-way street. Here's how we'll keep your project moving without delays." data-ar="الشغل العظيم بيتعمل سوا. ده اللي بيخلي مشروعك يمشي بدون تأخير.">Great work is a two-way street. Here's how we'll keep your project moving without delays.</p>
      </div>
      <div className="exp-grid">
        <div className="exp-item">
          <div className="exp-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div className="exp-content">
            <h4 className="exp-item-title" data-en="Quick feedback" data-ar="فيدباك سريع">Quick feedback</h4>
            <p className="exp-item-desc" data-en="Reviews within 48 hours. Delayed feedback delays delivery — simple as that." data-ar="مراجعة الفيدباك في خلال ٤٨ ساعة. التأخير في الفيدباك بيأخر التسليم — ببساطة كده.">Reviews within 48 hours. Delayed feedback delays delivery — simple as that.</p>
          </div>
        </div>
        <div className="exp-item">
          <div className="exp-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <div className="exp-content">
            <h4 className="exp-item-title" data-en="Clear brief" data-ar="بريف واضح">Clear brief</h4>
            <p className="exp-item-desc" data-en="A simple doc with your goals, audience, and references. I'll guide you if needed." data-ar="مستند بسيط فيه أهدافك، الجمهور، والـ references. هساعدك تكتبه لو محتاج.">A simple doc with your goals, audience, and references. I'll guide you if needed.</p>
          </div>
        </div>
        <div className="exp-item">
          <div className="exp-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </div>
          <div className="exp-content">
            <h4 className="exp-item-title" data-en="Open communication" data-ar="تواصل مفتوح">Open communication</h4>
            <p className="exp-item-desc" data-en="Tell me when something doesn't feel right. Honest feedback makes better work — always." data-ar="قوللي لو حاجة مش ماشية صح. الفيدباك الصريح بيعمل شغل أحسن — دايماً.">Tell me when something doesn't feel right. Honest feedback makes better work — always.</p>
          </div>
        </div>
        <div className="exp-item">
          <div className="exp-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div className="exp-content">
            <h4 className="exp-item-title" data-en="Approval on time" data-ar="موافقة في الوقت">Approval on time</h4>
            <p className="exp-item-desc" data-en="Once we agree on milestones, sign off on time so we can move forward together." data-ar="لما نتفق على المراحل، وافق في الميعاد عشان نقدر نكمل سوا.">Once we agree on milestones, sign off on time so we can move forward together.</p>
          </div>
        </div>
      </div>
    </div>

    <div className="process-cta">
      <a href="#" onClick={(e) => { e.preventDefault(); if(typeof window !== "undefined" && (window as any).qbOpen) { (window as any).qbOpen(); } }} className="cta-primary">
        <span data-en="Start Your Project" data-ar="ابدأ مشروعك">Start Your Project</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
      </a>
    </div>
  </div>
</section>

{/* SERVICES (clickable cards) */}
<section id="services" data-page="services">
  <div className="container">
    <div className="eyebrow" data-en="What I Do" data-ar="خدماتي">What I Do</div>
    <h2 className="heading" data-en="Crafted services." data-ar="خدمات احترافية">Crafted services.</h2>

    {/* Rotating description text */}
    <div className="svc-rotator">
      <span className="svc-rotator-prefix" data-en="Here you'll find" data-ar="هنا هتلاقي">Here you'll find</span>
      <span className="svc-rotator-words" id="svcRotator">
        <span className="svc-rword active" data-en="cinematic editing that turns moments into stories." data-ar="مونتاج سينمائي بيحوّل اللحظات لقصص.">cinematic editing that turns moments into stories.</span>
        <span className="svc-rword" data-en="full cinematography — directed, shot, and crafted." data-ar="تصوير سينمائي كامل — إخراج وتصوير بحرفية.">full cinematography — directed, shot, and crafted.</span>
        <span className="svc-rword" data-en="documentary storytelling that captures real emotion." data-ar="سرد وثائقي بيلتقط المشاعر الحقيقية.">documentary storytelling that captures real emotion.</span>
        <span className="svc-rword" data-en="brand content that speaks to your audience." data-ar="محتوى براند بيتكلم مع جمهورك.">brand content that speaks to your audience.</span>
        <span className="svc-rword" data-en="motion graphics that elevate every frame." data-ar="موشن جرافيكس بيرفع قيمة كل لقطة.">motion graphics that elevate every frame.</span>
        <span className="svc-rword" data-en="color grading that gives your footage soul." data-ar="تدريج ألوان بيدّي لقطاتك روح.">color grading that gives your footage soul.</span>
      </span>
    </div>
    <div className="services-grid">
      {(servicesData || []).map((service: any, idx: number) => (
        <div
          key={service.id || idx}
          className="svc-card reveal"
          data-service={service.icon}
          data-service-id={service.id}
          data-service-title={service.title}
          data-service-title-ar={service.titleAr || service.title}
        >
          <div className="svc-icon">
            {getServiceIcon(service.icon)}
          </div>
          <div className="svc-card-body">
            <div className="svc-title" data-en={service.title} data-ar={service.titleAr}>{service.title}</div>
            <p className="svc-desc" data-en={service.description} data-ar={service.descriptionAr}>{service.description}</p>
          </div>
          <button type="button" className="svc-cta" data-en="View Work" data-ar="شاهد الأعمال">View Work</button>
        </div>
      ))}
    </div>
  </div>
</section>

<section id="portfolio" data-page="services" className="services-portfolio">
  <div className="container">
    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
      <div className="eyebrow" data-en="Selected Projects" data-ar="مشاريع مختارة">Selected Projects</div>
      <h2 className="heading" data-en="My Portfolio." data-ar="معرض أعمالي">My Portfolio.</h2>
    </div>

    <div className="work-grid">
      {portfolioWorks.map((work: any) => (
        <a
          key={work.id}
          href={work.isFallback ? '#portfolio' : `/work/${work.slug}`}
          onClick={work.isFallback ? (e) => openServiceWork(e, work.serviceKey) : undefined}
          className="work-card"
          data-service-id={work.serviceId || ''}
          data-work-category={work.category || ''}
        >
          <div className="work-thumbnail">
            <img src={work.thumbnail || '/images/karim.jpg'} alt={work.title} />
            <div className="work-overlay">
              <div className="play-icon">▶</div>
            </div>
          </div>
          <div className="work-info">
            <h3 className="work-title" data-en={work.title} data-ar={work.titleAr || work.title}>{work.title}</h3>
            <div className="work-category" data-en={work.category} data-ar={work.categoryAr || work.category}>{work.category}</div>
          </div>
        </a>
      ))}
    </div>
  </div>
</section>

{/* MODAL for service work */}
<div className="modal-overlay" id="modal">
  <div className="modal">
    <button className="modal-close" id="modalClose">✕</button>
    <div className="modal-eyebrow" id="modalEyebrow">Selected Work</div>
    <h2 className="modal-title" id="modalTitle">Video Editing</h2>
    <div className="modal-works" id="modalWorks"></div>
  </div>
</div>

{/* TESTIMONIALS — Carousel */}
{/* TRAINING + STUDENT REVIEWS */}
<section id="training" data-page="training">
  <div className="container">
    <div className="eyebrow" data-en="Level Up" data-ar="ارتقي بمستواك">Level Up</div>
    <h2 className="heading" data-en={trainingData?.title || "Editing mentorship."} data-ar={trainingData?.titleAr || "برنامج تدريب المونتاج"}>
      {trainingData?.title || "Editing mentorship."}
    </h2>
    <div className="training-card">
      <div>
        {trainingDescriptionParts.map((part, idx) => {
          const textAr = trainingDescriptionArParts[idx] || part;
          return idx === 0 ? (
            <h3 key={idx} data-en={part} data-ar={textAr}>{part}</h3>
          ) : (
            <p key={idx} data-en={part} data-ar={textAr}>{part}</p>
          );
        })}
        <ul className="training-list">
          {trainingData?.points?.map((pt: string, idx: number) => (
            <li key={idx} data-en={pt} data-ar={trainingData?.pointsAr?.[idx] || pt}>{pt}</li>
          ))}
        </ul>
        <div className="consult-btn-wrap">
          <a href="#" onClick={(e) => { e.preventDefault(); if(typeof window !== "undefined" && (window as any).mbOpen) { (window as any).mbOpen(); } }} className="consult-btn">
            <span data-en="Start a Mentorship Brief" data-ar="ابدأ بريف المنتورنج">Start a Mentorship Brief</span>
          </a>
        </div>
      </div>
      <div className="training-stats">
        {trainingStatsData?.map((stat, idx) => {
          if (stat.number === '1:1') {
            return (
              <div key={idx} className="ts">
                <div className="ts-n fade-pulse">1:1</div>
                <div className="ts-l fade-pulse" data-en={stat.label} data-ar={stat.labelAr} style={{ animationDelay: '.5s' }}>{stat.label}</div>
              </div>
            );
          } else if (stat.number === 'Online') {
            return (
              <div key={idx} className="ts">
                <div className="ts-n" data-en="Online" data-ar="أونلاين" style={{ fontSize: '32px' }}>Online</div>
                <div className="ts-l" data-en={stat.label} data-ar={stat.labelAr}>{stat.label}</div>
              </div>
            );
          } else {
            return (
              <div key={idx} className="ts">
                <div className="ts-n">
                  <span className="count" data-target={stat.number.replace(/\D/g, '')} data-suffix={stat.number.replace(/\d/g, '')}>0</span>
                </div>
                <div className="ts-l" data-en={stat.label} data-ar={stat.labelAr}>{stat.label}</div>
              </div>
            );
          }
        })}
      </div>
    </div>

    {/* Student Reviews — Carousel */}
    <div className="student-reviews">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div className="eyebrow" data-en="Student Stories" data-ar="قصص الطلاب">Student Stories</div>
        <h3 data-en="From my mentees." data-ar="آراء طلابي">From my mentees.</h3>
      </div>
      <div className="student-reviews-wrap">
        <div className="student-reviews-row" id="studentReviews">
          {/* Generated by JS */}
        </div>
      </div>
    </div>

    {/* Video Reviews */}
    <div className="video-reviews">
      <div className="video-reviews-header">
        <div className="eyebrow" data-en="Video Testimonials" data-ar="شهادات بالفيديو">Video Testimonials</div>
        <h3 style={{ fontSize: '32px', fontWeight: '600', color: 'var(--white)', letterSpacing: '-.8px', marginTop: '12px' }} data-en="Hear it from them." data-ar="اسمعها منهم">Hear it from them.</h3>
        <p style={{ fontSize: '15px', color: 'var(--muted)', maxWidth: '520px', margin: '16px auto 0', lineHeight: '1.6' }} data-en="Real students sharing their journey and transformation." data-ar="طلاب حقيقيون يشاركون رحلتهم وتطورهم.">Real students sharing their journey and transformation.</p>
      </div>
      <div className="video-reviews-grid">
        {testimonialsData?.filter(t => t.isVideo).map((t, idx) => (
          <div key={idx} className="video-card">
            <div className="video-card-glow"></div>
            <div className="video-card-bg" style={{ backgroundImage: t.videoThumbnail ? `url(${t.videoThumbnail})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <div className="video-card-quote">"</div>
            <div className="video-card-play" onClick={() => { if(typeof window !== "undefined" && (window as any).openVideoModal) { (window as any).openVideoModal(t.videoUrl); } }}>
              <svg viewBox="0 0 24 24"><polygon points="6,4 20,12 6,20"/></svg>
            </div>
            <div className="video-card-info">
              <div className="video-card-text" data-en={t.text} data-ar={t.textAr}>{t.text}</div>
              <div className="video-card-name">{t.name}</div>
              <div className="video-card-role" data-en={t.role} data-ar={t.roleAr}>{t.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

{/* CONTACT */}
<section id="contact" data-page="contact">
  <div className="contact-inner">
    <div className="eyebrow" data-en="Start a Project" data-ar="ابدأ مشروع">Start a Project</div>
    <h2 className="heading" data-en="Let's create something." data-ar="هيا نبدع معاً">Let's create something.</h2>
    <p className="contact-tagline" data-en={contactTagline} data-ar={contactTaglineAr}>
      {contactTagline}
    </p>

    {/* Main CTAs */}
    <div className="contact-actions">
      <a href="#" onClick={(e) => { e.preventDefault(); if(typeof window !== "undefined" && (window as any).qbOpen) { (window as any).qbOpen(); } }} className="contact-cta-primary contact-cta-project">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M5 12h14"/>
          <path d="M12 5l7 7-7 7"/>
        </svg>
        <div className="contact-cta-text">
          <div className="contact-cta-label" data-en="Start Project" data-ar="ابدأ مشروع">Start Project</div>
          <div className="contact-cta-action" data-en="Send a quick brief" data-ar="ابعت بريف سريع">Send a quick brief</div>
        </div>
      </a>
      <a href={contactData?.whatsapp ? `https://wa.me/${contactData.whatsapp.replace(/\D/g, '')}` : "#"} onClick={(e) => { if (!contactData?.whatsapp) { e.preventDefault(); if(typeof window !== "undefined" && (window as any).qbOpen) { (window as any).qbOpen(); } } }} className="contact-cta-primary" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <div className="contact-cta-text">
          <div className="contact-cta-label" data-en="Quick Chat" data-ar="محادثة سريعة">Quick Chat</div>
          <div className="contact-cta-action" data-en="Message on WhatsApp" data-ar="راسلني على واتساب">Message on WhatsApp</div>
        </div>
      </a>

      <a href={contactData?.email ? `mailto:${contactData.email}` : "#"} onClick={(e) => { if (!contactData?.email) { e.preventDefault(); if(typeof window !== "undefined" && (window as any).qbOpen) { (window as any).qbOpen(); } } }} className="contact-cta-secondary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        <div className="contact-cta-text">
          <div className="contact-cta-label" data-en="Project Brief" data-ar="بريف المشروع">Project Brief</div>
          <div className="contact-cta-action" data-en="Send via Email" data-ar="ارسل عبر الإيميل">Send via Email</div>
        </div>
      </a>
    </div>

    {/* Quick FAQ */}
    <div className="contact-faq">
      {(faqsData || []).map((faq, idx) => (
        <div key={idx} className="faq-item">
          <div className="faq-q" data-en={faq.question} data-ar={faq.questionAr}>{faq.question}</div>
          <div className="faq-a" data-en={faq.answer} data-ar={faq.answerAr}>{faq.answer}</div>
        </div>
      ))}
    </div>

    <div className="socials">
      {(socialData || []).map((soc, idx) => (
        <a key={idx} href={soc.url} className="soc" aria-label={soc.platform} target="_blank" rel="noopener noreferrer">
          {getSocialIcon(soc.platform)}
        </a>
      ))}
    </div>
  </div>
</section>



<footer>
  <div className="footer-content">
    <div className="footer-col footer-brand">
      <div className="footer-logo">KA</div>
      <div className="footer-tagline" data-en="Cinematic storytelling for brands that perform." data-ar="سرد سينمائي للبراندات اللي بتحقق نتائج.">Cinematic storytelling for brands that perform.</div>
    </div>
    <div className="footer-col">
      <div className="footer-col-title" data-en="Explore" data-ar="استكشف">Explore</div>
      <a href="#home" onClick={() => { if(typeof window !== "undefined" && window.spaGo) { window.spaGo('home');return false; } } } data-en="Home" data-ar="الرئيسية">Home</a>
      <a href="#about" onClick={() => { if(typeof window !== "undefined" && window.spaGo) { window.spaGo('about');return false; } } } data-en="About" data-ar="عني">About</a>
      <a href="#services" onClick={() => { if(typeof window !== "undefined" && window.spaGo) { window.spaGo('services');return false; } } } data-en="Services" data-ar="خدماتي">Services</a>
      <a href="#contact" onClick={() => { if(typeof window !== "undefined" && window.spaGo) { window.spaGo('contact');return false; } } } data-en="Contact" data-ar="تواصل">Contact</a>
    </div>
    <div className="footer-col">
      <div className="footer-col-title" data-en="For Editors" data-ar="للمونتيرين">For Editors</div>
      <a href="#training" onClick={() => { if(typeof window !== "undefined" && window.spaGo) { window.spaGo('training');return false; } } } data-en="Mentorship & Training" data-ar="التدريب والمنتورنج">Mentorship &amp; Training</a>
      <a href="#training" onClick={() => { if(typeof window !== "undefined" && window.spaGo) { window.spaGo('training');return false; } } } data-en="Student Reviews" data-ar="آراء الطلاب">Student Reviews</a>
    </div>
    <div className="footer-col">
      <div className="footer-col-title" data-en="Connect" data-ar="تواصل">Connect</div>
      <a href="#" onClick={() => { if(typeof window !== "undefined" && window.qbOpen) { window.qbOpen();return false; } } } data-en="Start a project" data-ar="ابدأ مشروع">Start a project</a>
      <a href="#contact" onClick={() => { if(typeof window !== "undefined" && window.spaGo) { window.spaGo('contact');return false; } } } data-en="Get in touch" data-ar="تواصل معي">Get in touch</a>
    </div>
  </div>
  <div className="footer-bottom">
    <div className="footer-text">© 2026 Karim Abdelaziz · <span data-en="Cairo · Worldwide" data-ar="القاهرة · حول العالم">Cairo · Worldwide</span></div>
  </div>
</footer>



{/* ═══════════════════ QUICK BRIEF MODAL ═══════════════════ */}


<div
  className="qb-modal"
  id="qbModal"
  data-whatsapp={contactData?.whatsapp || ''}
  data-email={contactData?.email || ''}
>
  <div className="qb-modal-content">
    <button className="qb-close" onClick={() => { if(typeof window !== "undefined" && window.qbClose) { window.qbClose() } } } aria-label="Close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>

    <div className="qb-header">
      <div className="qb-eyebrow" data-en={quickBrief.eyebrow} data-ar={quickBrief.eyebrowAr}>{quickBrief.eyebrow}</div>
      <div className="qb-title" id="qbTitle" data-en={quickBrief.title} data-ar={quickBrief.titleAr}>{quickBrief.title}</div>
      <div className="qb-sub" data-en={quickBrief.subtitle} data-ar={quickBrief.subtitleAr}>{quickBrief.subtitle}</div>
    </div>

    <div className="qb-progress">
      <div className="qb-progress-dot active" data-step="1"></div>
      <div className="qb-progress-dot" data-step="2"></div>
      <div className="qb-progress-dot" data-step="3"></div>
      <div className="qb-progress-dot" data-step="4"></div>
      <div className="qb-progress-dot" data-step="5"></div>
    </div>

    {/* STEP 1: Name */}
    <div className="qb-step active" data-step="1">
      <div className="qb-step-label" data-en={quickBrief.nameLabel} data-ar={quickBrief.nameLabelAr}>{quickBrief.nameLabel}</div>
      <input type="text" className="qb-input" id="qbName" placeholder={quickBrief.namePlaceholder} data-en-placeholder={quickBrief.namePlaceholder} data-ar-placeholder={quickBrief.namePlaceholderAr} />
      <div className="qb-actions">
        <button className="qb-btn qb-btn-primary" onClick={() => { if(typeof window !== "undefined" && window.qbNext) { window.qbNext() } } }>
          <span data-en="Next" data-ar="التالي">Next</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>

    {/* STEP 2: Project Type */}
    <div className="qb-step" data-step="2">
      <div className="qb-step-label" data-en={quickBrief.projectTypeLabel} data-ar={quickBrief.projectTypeLabelAr}>{quickBrief.projectTypeLabel}</div>
      <div className="qb-options">
        {quickBrief.projectTypes.map((option, idx) => (
          <button key={`${option.label}-${idx}`} className="qb-option" data-field="projectType" data-value={getQuickBriefOptionValue(option)}>
            {option.icon && <span className="qb-option-icon">{option.icon}</span>}
            <span data-en={option.label} data-ar={option.labelAr || option.label}>{option.label}</span>
          </button>
        ))}
      </div>
      <div className="qb-actions">
        <button className="qb-btn qb-btn-ghost" onClick={() => { if(typeof window !== "undefined" && window.qbPrev) { window.qbPrev() } } }>
          <span data-en="Back" data-ar="رجوع">Back</span>
        </button>
        <button className="qb-btn qb-btn-primary" id="qbStep2Next" onClick={() => { if(typeof window !== "undefined" && window.qbNext) { window.qbNext() } } }>
          <span data-en="Next" data-ar="التالي">Next</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>

    {/* STEP 3: Budget */}
    <div className="qb-step" data-step="3">
      <div className="qb-step-label" data-en={quickBrief.budgetLabel} data-ar={quickBrief.budgetLabelAr}>{quickBrief.budgetLabel}</div>
      <div className="qb-step-helper" data-en={quickBrief.budgetHelper} data-ar={quickBrief.budgetHelperAr}>{quickBrief.budgetHelper}</div>
      <div className="qb-options">
        {quickBrief.budgets.map((option, idx) => (
          <button key={`${option.label}-${idx}`} className="qb-option" data-field="budget" data-value={getQuickBriefOptionValue(option)}>
            <span data-en={option.label} data-ar={option.labelAr || option.label}>{option.label}</span>
          </button>
        ))}
      </div>
      <div className="qb-actions">
        <button className="qb-btn qb-btn-ghost" onClick={() => { if(typeof window !== "undefined" && window.qbPrev) { window.qbPrev() } } }>
          <span data-en="Back" data-ar="رجوع">Back</span>
        </button>
        <button className="qb-btn qb-btn-primary" id="qbStep3Next" onClick={() => { if(typeof window !== "undefined" && window.qbNext) { window.qbNext() } } }>
          <span data-en="Next" data-ar="التالي">Next</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>

    {/* STEP 4: Timeline + Optional details */}
    <div className="qb-step" data-step="4">
      <div className="qb-step-label" data-en={quickBrief.timelineLabel} data-ar={quickBrief.timelineLabelAr}>{quickBrief.timelineLabel}</div>
      <div className="qb-options" style={{ marginBottom: '24px' }}>
        {quickBrief.timelines.map((option, idx) => (
          <button key={`${option.label}-${idx}`} className="qb-option" data-field="timeline" data-value={getQuickBriefOptionValue(option)}>
            {option.icon && <span className="qb-option-icon">{option.icon}</span>}
            <span data-en={option.label} data-ar={option.labelAr || option.label}>{option.label}</span>
          </button>
        ))}
      </div>
      <div className="qb-step-label" data-en={quickBrief.detailsLabel} data-ar={quickBrief.detailsLabelAr}>{quickBrief.detailsLabel}</div>
      <textarea className="qb-input qb-textarea" id="qbDetails" placeholder={quickBrief.detailsPlaceholder} data-en-placeholder={quickBrief.detailsPlaceholder} data-ar-placeholder={quickBrief.detailsPlaceholderAr}></textarea>
      <div className="qb-actions">
        <button className="qb-btn qb-btn-ghost" onClick={() => { if(typeof window !== "undefined" && window.qbPrev) { window.qbPrev() } } }>
          <span data-en="Back" data-ar="رجوع">Back</span>
        </button>
        <button className="qb-btn qb-btn-primary" id="qbStep4Next" onClick={() => { if(typeof window !== "undefined" && window.qbNext) { window.qbNext() } } }>
          <span data-en="Continue" data-ar="استمر">Continue</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>

    {/* STEP 5: Choose channel */}
    <div className="qb-step" data-step="5">
      <div className="qb-step-label" data-en={quickBrief.connectLabel} data-ar={quickBrief.connectLabelAr}>{quickBrief.connectLabel}</div>
      <div className="qb-summary">
        <div className="qb-summary-title" data-en={quickBrief.summaryTitle} data-ar={quickBrief.summaryTitleAr}>{quickBrief.summaryTitle}</div>
        <div id="qbSummaryItems"></div>
      </div>
      <div className="qb-channels">
        <button className="qb-channel qb-channel-whatsapp" onClick={() => { if(typeof window !== "undefined" && window.qbSend) { window.qbSend('whatsapp') } } }>
          <div className="qb-channel-icon">💬</div>
          <div className="qb-channel-text">
            <div className="qb-channel-title" data-en="Message on WhatsApp" data-ar="رسالة على واتساب">Message on WhatsApp</div>
            <div className="qb-channel-desc" data-en="Fastest reply — usually within hours" data-ar="أسرع رد — عادةً في خلال ساعات">Fastest reply — usually within hours</div>
          </div>
          <div className="qb-channel-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></div>
        </button>
        <button className="qb-channel qb-channel-email" onClick={() => { if(typeof window !== "undefined" && window.qbSend) { window.qbSend('email') } } }>
          <div className="qb-channel-icon">✉️</div>
          <div className="qb-channel-text">
            <div className="qb-channel-title" data-en="Send via Email" data-ar="ابعت عبر الإيميل">Send via Email</div>
            <div className="qb-channel-desc" data-en="For detailed briefs and attachments" data-ar="للتفاصيل والمرفقات">For detailed briefs and attachments</div>
          </div>
          <div className="qb-channel-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></div>
        </button>
      </div>
      <div className="qb-actions">
        <button className="qb-btn qb-btn-ghost" onClick={() => { if(typeof window !== "undefined" && window.qbPrev) { window.qbPrev() } } } style={{ flex: 'none', padding: '14px 28px' }}>
          <span data-en="Back" data-ar="رجوع">Back</span>
        </button>
      </div>
    </div>

  </div>
</div>


{/* ═══════════════════ MENTORSHIP BRIEF MODAL ═══════════════════ */}

<div
  className="qb-modal mb-modal"
  id="mbModal"
  data-whatsapp={contactData?.whatsapp || ''}
  data-email={contactData?.email || ''}
>
  <div className="qb-modal-content">
    <button className="qb-close" onClick={() => { if(typeof window !== "undefined" && window.mbClose) { window.mbClose() } } } aria-label="Close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>

    <div className="qb-header">
      <div className="qb-eyebrow" data-en={mentorshipBrief.eyebrow} data-ar={mentorshipBrief.eyebrowAr}>{mentorshipBrief.eyebrow}</div>
      <div className="qb-title" id="mbTitle" data-en={mentorshipBrief.title} data-ar={mentorshipBrief.titleAr}>{mentorshipBrief.title}</div>
      <div className="qb-sub" data-en={mentorshipBrief.subtitle} data-ar={mentorshipBrief.subtitleAr}>{mentorshipBrief.subtitle}</div>
    </div>

    <div className="qb-progress">
      <div className="qb-progress-dot mb-progress-dot active" data-step="1"></div>
      <div className="qb-progress-dot mb-progress-dot" data-step="2"></div>
      <div className="qb-progress-dot mb-progress-dot" data-step="3"></div>
      <div className="qb-progress-dot mb-progress-dot" data-step="4"></div>
      <div className="qb-progress-dot mb-progress-dot" data-step="5"></div>
    </div>

    <div className="qb-step mb-step active" data-mb-step="1">
      <div className="qb-step-label" data-en={mentorshipBrief.nameLabel} data-ar={mentorshipBrief.nameLabelAr}>{mentorshipBrief.nameLabel}</div>
      <input type="text" className="qb-input" id="mbName" placeholder={mentorshipBrief.namePlaceholder} data-en-placeholder={mentorshipBrief.namePlaceholder} data-ar-placeholder={mentorshipBrief.namePlaceholderAr} />
      <div className="qb-actions">
        <button type="button" className="qb-btn qb-btn-primary" onClick={() => { if(typeof window !== "undefined" && window.mbNext) { window.mbNext() } } }>
          <span data-en="Next" data-ar="التالي">Next</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>

    <div className="qb-step mb-step" data-mb-step="2">
      <div className="qb-step-label" data-en={mentorshipBrief.levelLabel} data-ar={mentorshipBrief.levelLabelAr}>{mentorshipBrief.levelLabel}</div>
      <div className="qb-options">
        {mentorshipBrief.levels.map((option, idx) => (
          <button type="button" key={`${option.label}-${idx}`} className="qb-option mb-option" data-field="level" data-value={getQuickBriefOptionValue(option)} data-value-ar={option.labelAr || option.label}>
            {option.icon && <span className="qb-option-icon">{option.icon}</span>}
            <span data-en={option.label} data-ar={option.labelAr || option.label}>{option.label}</span>
          </button>
        ))}
      </div>
      <div className="qb-actions">
        <button type="button" className="qb-btn qb-btn-ghost" onClick={() => { if(typeof window !== "undefined" && window.mbPrev) { window.mbPrev() } } }><span data-en="Back" data-ar="رجوع">Back</span></button>
        <button type="button" className="qb-btn qb-btn-primary" id="mbStep2Next" onClick={() => { if(typeof window !== "undefined" && window.mbNext) { window.mbNext() } } }>
          <span data-en="Next" data-ar="التالي">Next</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>

    <div className="qb-step mb-step" data-mb-step="3">
      <div className="qb-step-label" data-en={mentorshipBrief.goalLabel} data-ar={mentorshipBrief.goalLabelAr}>{mentorshipBrief.goalLabel}</div>
      <div className="qb-options">
        {mentorshipBrief.goals.map((option, idx) => (
          <button type="button" key={`${option.label}-${idx}`} className="qb-option mb-option" data-field="goal" data-value={getQuickBriefOptionValue(option)} data-value-ar={option.labelAr || option.label}>
            {option.icon && <span className="qb-option-icon">{option.icon}</span>}
            <span data-en={option.label} data-ar={option.labelAr || option.label}>{option.label}</span>
          </button>
        ))}
      </div>
      <div className="qb-actions">
        <button type="button" className="qb-btn qb-btn-ghost" onClick={() => { if(typeof window !== "undefined" && window.mbPrev) { window.mbPrev() } } }><span data-en="Back" data-ar="رجوع">Back</span></button>
        <button type="button" className="qb-btn qb-btn-primary" id="mbStep3Next" onClick={() => { if(typeof window !== "undefined" && window.mbNext) { window.mbNext() } } }>
          <span data-en="Next" data-ar="التالي">Next</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>

    <div className="qb-step mb-step" data-mb-step="4">
      <div className="qb-step-label" data-en={mentorshipBrief.formatLabel} data-ar={mentorshipBrief.formatLabelAr}>{mentorshipBrief.formatLabel}</div>
      <div className="qb-options" style={{ marginBottom: '24px' }}>
        {mentorshipBrief.formats.map((option, idx) => (
          <button type="button" key={`${option.label}-${idx}`} className="qb-option mb-option" data-field="format" data-value={getQuickBriefOptionValue(option)} data-value-ar={option.labelAr || option.label}>
            <span data-en={option.label} data-ar={option.labelAr || option.label}>{option.label}</span>
          </button>
        ))}
      </div>
      <div className="qb-step-label" data-en={mentorshipBrief.timelineLabel} data-ar={mentorshipBrief.timelineLabelAr}>{mentorshipBrief.timelineLabel}</div>
      <div className="qb-options" style={{ marginBottom: '24px' }}>
        {mentorshipBrief.timelines.map((option, idx) => (
          <button type="button" key={`${option.label}-${idx}`} className="qb-option mb-option" data-field="timeline" data-value={getQuickBriefOptionValue(option)} data-value-ar={option.labelAr || option.label}>
            {option.icon && <span className="qb-option-icon">{option.icon}</span>}
            <span data-en={option.label} data-ar={option.labelAr || option.label}>{option.label}</span>
          </button>
        ))}
      </div>
      <div className="qb-step-label" data-en={mentorshipBrief.detailsLabel} data-ar={mentorshipBrief.detailsLabelAr}>{mentorshipBrief.detailsLabel}</div>
      <textarea className="qb-input qb-textarea" id="mbDetails" placeholder={mentorshipBrief.detailsPlaceholder} data-en-placeholder={mentorshipBrief.detailsPlaceholder} data-ar-placeholder={mentorshipBrief.detailsPlaceholderAr}></textarea>
      <div className="qb-actions">
        <button type="button" className="qb-btn qb-btn-ghost" onClick={() => { if(typeof window !== "undefined" && window.mbPrev) { window.mbPrev() } } }><span data-en="Back" data-ar="رجوع">Back</span></button>
        <button type="button" className="qb-btn qb-btn-primary" id="mbStep4Next" onClick={() => { if(typeof window !== "undefined" && window.mbNext) { window.mbNext() } } }>
          <span data-en="Continue" data-ar="استمر">Continue</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>

    <div className="qb-step mb-step" data-mb-step="5">
      <div className="qb-step-label" data-en={mentorshipBrief.connectLabel} data-ar={mentorshipBrief.connectLabelAr}>{mentorshipBrief.connectLabel}</div>
      <div className="qb-summary">
        <div className="qb-summary-title" data-en={mentorshipBrief.summaryTitle} data-ar={mentorshipBrief.summaryTitleAr}>{mentorshipBrief.summaryTitle}</div>
        <div id="mbSummaryItems"></div>
      </div>
      <div className="qb-channels">
        <button type="button" className="qb-channel qb-channel-whatsapp" onClick={() => { if(typeof window !== "undefined" && window.mbSend) { window.mbSend('whatsapp') } } }>
          <div className="qb-channel-icon">💬</div>
          <div className="qb-channel-text">
            <div className="qb-channel-title" data-en="Message on WhatsApp" data-ar="رسالة على واتساب">Message on WhatsApp</div>
            <div className="qb-channel-desc" data-en="Best for quick mentorship follow-up" data-ar="الأفضل للمتابعة السريعة">Best for quick mentorship follow-up</div>
          </div>
          <div className="qb-channel-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></div>
        </button>
        <button type="button" className="qb-channel qb-channel-email" onClick={() => { if(typeof window !== "undefined" && window.mbSend) { window.mbSend('email') } } }>
          <div className="qb-channel-icon">✉️</div>
          <div className="qb-channel-text">
            <div className="qb-channel-title" data-en="Send via Email" data-ar="ابعت عبر الإيميل">Send via Email</div>
            <div className="qb-channel-desc" data-en="Useful if you have links and notes" data-ar="مناسب لو عندك روابط وملاحظات">Useful if you have links and notes</div>
          </div>
          <div className="qb-channel-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></div>
        </button>
      </div>
      <div className="qb-actions">
        <button type="button" className="qb-btn qb-btn-ghost" onClick={() => { if(typeof window !== "undefined" && window.mbPrev) { window.mbPrev() } } } style={{ flex: 'none', padding: '14px 28px' }}>
          <span data-en="Back" data-ar="رجوع">Back</span>
        </button>
      </div>
    </div>

  </div>
</div>



{/* ═══════════════════ GLOBAL SOCIAL RAIL ═══════════════════ */}
<div className="social-rail" id="socialRail">
  <div className="social-rail-track"></div>
  {(socialData || []).map((social, idx) => {
    // Basic mapping from platform to icon
    let iconClass = "fa-solid fa-link";
    if (social.platform.toLowerCase().includes('instagram')) iconClass = "fa-brands fa-instagram";
    else if (social.platform.toLowerCase().includes('linkedin')) iconClass = "fa-brands fa-linkedin";
    else if (social.platform.toLowerCase().includes('youtube')) iconClass = "fa-brands fa-youtube";
    else if (social.platform.toLowerCase().includes('behance')) iconClass = "fa-brands fa-behance";
    else if (social.platform.toLowerCase().includes('facebook')) iconClass = "fa-brands fa-facebook";
    else if (social.platform.toLowerCase().includes('twitter') || social.platform.toLowerCase().includes('x')) iconClass = "fa-brands fa-x-twitter";
    else if (social.platform.toLowerCase().includes('github')) iconClass = "fa-brands fa-github";

    return (
      <a key={social.id || `${social.platform}-${idx}`} href={social.url} target="_blank" rel="noopener noreferrer" className="social-rail-dot" aria-label={social.platform}>
        <i className={social.icon || iconClass} style={{ fontSize: '1.2rem', color: 'currentColor' }}></i>
        <span className="social-rail-tooltip" data-en={social.platform} data-ar={social.platform}>{social.platform}</span>
      </a>
    );
  })}
</div>


</div>
    </main>
  );
}
