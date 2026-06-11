import { db } from '@/db/index';
import {
  hero,
  services,
  stats,
  brands,

  testimonials,
  trainingInfo,
  trainingStats,
  processSteps,
  storyChapters,
  countries,
  faqs,
  socialLinks,
  works,
  welcomeChapters,
  contactInfo,
  settings,
} from '@/db/schema';
import ClientPage from './client-page';
import { eq } from 'drizzle-orm';
import { asc } from '@/lib/db-order';

export const dynamic = 'force-dynamic';

const fallbackPublicData = {
  heroData: {
    name: 'Karim Abdelaziz',
    nameAr: 'كريم عبدالعزيز',
    greeting: "Hi I'm",
    greetingAr: 'أهلا، أنا',
    tagline: 'I edit branded videos that turn <em>viewers into customers.</em> Cinematic craft for brands that need their content to <em>perform</em> - not just look pretty.',
    taglineAr: 'بعمل فيديوهات براند بتحول <em>المشاهدين لعملاء.</em> حرفة سينمائية للبراندات اللي محتاجة محتواها <em>يحقق نتائج</em> - مش بس يبقى جميل.',
    ctaPrimaryText: 'Start a Project',
    ctaPrimaryTextAr: 'ابدأ مشروع',
    ctaPrimaryLink: '#',
    ctaSecondaryText: 'See My Work',
    ctaSecondaryTextAr: 'شاهد أعمالي',
    ctaSecondaryLink: '#services',
    image: '/images/karim.jpg',
  },
  welcomeChaptersData: [
    { order: 0, number: 'KA', suffix: null, label: 'Karim Abdelaziz', labelAr: 'كريم عبدالعزيز', phrase: '<strong>Karim</strong> Abdelaziz', phraseAr: '<strong>كريم</strong> عبدالعزيز', subText: 'A story told in numbers', subTextAr: 'قصة تروى بالأرقام', isIntro: true, isFinal: false },
    { order: 1, number: '8', suffix: 'years', suffixAr: 'سنوات', label: 'Chapter 01 · The Beginning', labelAr: 'الفصل 01 · البداية', phrase: 'It started with a <em>borrowed camera</em> and a story to tell.', phraseAr: 'بدأت بـ<em>كاميرا مستعارة</em> وقصة تتحكي.', subText: '2017 — Cairo', subTextAr: '2017 — القاهرة', isIntro: false, isFinal: false },
    { order: 2, number: '1318', suffix: '+', label: 'Chapter 02 · The Craft', labelAr: 'الفصل 02 · الحرفة', phrase: '<strong>Projects shipped.</strong> Each one a chance to get sharper.', phraseAr: '<strong>مشروع منجز.</strong> كل واحد فرصة للدقة أكثر.', subText: 'From reels to feature films', subTextAr: 'من الريلز للأفلام الطويلة', isIntro: false, isFinal: false },
    { order: 3, number: '470', suffix: '+', label: 'Chapter 03 · The Trust', labelAr: 'الفصل 03 · الثقة', phrase: '<strong>Clients</strong> who came back. <em>Trust is earned frame by frame.</em>', phraseAr: '<strong>عميل</strong> رجعوا تاني. <em>الثقة بتتبني لقطة بلقطة.</em>', subText: 'Samsung · CUPRA · 9GAG · Artlist · Asus', subTextAr: 'Samsung · CUPRA · 9GAG · Artlist · Asus', isIntro: false, isFinal: false },
    { order: 4, number: '14', suffix: 'countries', suffixAr: 'دولة', label: 'Chapter 04 · The Reach', labelAr: 'الفصل 04 · المدى', phrase: 'From Cairo, the work travels. <em>Egypt, the Gulf, Europe - and beyond.</em>', phraseAr: 'من القاهرة، الشغل بيسافر. <em>مصر، الخليج، أوروبا - وأبعد.</em>', subText: 'One studio · Global reach', subTextAr: 'استوديو واحد · انتشار عالمي', isIntro: false, isFinal: false },
    { order: 5, number: '200', suffix: '+', label: 'Chapter 05 · The Giveback', labelAr: 'الفصل 05 · العطاء', phrase: '<strong>Editors mentored.</strong> The craft only grows when you <em>pass it on.</em>', phraseAr: '<strong>مونتير اتدرب.</strong> الحرفة بتكبر لما <em>تنقلها لغيرك.</em>', subText: 'Cairo · Riyadh · Online — worldwide', subTextAr: 'القاهرة · الرياض · أونلاين — عالميا', isIntro: false, isFinal: false },
    { order: 6, number: '', suffix: null, label: 'One More Number', labelAr: 'رقم أخير', phrase: 'The next one is <em>yours.</em>', phraseAr: 'الرقم القادم <em>ليك.</em>', subText: null, isIntro: false, isFinal: true },
  ],
  servicesData: [
    { order: 1, title: 'Video Editing', titleAr: 'مونتاج الفيديو', description: 'Cinematic cuts, seamless transitions, and color grading that turn raw footage into compelling visual stories.', descriptionAr: 'مونتاج سينمائي، انتقالات سلسة، وتدريج ألوان يحول الخام لقصص بصرية مؤثرة.', icon: 'editing' },
    { order: 2, title: 'Cinematography', titleAr: 'التصوير السينمائي', description: 'Full videography service - directing, shooting, and capturing footage with a cinematic eye.', descriptionAr: 'خدمة فيديو كاملة - إخراج، تصوير، والتقاط لقطات بعين سينمائية.', icon: 'cinematography' },
    { order: 3, title: 'Social Content', titleAr: 'محتوى السوشيال', description: 'Reels, TikToks, and short-form content engineered for maximum reach and engagement.', descriptionAr: 'ريلز، تيك توك، ومحتوى قصير مصمم للوصول والتفاعل.', icon: 'social' },
    { order: 4, title: 'Documentary & Brand', titleAr: 'وثائقي وبراند', description: 'Long-form storytelling that captures brand identity, human stories, and real emotion.', descriptionAr: 'سرد طويل يلتقط هوية البراند والقصص الإنسانية والإحساس الحقيقي.', icon: 'documentary' },
    { order: 5, title: 'Training & Mentorship', titleAr: 'تدريب ومنتورنج', description: 'One-on-one and group coaching for editors and videographers ready to level up.', descriptionAr: 'جلسات فردية وجماعية للمونتيرز والمصورين الجاهزين للتطور.', icon: 'mentorship' },
    { order: 6, title: 'Motion & Graphics', titleAr: 'موشن جرافيكس', description: 'Animated titles, logo reveals, and motion graphics that elevate production value.', descriptionAr: 'عناوين متحركة، ظهور شعارات، وموشن جرافيكس يرفع قيمة الإنتاج.', icon: 'motion' },
  ],
  statsData: [
    { order: 1, number: '8+', label: 'Years', labelAr: 'سنوات' },
    { order: 2, number: '1,318+', label: 'Projects', labelAr: 'مشروع' },
    { order: 3, number: '470+', label: 'Clients', labelAr: 'عميل' },
    { order: 4, number: '14', label: 'Countries', labelAr: 'دولة' },
  ],
  brandsData: [
    { order: 1, name: 'Samsung', style: null },
    { order: 2, name: 'CUPRA', style: 'bold-uppercase' },
    { order: 3, name: '9GAG', style: 'condensed' },
    { order: 4, name: 'Artlist', style: 'italic' },
    { order: 5, name: 'Asus', style: null },
  ],
  testimonialsData: [
    { order: 1, name: 'Ahmed Metwaly', role: 'Owner of Persona Gurus', roleAr: 'مالك Persona Gurus', text: "Kareem isn't just an editor. He's a creative force.", textAr: 'كريم مش مجرد مونتير. هو طاقة إبداعية.', rating: 5, isVideo: false, row: 1 },
    { order: 2, name: 'Mohamed Ghonaim', role: 'Owner of Yallastep Production', roleAr: 'مالك Yallastep Production', text: "Karim's creativity and professionalism had a real impact on our work.", textAr: 'إبداع كريم واحترافيته كان لهم تأثير حقيقي على شغلنا.', rating: 5, isVideo: false, row: 1 },
    { order: 3, name: 'Student A', role: 'Micro Mentorship', roleAr: 'برنامج Micro Mentorship', text: 'The session was excellent and I genuinely benefited from it.', textAr: 'السيشن كانت ممتازة واستفدت منها فعلا.', rating: 5, isVideo: false, row: 0 },
  ],
  trainingData: {
    title: 'Editing mentorship.',
    titleAr: 'برنامج تدريب المونتاج',
    description: 'Focused, practical training for aspiring editors and videographers who want real-world skills - not textbook theory.',
    descriptionAr: 'تدريب عملي ومركز للمونتيرز والمصورين اللي عايزين مهارات حقيقية - مش نظريات.',
    points: ['Premiere Pro & DaVinci Resolve workflows', 'Color grading & LUT creation', 'Short-form editing for Reels & TikTok', 'Storytelling and pacing techniques', 'Building your portfolio & finding clients'],
    pointsAr: ['سير عمل Premiere Pro و DaVinci Resolve', 'تدريج الألوان وصنع LUTs', 'مونتاج الريلز والتيك توك', 'تقنيات السرد والإيقاع', 'بناء البورتفوليو والوصول للعملاء'],
  },
  trainingStatsData: [
    { order: 1, number: '200+', label: 'Students Trained', labelAr: 'طالب مدرب' },
    { order: 2, number: '1:1', label: 'Personalized', labelAr: 'جلسات فردية' },
    { order: 3, number: 'Online', label: 'Available Worldwide', labelAr: 'متاح عالميا' },
  ],
  processData: [
    { order: 1, title: 'Quick Brief', titleAr: 'بريف سريع', description: 'A short project brief to understand your vision, goals, audience, and timeline.', descriptionAr: 'بريف سريع نفهم منه رؤيتك وأهدافك وجمهورك والمدة المناسبة.', icon: 'discovery', timeLabel: 'Under 1 min', timeLabelAr: 'أقل من دقيقة' },
    { order: 2, title: 'Custom Proposal', titleAr: 'عرض مخصص', description: 'You receive a clear proposal: scope, deliverables, timeline, and transparent pricing.', descriptionAr: 'بتستلم عرض واضح: نطاق الشغل، التسليمات، المدة، والتسعير.', icon: 'proposal', timeLabel: 'Within 24 hours', timeLabelAr: 'خلال 24 ساعة' },
    { order: 3, title: 'Production & Edit', titleAr: 'الإنتاج والمونتاج', description: 'I get to work - shooting, editing, color grading, and sound.', descriptionAr: 'ببدأ شغل - تصوير، مونتاج، ألوان، وصوت.', icon: 'production', timeLabel: '3-14 days typical', timeLabelAr: '3 - 14 يوم غالبا' },
    { order: 4, title: 'Delivery & Revisions', titleAr: 'التسليم والمراجعات', description: 'You get final files in the formats you need, with two revision rounds.', descriptionAr: 'بتستلم الملفات النهائية بالصيغ المطلوبة، مع جولتين مراجعة.', icon: 'delivery', timeLabel: 'Same day delivery', timeLabelAr: 'تسليم في نفس اليوم' },
  ],
  storyData: [
    { order: 1, eyebrow: 'Chapter One', eyebrowAr: 'الفصل الأول', title: 'A boy with a <em>camera.</em>', titleAr: 'ولد ومعاه <em>كاميرا.</em>', text: 'It started in 2017. A borrowed camera. A small editing program. And a stubborn belief that stories deserved to be told the right way.', textAr: 'بدأت في 2017. كاميرا مستعارة. برنامج مونتاج بسيط. وإيمان إن القصص لازم تتحكي صح.', image: '/images/karim.jpg', imageBadge: '2017', imageBadgeAr: '2017', stats: [], reversed: false },
    { order: 2, eyebrow: 'Chapter Two', eyebrowAr: 'الفصل الثاني', title: 'Mastering the <em>craft.</em>', titleAr: 'إتقان <em>الحرفة.</em>', text: 'Eight years of late nights, color grading, rebuilding sequences, and chasing the one cut that makes it sing.', textAr: 'ثمان سنين من السهر، وتدريج الألوان، وإعادة بناء السكوينس لحد اللقطة اللي تخلي الفيلم يغني.', image: '/images/karim.jpg', imageBadge: 'The craft', imageBadgeAr: 'الحرفة', stats: [{ number: '1318', label: 'projects shipped', labelAr: 'مشروع منجز' }, { number: '8', label: 'years crafting', labelAr: 'سنوات إبداع' }], reversed: true },
    { order: 3, eyebrow: 'And Today', eyebrowAr: 'واليوم', title: 'The story <em>continues.</em>', titleAr: 'القصة <em>مستمرة.</em>', text: 'Still believing every brand has a story worth telling - and that I am here to tell it.', textAr: 'لسه مؤمن إن كل براند عنده قصة تستاهل تتحكي - وإني هنا عشان أحكيها.', image: null, imageBadge: null, imageBadgeAr: null, stats: [{ number: '14', label: 'countries', labelAr: 'دولة' }, { number: '470', label: 'clients', labelAr: 'عميل' }], reversed: false },
  ],
  countriesData: [],
  faqsData: [
    { order: 1, question: 'How fast do you reply?', questionAr: 'بترد بسرعة قد إيه؟', answer: 'Within 24 hours - usually much faster.', answerAr: 'خلال 24 ساعة - وغالبا أسرع.' },
    { order: 2, question: 'Do you work remote?', questionAr: 'بتشتغل عن بعد؟', answer: 'Yes - I work with clients globally across 14 countries.', answerAr: 'أيوه - بشتغل مع عملاء حول العالم في 14 دولة.' },
  ],
  socialData: [
    { order: 1, platform: 'instagram', url: 'https://instagram.com/karimabdelaziz', label: 'Instagram' },
    { order: 2, platform: 'linkedin', url: 'https://linkedin.com/in/karimabdelaziz', label: 'LinkedIn' },
    { order: 3, platform: 'youtube', url: 'https://youtube.com/@karimabdelaziz', label: 'YouTube' },
  ],
  worksData: [],
  contactData: {
    whatsapp: '+201234567890',
    email: 'hello@karimabdelaziz.com',
    phone: null,
    tagline: 'Have a project in mind? Send a quick brief and I will get back to you with the best next step.',
    taglineAr: 'عندك مشروع في بالك؟ ابعت بريف سريع وهرد عليك بأفضل خطوة نبدأ منها.',
  },
  quickBriefData: null,
  mentorshipBriefData: null,
};

