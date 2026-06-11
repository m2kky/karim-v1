'use server';

import { db } from '@/db';
import { contactInfo, settings, socialLinks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { asc } from '@/lib/db-order';
import { revalidatePath } from 'next/cache';
import {
  DEFAULT_MENTORSHIP_BRIEF_CONFIG,
  DEFAULT_QUICK_BRIEF_CONFIG,
  normalizeMentorshipBriefConfig,
  normalizeQuickBriefConfig,
  parseQuickBriefOptionsText,
} from '@/lib/quick-brief';

const QUICK_BRIEF_SETTINGS_KEY = 'quick_brief_config';
const MENTORSHIP_BRIEF_SETTINGS_KEY = 'mentorship_brief_config';

export async function getContactInfo() {
  const [data] = await db.select().from(contactInfo).limit(1);
  return data ?? null;
}

export async function updateContactInfo(formData: FormData) {
  const data = {
    whatsapp: (formData.get('whatsapp') as string) || null,
    email: (formData.get('email') as string) || null,
    phone: (formData.get('phone') as string) || null,
    tagline: (formData.get('tagline') as string) || null,
    taglineAr: (formData.get('taglineAr') as string) || null,
    updatedAt: new Date(),
  };

  await db.insert(contactInfo).values({ id: 'main', ...data })
    .onConflictDoUpdate({ target: contactInfo.id, set: data });

  revalidatePath('/');
  revalidatePath('/contact');
  revalidatePath('/admin/contact');
  return { success: true };
}

export async function getQuickBriefConfig() {
  const [row] = await db
    .select({ value: settings.value })
    .from(settings)
    .where(eq(settings.key, QUICK_BRIEF_SETTINGS_KEY))
    .limit(1);

  return normalizeQuickBriefConfig(row?.value ?? DEFAULT_QUICK_BRIEF_CONFIG);
}

export async function updateQuickBriefConfig(formData: FormData) {
  const data = normalizeQuickBriefConfig({
    eyebrow: (formData.get('eyebrow') as string) || DEFAULT_QUICK_BRIEF_CONFIG.eyebrow,
    eyebrowAr: (formData.get('eyebrowAr') as string) || DEFAULT_QUICK_BRIEF_CONFIG.eyebrowAr,
    title: (formData.get('title') as string) || DEFAULT_QUICK_BRIEF_CONFIG.title,
    titleAr: (formData.get('titleAr') as string) || DEFAULT_QUICK_BRIEF_CONFIG.titleAr,
    subtitle: (formData.get('subtitle') as string) || DEFAULT_QUICK_BRIEF_CONFIG.subtitle,
    subtitleAr: (formData.get('subtitleAr') as string) || DEFAULT_QUICK_BRIEF_CONFIG.subtitleAr,
    nameLabel: (formData.get('nameLabel') as string) || DEFAULT_QUICK_BRIEF_CONFIG.nameLabel,
    nameLabelAr: (formData.get('nameLabelAr') as string) || DEFAULT_QUICK_BRIEF_CONFIG.nameLabelAr,
    namePlaceholder: (formData.get('namePlaceholder') as string) || DEFAULT_QUICK_BRIEF_CONFIG.namePlaceholder,
    namePlaceholderAr: (formData.get('namePlaceholderAr') as string) || DEFAULT_QUICK_BRIEF_CONFIG.namePlaceholderAr,
    projectTypeLabel: (formData.get('projectTypeLabel') as string) || DEFAULT_QUICK_BRIEF_CONFIG.projectTypeLabel,
    projectTypeLabelAr: (formData.get('projectTypeLabelAr') as string) || DEFAULT_QUICK_BRIEF_CONFIG.projectTypeLabelAr,
    budgetLabel: (formData.get('budgetLabel') as string) || DEFAULT_QUICK_BRIEF_CONFIG.budgetLabel,
    budgetLabelAr: (formData.get('budgetLabelAr') as string) || DEFAULT_QUICK_BRIEF_CONFIG.budgetLabelAr,
    budgetHelper: (formData.get('budgetHelper') as string) || DEFAULT_QUICK_BRIEF_CONFIG.budgetHelper,
    budgetHelperAr: (formData.get('budgetHelperAr') as string) || DEFAULT_QUICK_BRIEF_CONFIG.budgetHelperAr,
    timelineLabel: (formData.get('timelineLabel') as string) || DEFAULT_QUICK_BRIEF_CONFIG.timelineLabel,
    timelineLabelAr: (formData.get('timelineLabelAr') as string) || DEFAULT_QUICK_BRIEF_CONFIG.timelineLabelAr,
    detailsLabel: (formData.get('detailsLabel') as string) || DEFAULT_QUICK_BRIEF_CONFIG.detailsLabel,
    detailsLabelAr: (formData.get('detailsLabelAr') as string) || DEFAULT_QUICK_BRIEF_CONFIG.detailsLabelAr,
    detailsPlaceholder: (formData.get('detailsPlaceholder') as string) || DEFAULT_QUICK_BRIEF_CONFIG.detailsPlaceholder,
    detailsPlaceholderAr: (formData.get('detailsPlaceholderAr') as string) || DEFAULT_QUICK_BRIEF_CONFIG.detailsPlaceholderAr,
    connectLabel: (formData.get('connectLabel') as string) || DEFAULT_QUICK_BRIEF_CONFIG.connectLabel,
    connectLabelAr: (formData.get('connectLabelAr') as string) || DEFAULT_QUICK_BRIEF_CONFIG.connectLabelAr,
    summaryTitle: (formData.get('summaryTitle') as string) || DEFAULT_QUICK_BRIEF_CONFIG.summaryTitle,
    summaryTitleAr: (formData.get('summaryTitleAr') as string) || DEFAULT_QUICK_BRIEF_CONFIG.summaryTitleAr,
    projectTypes: parseQuickBriefOptionsText(formData.get('projectTypes'), true),
    budgets: parseQuickBriefOptionsText(formData.get('budgets'), false),
    timelines: parseQuickBriefOptionsText(formData.get('timelines'), true),
  });

  await db.insert(settings).values({
    key: QUICK_BRIEF_SETTINGS_KEY,
    value: data,
    updatedAt: new Date(),
  }).onConflictDoUpdate({
    target: settings.key,
    set: { value: data, updatedAt: new Date() },
  });

  revalidatePath('/');
  revalidatePath('/admin/contact');
  return { success: true };
}

export async function getMentorshipBriefConfig() {
  const [row] = await db
    .select({ value: settings.value })
    .from(settings)
    .where(eq(settings.key, MENTORSHIP_BRIEF_SETTINGS_KEY))
    .limit(1);

  return normalizeMentorshipBriefConfig(row?.value ?? DEFAULT_MENTORSHIP_BRIEF_CONFIG);
}

export async function updateMentorshipBriefConfig(formData: FormData) {
  const data = normalizeMentorshipBriefConfig({
    eyebrow: (formData.get('mentorshipEyebrow') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.eyebrow,
    eyebrowAr: (formData.get('mentorshipEyebrowAr') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.eyebrowAr,
    title: (formData.get('mentorshipTitle') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.title,
    titleAr: (formData.get('mentorshipTitleAr') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.titleAr,
    subtitle: (formData.get('mentorshipSubtitle') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.subtitle,
    subtitleAr: (formData.get('mentorshipSubtitleAr') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.subtitleAr,
    nameLabel: (formData.get('mentorshipNameLabel') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.nameLabel,
    nameLabelAr: (formData.get('mentorshipNameLabelAr') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.nameLabelAr,
    namePlaceholder: (formData.get('mentorshipNamePlaceholder') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.namePlaceholder,
    namePlaceholderAr: (formData.get('mentorshipNamePlaceholderAr') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.namePlaceholderAr,
    levelLabel: (formData.get('mentorshipLevelLabel') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.levelLabel,
    levelLabelAr: (formData.get('mentorshipLevelLabelAr') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.levelLabelAr,
    goalLabel: (formData.get('mentorshipGoalLabel') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.goalLabel,
    goalLabelAr: (formData.get('mentorshipGoalLabelAr') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.goalLabelAr,
    formatLabel: (formData.get('mentorshipFormatLabel') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.formatLabel,
    formatLabelAr: (formData.get('mentorshipFormatLabelAr') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.formatLabelAr,
    timelineLabel: (formData.get('mentorshipTimelineLabel') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.timelineLabel,
    timelineLabelAr: (formData.get('mentorshipTimelineLabelAr') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.timelineLabelAr,
    detailsLabel: (formData.get('mentorshipDetailsLabel') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.detailsLabel,
    detailsLabelAr: (formData.get('mentorshipDetailsLabelAr') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.detailsLabelAr,
    detailsPlaceholder: (formData.get('mentorshipDetailsPlaceholder') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.detailsPlaceholder,
    detailsPlaceholderAr: (formData.get('mentorshipDetailsPlaceholderAr') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.detailsPlaceholderAr,
    connectLabel: (formData.get('mentorshipConnectLabel') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.connectLabel,
    connectLabelAr: (formData.get('mentorshipConnectLabelAr') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.connectLabelAr,
    summaryTitle: (formData.get('mentorshipSummaryTitle') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.summaryTitle,
    summaryTitleAr: (formData.get('mentorshipSummaryTitleAr') as string) || DEFAULT_MENTORSHIP_BRIEF_CONFIG.summaryTitleAr,
    levels: parseQuickBriefOptionsText(formData.get('mentorshipLevels'), true),
    goals: parseQuickBriefOptionsText(formData.get('mentorshipGoals'), true),
    formats: parseQuickBriefOptionsText(formData.get('mentorshipFormats'), false),
    timelines: parseQuickBriefOptionsText(formData.get('mentorshipTimelines'), true),
  });

  await db.insert(settings).values({
    key: MENTORSHIP_BRIEF_SETTINGS_KEY,
    value: data,
    updatedAt: new Date(),
  }).onConflictDoUpdate({
    target: settings.key,
    set: { value: data, updatedAt: new Date() },
  });

  revalidatePath('/');
  revalidatePath('/admin/contact');
  return { success: true };
}

export async function getSocialLinks() {
  return db.select().from(socialLinks)
    .where(eq(socialLinks.active, true))
    .orderBy(asc(socialLinks.order));
}

export async function getAllSocialLinks() {
  return db.select().from(socialLinks).orderBy(asc(socialLinks.order));
}

export async function upsertSocialLink(formData: FormData) {
  const id = formData.get('id') as string | null;
  const data = {
    order: parseInt(formData.get('order') as string) || 0,
    platform: formData.get('platform') as string,
    url: formData.get('url') as string,
    label: (formData.get('label') as string) || null,
    icon: (formData.get('icon') as string) || null,
    active: formData.get('active') === 'true',
  };

  if (id) {
    await db.update(socialLinks).set(data).where(eq(socialLinks.id, id));
  } else {
    await db.insert(socialLinks).values(data);
  }

  revalidatePath('/');
  revalidatePath('/contact');
  revalidatePath('/admin/contact');
  return { success: true };
}

export async function deleteSocialLink(id: string) {
  await db.delete(socialLinks).where(eq(socialLinks.id, id));
  revalidatePath('/');
  revalidatePath('/contact');
  revalidatePath('/admin/contact');
  return { success: true };
}
