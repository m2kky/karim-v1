export type QuickBriefOption = {
  label: string;
  labelAr?: string;
  value?: string;
  icon?: string;
  active?: boolean;
};

export type QuickBriefConfig = {
  eyebrow: string;
  eyebrowAr: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  nameLabel: string;
  nameLabelAr: string;
  namePlaceholder: string;
  namePlaceholderAr: string;
  projectTypeLabel: string;
  projectTypeLabelAr: string;
  budgetLabel: string;
  budgetLabelAr: string;
  budgetHelper: string;
  budgetHelperAr: string;
  timelineLabel: string;
  timelineLabelAr: string;
  detailsLabel: string;
  detailsLabelAr: string;
  detailsPlaceholder: string;
  detailsPlaceholderAr: string;
  connectLabel: string;
  connectLabelAr: string;
  summaryTitle: string;
  summaryTitleAr: string;
  projectTypes: QuickBriefOption[];
  budgets: QuickBriefOption[];
  timelines: QuickBriefOption[];
};

export type MentorshipBriefConfig = {
  eyebrow: string;
  eyebrowAr: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  nameLabel: string;
  nameLabelAr: string;
  namePlaceholder: string;
  namePlaceholderAr: string;
  levelLabel: string;
  levelLabelAr: string;
  goalLabel: string;
  goalLabelAr: string;
  formatLabel: string;
  formatLabelAr: string;
  timelineLabel: string;
  timelineLabelAr: string;
  detailsLabel: string;
  detailsLabelAr: string;
  detailsPlaceholder: string;
  detailsPlaceholderAr: string;
  connectLabel: string;
  connectLabelAr: string;
  summaryTitle: string;
  summaryTitleAr: string;
  levels: QuickBriefOption[];
  goals: QuickBriefOption[];
  formats: QuickBriefOption[];
  timelines: QuickBriefOption[];
};

export const DEFAULT_QUICK_BRIEF_CONFIG: QuickBriefConfig = {
  eyebrow: 'Quick Brief',
  eyebrowAr: 'نموذج سريع',
  title: 'Tell me about your project',
  titleAr: 'احكيلي عن مشروعك',
  subtitle: 'Takes 30 seconds and helps me understand what you need.',
  subtitleAr: '٣٠ ثانية بس وبتساعدني أفهم احتياجك بسرعة.',
  nameLabel: "What's your name?",
  nameLabelAr: 'اسمك إيه؟',
  namePlaceholder: 'Your name',
  namePlaceholderAr: 'اسمك',
  projectTypeLabel: 'What kind of project?',
  projectTypeLabelAr: 'نوع المشروع؟',
  budgetLabel: 'Budget range?',
  budgetLabelAr: 'الميزانية التقريبية؟',
  budgetHelper: 'Helps me suggest the right scope. Honest answers help us both.',
  budgetHelperAr: 'بيساعدني أقترح حاجة مناسبة. الصراحة بتفيدنا الاتنين.',
  timelineLabel: 'When do you need it?',
  timelineLabelAr: 'إمتى محتاجه؟',
  detailsLabel: 'Anything else? (optional)',
  detailsLabelAr: 'أي حاجة تانية؟ (اختياري)',
  detailsPlaceholder: 'Brief description, references, links...',
  detailsPlaceholderAr: 'وصف سريع، مراجع، روابط...',
  connectLabel: 'How should we connect?',
  connectLabelAr: 'نتواصل إزاي؟',
  summaryTitle: 'Your brief',
  summaryTitleAr: 'ملخص',
  projectTypes: [
    { icon: '🎬', label: 'Video Editing', labelAr: 'مونتاج فيديو', value: 'Video Editing' },
    { icon: '📷', label: 'Cinematography', labelAr: 'تصوير سينمائي', value: 'Cinematography' },
    { icon: '✨', label: 'Brand Content', labelAr: 'محتوى براند', value: 'Brand Content' },
    { icon: '🎞️', label: 'Documentary', labelAr: 'فيلم وثائقي', value: 'Documentary' },
    { icon: '📱', label: 'Social Media', labelAr: 'سوشيال ميديا', value: 'Social Media' },
    { icon: '💡', label: 'Something else', labelAr: 'حاجة تانية', value: 'Other' },
  ],
  budgets: [
    { label: 'Under $500', labelAr: 'أقل من $500', value: 'Under $500' },
    { label: '$500 - $2K', labelAr: '$500 - $2K', value: '$500 - $2K' },
    { label: '$2K - $5K', labelAr: '$2K - $5K', value: '$2K - $5K' },
    { label: '$5K and up', labelAr: '$5K وأكثر', value: '$5K+' },
    { label: 'Not sure yet', labelAr: 'مش متأكد لسه', value: 'Not sure yet' },
    { label: "Let's discuss", labelAr: 'نتفاهم', value: 'Flexible' },
  ],
  timelines: [
    { icon: '⚡', label: 'ASAP', labelAr: 'حالاً', value: 'ASAP (this week)' },
    { icon: '📅', label: 'This month', labelAr: 'الشهر ده', value: 'This month' },
    { icon: '📆', label: 'Next month', labelAr: 'الشهر الجاي', value: 'Next month' },
    { icon: '↔', label: 'Flexible', labelAr: 'مرن', value: 'Flexible' },
  ],
};