async function getPublicData() {
  try {
    const [heroData] = await db.select().from(hero).limit(1);
    const welcomeChaptersData = await db.select().from(welcomeChapters).where(eq(welcomeChapters.active, true)).orderBy(asc(welcomeChapters.order));
    const servicesData = await db.select().from(services).where(eq(services.active, true)).orderBy(asc(services.order));
    const statsData = await db.select().from(stats).where(eq(stats.active, true)).orderBy(asc(stats.order));
    const brandsData = await db.select().from(brands).where(eq(brands.active, true)).orderBy(asc(brands.order));
    const testimonialsData = await db.select().from(testimonials).where(eq(testimonials.active, true)).orderBy(asc(testimonials.order));
    const [trainingData] = await db.select().from(trainingInfo).limit(1);
    const trainingStatsData = await db.select().from(trainingStats).orderBy(asc(trainingStats.order));
    const processData = await db.select().from(processSteps).where(eq(processSteps.active, true)).orderBy(asc(processSteps.order));
    const storyData = await db.select().from(storyChapters).where(eq(storyChapters.active, true)).orderBy(asc(storyChapters.order));
    const countriesData = await db.select().from(countries).where(eq(countries.active, true));
    const faqsData = await db.select().from(faqs).where(eq(faqs.active, true)).orderBy(asc(faqs.order));
    const socialData = await db.select().from(socialLinks).where(eq(socialLinks.active, true)).orderBy(asc(socialLinks.order));
    const worksData = await db.select().from(works).where(eq(works.active, true)).orderBy(asc(works.order));
    const [contactData] = await db.select().from(contactInfo).limit(1);
    const [quickBriefSettings] = await db
      .select({ value: settings.value })
      .from(settings)
      .where(eq(settings.key, 'quick_brief_config'))
      .limit(1);
    const [mentorshipBriefSettings] = await db
      .select({ value: settings.value })
      .from(settings)
      .where(eq(settings.key, 'mentorship_brief_config'))
      .limit(1);

    return {
      heroData,
      welcomeChaptersData,
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
      contactData,
      quickBriefData: quickBriefSettings?.value ?? null,
      mentorshipBriefData: mentorshipBriefSettings?.value ?? null,
    };
  } catch (error) {
    console.error('Public page database unavailable. Rendering fallback content.', error);
    return fallbackPublicData;
  }
}

export default async function PublicPage() {
  const {
    heroData,
    welcomeChaptersData,
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
    contactData,
    quickBriefData,
    mentorshipBriefData,
  } = await getPublicData();

  return (
    <ClientPage
      heroData={heroData}
      welcomeChaptersData={welcomeChaptersData}
      servicesData={servicesData}
      statsData={statsData}
      brandsData={brandsData}
      testimonialsData={testimonialsData}
      trainingData={trainingData}
      trainingStatsData={trainingStatsData}
      processData={processData}
      storyData={storyData}
      countriesData={countriesData}
      faqsData={faqsData}
      socialData={socialData}
      worksData={worksData}
      contactData={contactData}
      quickBriefData={quickBriefData}
      mentorshipBriefData={mentorshipBriefData}
    />
  );
}
