'use server';

import { db } from '@/db';
import { trainingInfo, trainingStats, testimonials } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { asc } from '@/lib/db-order';
import { revalidatePath } from 'next/cache';

function parsePoints(value: FormDataEntryValue | null) {
  if (typeof value !== 'string' || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
  } catch {
    return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  }
}

export async function getTrainingInfo() {
  const [data] = await db.select().from(trainingInfo).limit(1);
  return data ?? null;
}

export async function getTrainingStats() {
  return db.select().from(trainingStats).orderBy(asc(trainingStats.order));
}

export async function getStudentReviews() {
  return db.select().from(testimonials)
    .where(and(eq(testimonials.active, true), eq(testimonials.row, 2)))
    .orderBy(asc(testimonials.order));
}

export async function updateTrainingInfo(formData: FormData) {
  const data = {
    title: (formData.get('title') as string) || null,
    titleAr: (formData.get('titleAr') as string) || null,
    description: (formData.get('description') as string) || null,
    descriptionAr: (formData.get('descriptionAr') as string) || null,
    points: parsePoints(formData.get('points')),
    pointsAr: parsePoints(formData.get('pointsAr')),
    updatedAt: new Date(),
  };

  await db.insert(trainingInfo).values({ id: 'main', ...data })
    .onConflictDoUpdate({ target: trainingInfo.id, set: data });

  revalidatePath('/');
  revalidatePath('/training');
  revalidatePath('/admin/training');
  return { success: true };
}

export async function upsertTrainingStat(formData: FormData) {
  const id = formData.get('id') as string | null;
  const data = {
    order: parseInt(formData.get('order') as string) || 0,
    number: formData.get('number') as string,
    label: formData.get('label') as string,
    labelAr: (formData.get('labelAr') as string) || null,
  };

  if (id) {
    await db.update(trainingStats).set(data).where(eq(trainingStats.id, id));
  } else {
    await db.insert(trainingStats).values(data);
  }

  revalidatePath('/');
  revalidatePath('/training');
  revalidatePath('/admin/training');
  return { success: true };
}

export async function deleteTrainingStat(id: string) {
  await db.delete(trainingStats).where(eq(trainingStats.id, id));
  revalidatePath('/');
  revalidatePath('/training');
  revalidatePath('/admin/training');
  return { success: true };
}