export const DEFAULT_MENTORSHIP_BRIEF_CONFIG: MentorshipBriefConfig = {
  eyebrow: 'Mentorship Brief',
  eyebrowAr: 'بريف المنتورنج',
  title: 'Tell me about your editing goals',
  titleAr: 'احكيلي عن هدفك في المونتاج',
  subtitle: 'A focused brief so I can suggest the right mentorship path.',
  subtitleAr: 'بريف سريع عشان أقترحلك مسار منتورنج مناسب.',
  nameLabel: "What's your name?",
  nameLabelAr: 'اسمك إيه؟',
  namePlaceholder: 'Your name',
  namePlaceholderAr: 'اسمك',
  levelLabel: 'Where are you now?',
  levelLabelAr: 'مستواك الحالي إيه؟',
  goalLabel: 'What do you want to improve?',
  goalLabelAr: 'عايز تطور إيه؟',
  formatLabel: 'Preferred mentorship format?',
  formatLabelAr: 'شكل المنتورنج المناسب؟',
  timelineLabel: 'When do you want to start?',
  timelineLabelAr: 'تحب نبدأ إمتى؟',
  detailsLabel: 'Portfolio links or context? (optional)',
  detailsLabelAr: 'روابط البورتفوليو أو تفاصيل؟ (اختياري)',
  detailsPlaceholder: 'Portfolio link, weak points, software you use...',
  detailsPlaceholderAr: 'لينك البورتفوليو، نقاط الضعف، البرامج اللي بتستخدمها...',
  connectLabel: 'How should we connect?',
  connectLabelAr: 'نتواصل إزاي؟',
  summaryTitle: 'Your mentorship brief',
  summaryTitleAr: 'ملخص المنتورنج',
  levels: [
    { icon: '🌱', label: 'Beginner', labelAr: 'مبتدئ', value: 'Beginner' },
    { icon: '✂️', label: 'Intermediate editor', labelAr: 'مستوى متوسط', value: 'Intermediate' },
    { icon: '🎬', label: 'Working editor', labelAr: 'مونتير شغال', value: 'Working editor' },
    { icon: '🚀', label: 'Want to go pro', labelAr: 'عايز أحترف', value: 'Going pro' },
  ],
  goals: [
    { icon: '🧠', label: 'Editing decisions', labelAr: 'قرارات المونتاج', value: 'Editing decisions' },
    { icon: '🎨', label: 'Color and look', labelAr: 'الألوان واللوك', value: 'Color and look' },
    { icon: '📁', label: 'Portfolio review', labelAr: 'مراجعة بورتفوليو', value: 'Portfolio review' },
    { icon: '💼', label: 'Pricing and clients', labelAr: 'التسعير والعملاء', value: 'Pricing and clients' },
    { icon: '📱', label: 'Reels and social content', labelAr: 'ريلز وسوشيال', value: 'Reels and social content' },
  ],
  formats: [
    { label: '1:1 session', labelAr: 'جلسة 1:1', value: '1:1 session' },
    { label: 'Portfolio audit', labelAr: 'مراجعة بورتفوليو', value: 'Portfolio audit' },
    { label: 'Multi-session mentorship', labelAr: 'منتورنج على كذا جلسة', value: 'Multi-session mentorship' },
    { label: 'Not sure yet', labelAr: 'مش متأكد لسه', value: 'Not sure yet' },
  ],
  timelines: [
    { icon: '⚡', label: 'ASAP', labelAr: 'حالاً', value: 'ASAP' },
    { icon: '📅', label: 'This week', labelAr: 'الأسبوع ده', value: 'This week' },
    { icon: '📆', label: 'This month', labelAr: 'الشهر ده', value: 'This month' },
    { icon: '↔', label: 'Flexible', labelAr: 'مرن', value: 'Flexible' },
  ],
};

