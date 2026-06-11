'use client';

import { useEffect, useState } from 'react';
import { createOverlayState } from '@/lib/overlay-state';
import { Button, Card, Input, Modal, Switch, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, TextArea } from '@heroui/react';
import toast from 'react-hot-toast';
import { quickBriefOptionsToText, type MentorshipBriefConfig, type QuickBriefConfig } from '@/lib/quick-brief';
import { deleteSocialLink, getAllSocialLinks, getContactInfo, getMentorshipBriefConfig, getQuickBriefConfig, updateContactInfo, updateMentorshipBriefConfig, updateQuickBriefConfig, upsertSocialLink } from './actions';

export default function ContactAdminPage() {
  const [contact, setContact] = useState<any>({});
  const [quickBrief, setQuickBrief] = useState<QuickBriefConfig | null>(null);
  const [mentorshipBrief, setMentorshipBrief] = useState<MentorshipBriefConfig | null>(null);
  const [socials, setSocials] = useState<any[]>([]);
  const [editingSocial, setEditingSocial] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const modalState = createOverlayState(isOpen, setIsOpen);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const [contactData, socialData, quickBriefData, mentorshipBriefData] = await Promise.all([
      getContactInfo(),
      getAllSocialLinks(),
      getQuickBriefConfig(),
      getMentorshipBriefConfig(),
    ]);
    setContact(contactData || {});
    setSocials(socialData || []);
    setQuickBrief(quickBriefData);
    setMentorshipBrief(mentorshipBriefData);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await updateContactInfo(new FormData(e.currentTarget));
    if (res.success) {
      toast.success('Contact info saved');
      loadData();
    } else {
      toast.error('Failed to save contact info');
    }
  };

  const handleSocialSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (editingSocial?.id) formData.append('id', editingSocial.id);
    const res = await upsertSocialLink(formData);
    if (res.success) {
      toast.success('Social link saved');
      setIsOpen(false);
      loadData();
    } else {
      toast.error('Failed to save social link');
    }
  };

  const handleQuickBriefSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await updateQuickBriefConfig(new FormData(e.currentTarget));
    if (res.success) {
      toast.success('Quick Brief settings saved');
      loadData();
    } else {
      toast.error('Failed to save Quick Brief settings');
    }
  };

  const handleMentorshipBriefSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await updateMentorshipBriefConfig(new FormData(e.currentTarget));
    if (res.success) {
      toast.success('Mentorship Brief settings saved');
      loadData();
    } else {
      toast.error('Failed to save Mentorship Brief settings');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this social link?')) return;
    const res = await deleteSocialLink(id);
    if (res.success) {
      toast.success('Social link deleted');
      loadData();
    }
  };

  if (isLoading) return <div className="">Loading...</div>;

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Contact Info</h1>

      <form onSubmit={handleContactSubmit}>
        <Card>
          <Card.Header className="border-b border-white/5 bg-[#050505]/50 px-6 py-4">
            <h2 className="text-xl font-semibold">Public Contact Details</h2>
          </Card.Header>
          <Card.Content className="p-6 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">WhatsApp</label>
                <Input name="whatsapp" defaultValue={contact?.whatsapp || ''} variant="secondary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <Input name="email" type="email" defaultValue={contact?.email || ''} variant="secondary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                <Input name="phone" defaultValue={contact?.phone || ''} variant="secondary" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Contact Tagline (English)</label>
                <TextArea name="tagline" defaultValue={contact?.tagline || ''} rows={3} variant="secondary" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Contact Tagline (Arabic)</label>
                <TextArea name="taglineAr" defaultValue={contact?.taglineAr || ''} rows={3} dir="rtl" variant="secondary" />
              </div>
            </div>
          </Card.Content>
        </Card>
        <div className="flex justify-end mb-10">
          <Button type="submit" className="bg-blue-600 px-8">Save Contact Info</Button>
        </div>
      </form>

      {quickBrief && (
        <form onSubmit={handleQuickBriefSubmit} className="mb-10" key={JSON.stringify(quickBrief)}>
          <Card>
            <Card.Header className="border-b border-white/5 bg-[#050505]/50 px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold">Quick Brief Modal</h2>
                <p className="text-sm text-gray-400 mt-1">Control modal copy, field labels, placeholders, and option lists.</p>
              </div>
            </Card.Header>
            <Card.Content className="p-6 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Eyebrow" name="eyebrow" value={quickBrief.eyebrow} />
                <Field label="Eyebrow Arabic" name="eyebrowAr" value={quickBrief.eyebrowAr} rtl />
                <Field label="Title" name="title" value={quickBrief.title} />
                <Field label="Title Arabic" name="titleAr" value={quickBrief.titleAr} rtl />
                <TextField label="Subtitle" name="subtitle" value={quickBrief.subtitle} />
                <TextField label="Subtitle Arabic" name="subtitleAr" value={quickBrief.subtitleAr} rtl />
                <Field label="Name label" name="nameLabel" value={quickBrief.nameLabel} />
                <Field label="Name label Arabic" name="nameLabelAr" value={quickBrief.nameLabelAr} rtl />
                <Field label="Name placeholder" name="namePlaceholder" value={quickBrief.namePlaceholder} />
                <Field label="Name placeholder Arabic" name="namePlaceholderAr" value={quickBrief.namePlaceholderAr} rtl />
                <Field label="Project type label" name="projectTypeLabel" value={quickBrief.projectTypeLabel} />
                <Field label="Project type label Arabic" name="projectTypeLabelAr" value={quickBrief.projectTypeLabelAr} rtl />
                <Field label="Budget label" name="budgetLabel" value={quickBrief.budgetLabel} />
                <Field label="Budget label Arabic" name="budgetLabelAr" value={quickBrief.budgetLabelAr} rtl />
                <TextField label="Budget helper" name="budgetHelper" value={quickBrief.budgetHelper} />
                <TextField label="Budget helper Arabic" name="budgetHelperAr" value={quickBrief.budgetHelperAr} rtl />
                <Field label="Timeline label" name="timelineLabel" value={quickBrief.timelineLabel} />
                <Field label="Timeline label Arabic" name="timelineLabelAr" value={quickBrief.timelineLabelAr} rtl />
                <Field label="Details label" name="detailsLabel" value={quickBrief.detailsLabel} />
                <Field label="Details label Arabic" name="detailsLabelAr" value={quickBrief.detailsLabelAr} rtl />
                <Field label="Details placeholder" name="detailsPlaceholder" value={quickBrief.detailsPlaceholder} />
                <Field label="Details placeholder Arabic" name="detailsPlaceholderAr" value={quickBrief.detailsPlaceholderAr} rtl />
                <Field label="Connect label" name="connectLabel" value={quickBrief.connectLabel} />
                <Field label="Connect label Arabic" name="connectLabelAr" value={quickBrief.connectLabelAr} rtl />
                <Field label="Summary title" name="summaryTitle" value={quickBrief.summaryTitle} />
                <Field label="Summary title Arabic" name="summaryTitleAr" value={quickBrief.summaryTitleAr} rtl />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <OptionsField
                  label="Project type options"
                  name="projectTypes"
                  value={quickBriefOptionsToText(quickBrief.projectTypes, true)}
                  hint="Format: Label | Arabic label | Value | Icon"
                />
                <OptionsField
                  label="Budget options"
                  name="budgets"
                  value={quickBriefOptionsToText(quickBrief.budgets, false)}
                  hint="Format: Label | Arabic label | Value"
                />
                <OptionsField
                  label="Timeline options"
                  name="timelines"
                  value={quickBriefOptionsToText(quickBrief.timelines, true)}
                  hint="Format: Label | Arabic label | Value | Icon"
                />
              </div>
            </Card.Content>
          </Card>
          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 px-8">Save Quick Brief</Button>
          </div>
        </form>
      )}

      {mentorshipBrief && (
        <form onSubmit={handleMentorshipBriefSubmit} className="mb-10" key={JSON.stringify(mentorshipBrief)}>
          <Card>
            <Card.Header className="border-b border-white/5 bg-[#050505]/50 px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold">Mentorship Brief Modal</h2>
                <p className="text-sm text-gray-400 mt-1">Control mentorship-specific questions, labels, placeholders, and answer choices.</p>
              </div>
            </Card.Header>
            <Card.Content className="p-6 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Eyebrow" name="mentorshipEyebrow" value={mentorshipBrief.eyebrow} />
                <Field label="Eyebrow Arabic" name="mentorshipEyebrowAr" value={mentorshipBrief.eyebrowAr} rtl />
                <Field label="Title" name="mentorshipTitle" value={mentorshipBrief.title} />
                <Field label="Title Arabic" name="mentorshipTitleAr" value={mentorshipBrief.titleAr} rtl />
                <TextField label="Subtitle" name="mentorshipSubtitle" value={mentorshipBrief.subtitle} />
                <TextField label="Subtitle Arabic" name="mentorshipSubtitleAr" value={mentorshipBrief.subtitleAr} rtl />
                <Field label="Name label" name="mentorshipNameLabel" value={mentorshipBrief.nameLabel} />
                <Field label="Name label Arabic" name="mentorshipNameLabelAr" value={mentorshipBrief.nameLabelAr} rtl />
                <Field label="Name placeholder" name="mentorshipNamePlaceholder" value={mentorshipBrief.namePlaceholder} />
                <Field label="Name placeholder Arabic" name="mentorshipNamePlaceholderAr" value={mentorshipBrief.namePlaceholderAr} rtl />
                <Field label="Level label" name="mentorshipLevelLabel" value={mentorshipBrief.levelLabel} />
                <Field label="Level label Arabic" name="mentorshipLevelLabelAr" value={mentorshipBrief.levelLabelAr} rtl />
                <Field label="Goal label" name="mentorshipGoalLabel" value={mentorshipBrief.goalLabel} />
                <Field label="Goal label Arabic" name="mentorshipGoalLabelAr" value={mentorshipBrief.goalLabelAr} rtl />
                <Field label="Format label" name="mentorshipFormatLabel" value={mentorshipBrief.formatLabel} />
                <Field label="Format label Arabic" name="mentorshipFormatLabelAr" value={mentorshipBrief.formatLabelAr} rtl />
                <Field label="Timeline label" name="mentorshipTimelineLabel" value={mentorshipBrief.timelineLabel} />
                <Field label="Timeline label Arabic" name="mentorshipTimelineLabelAr" value={mentorshipBrief.timelineLabelAr} rtl />
                <Field label="Details label" name="mentorshipDetailsLabel" value={mentorshipBrief.detailsLabel} />
                <Field label="Details label Arabic" name="mentorshipDetailsLabelAr" value={mentorshipBrief.detailsLabelAr} rtl />
                <Field label="Details placeholder" name="mentorshipDetailsPlaceholder" value={mentorshipBrief.detailsPlaceholder} />
                <Field label="Details placeholder Arabic" name="mentorshipDetailsPlaceholderAr" value={mentorshipBrief.detailsPlaceholderAr} rtl />
                <Field label="Connect label" name="mentorshipConnectLabel" value={mentorshipBrief.connectLabel} />
                <Field label="Connect label Arabic" name="mentorshipConnectLabelAr" value={mentorshipBrief.connectLabelAr} rtl />
                <Field label="Summary title" name="mentorshipSummaryTitle" value={mentorshipBrief.summaryTitle} />
                <Field label="Summary title Arabic" name="mentorshipSummaryTitleAr" value={mentorshipBrief.summaryTitleAr} rtl />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <OptionsField
                  label="Level options"
                  name="mentorshipLevels"
                  value={quickBriefOptionsToText(mentorshipBrief.levels, true)}
                  hint="Format: Label | Arabic label | Value | Icon"
                />
                <OptionsField
                  label="Goal options"
                  name="mentorshipGoals"
                  value={quickBriefOptionsToText(mentorshipBrief.goals, true)}
                  hint="Format: Label | Arabic label | Value | Icon"
                />
                <OptionsField
                  label="Format options"
                  name="mentorshipFormats"
                  value={quickBriefOptionsToText(mentorshipBrief.formats, false)}
                  hint="Format: Label | Arabic label | Value"
                />
                <OptionsField
                  label="Timeline options"
                  name="mentorshipTimelines"
                  value={quickBriefOptionsToText(mentorshipBrief.timelines, true)}
                  hint="Format: Label | Arabic label | Value | Icon"
                />
              </div>
            </Card.Content>
          </Card>
          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 px-8">Save Mentorship Brief</Button>
          </div>
        </form>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Social Links</h2>
        <Button onPress={() => { setEditingSocial(null); setIsOpen(true); }} className="bg-blue-600">
          Add Social Link
        </Button>
      </div>

      <Card>
        <Card.Content className="p-0">
          {socials.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No social links yet.</div>
          ) : (
            <Table>
              <Table.Content aria-label="Social links">
                <TableHeader>
                  <TableColumn>ORDER</TableColumn>
                  <TableColumn>PLATFORM</TableColumn>
                  <TableColumn>LABEL</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={socials}>
                  {(item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.order}</TableCell>
                      <TableCell className="font-medium">{item.platform}</TableCell>
                      <TableCell>{item.label || item.url}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${item.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {item.active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button size="sm" variant="secondary" onPress={() => { setEditingSocial(item); setIsOpen(true); }}>Edit</Button>
                          <Button size="sm" variant="secondary" onPress={() => handleDelete(item.id)}>Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table.Content>
            </Table>
          )}
        </Card.Content>
      </Card>

      <Modal state={modalState}>
        <Modal.Dialog>
          {({ close: onClose }: any) => (
            <form onSubmit={handleSocialSubmit}>
              <Modal.Header>{editingSocial ? 'Edit Social Link' : 'Add Social Link'}</Modal.Header>
              <Modal.Body className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Order</label>
                    <Input name="order" type="number" defaultValue={editingSocial?.order || 0} required variant="secondary" />
                  </div>
                  <div className="flex items-center px-2">
                    <Switch name="active" defaultSelected={editingSocial?.active !== false} value="true">Active</Switch>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Platform</label>
                    <Input name="platform" defaultValue={editingSocial?.platform || ''} required variant="secondary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Label</label>
                    <Input name="label" defaultValue={editingSocial?.label || ''} variant="secondary" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">URL</label>
                    <Input name="url" defaultValue={editingSocial?.url || ''} required variant="secondary" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Icon Class</label>
                    <Input name="icon" defaultValue={editingSocial?.icon || ''} placeholder="fa-brands fa-instagram" variant="secondary" />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="ghost" onPress={onClose}>Cancel</Button>
                <Button type="submit" className="bg-blue-600">Save Social Link</Button>
              </Modal.Footer>
            </form>
          )}
        </Modal.Dialog>
      </Modal>
    </div>
  );
}

function Field({ label, name, value, rtl = false }: { label: string; name: string; value: string; rtl?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <Input name={name} defaultValue={value || ''} dir={rtl ? 'rtl' : 'ltr'} variant="secondary" />
    </div>
  );
}

function TextField({ label, name, value, rtl = false }: { label: string; name: string; value: string; rtl?: boolean }) {
  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <TextArea name={name} defaultValue={value || ''} rows={3} dir={rtl ? 'rtl' : 'ltr'} variant="secondary" />
    </div>
  );
}

function OptionsField({ label, name, value, hint }: { label: string; name: string; value: string; hint: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <TextArea name={name} defaultValue={value} rows={8} variant="secondary" />
      <p className="text-xs text-gray-500 mt-2">{hint}</p>
    </div>
  );
}