const optionListKeys = ['projectTypes', 'budgets', 'timelines'] as const;
const mentorshipOptionListKeys = ['levels', 'goals', 'formats', 'timelines'] as const;

function normalizeOptions(options: unknown, fallback: QuickBriefOption[]) {
  const value = Array.isArray(options) ? options : fallback;
  return value
    .filter((option): option is QuickBriefOption => Boolean(option && option.label))
    .filter((option) => option.active !== false)
    .map((option) => ({
      label: option.label,
      labelAr: option.labelAr || option.label,
      value: option.value || option.label,
      icon: option.icon || '',
      active: option.active !== false,
    }));
}

export function normalizeQuickBriefConfig(input: unknown): QuickBriefConfig {
  const raw = input && typeof input === 'object' ? (input as Partial<QuickBriefConfig>) : {};
  const merged: QuickBriefConfig = { ...DEFAULT_QUICK_BRIEF_CONFIG, ...raw };

  for (const key of optionListKeys) {
    const fallback = DEFAULT_QUICK_BRIEF_CONFIG[key];
    merged[key] = normalizeOptions(raw[key], fallback);
  }

  return merged;
}

export function normalizeMentorshipBriefConfig(input: unknown): MentorshipBriefConfig {
  const raw = input && typeof input === 'object' ? (input as Partial<MentorshipBriefConfig>) : {};
  const merged: MentorshipBriefConfig = { ...DEFAULT_MENTORSHIP_BRIEF_CONFIG, ...raw };

  for (const key of mentorshipOptionListKeys) {
    const fallback = DEFAULT_MENTORSHIP_BRIEF_CONFIG[key];
    merged[key] = normalizeOptions(raw[key], fallback);
  }

  return merged;
}

export function getQuickBriefOptionValue(option: QuickBriefOption) {
  return option.value || option.label;
}

export function quickBriefOptionsToText(options: QuickBriefOption[], includeIcon = true) {
  return options
    .map((option) => {
      const parts = includeIcon
        ? [option.label, option.labelAr || option.label, option.value || option.label, option.icon || '']
        : [option.label, option.labelAr || option.label, option.value || option.label];
      return parts.join(' | ');
    })
    .join('\n');
}

export function parseQuickBriefOptionsText(value: FormDataEntryValue | null, includeIcon = true): QuickBriefOption[] {
  const text = typeof value === 'string' ? value : '';
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = '', labelAr = '', optionValue = '', icon = ''] = line.split('|').map((part) => part.trim());
      return {
        label,
        labelAr: labelAr || label,
        value: optionValue || label,
        icon: includeIcon ? icon : '',
        active: true,
      };
    })
    .filter((option) => option.label);
}
