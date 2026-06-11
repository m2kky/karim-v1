'use client';

import { useEffect, useState } from 'react';
import { createOverlayState } from '@/lib/overlay-state';
import { Button, Card, Input, Modal, TextArea } from "@heroui/react";
import { getTrainingInfo, getTrainingStats, updateTrainingInfo, upsertTrainingStat, deleteTrainingStat } from './actions';
import toast from 'react-hot-toast';

export default function TrainingAdminPage() {
  const [info, setInfo] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Points Arrays
  const [points, setPoints] = useState<string>('');
  const [pointsAr, setPointsAr] = useState<string>('');

  // Stats Modal
  const [editingStat, setEditingStat] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalState = createOverlayState(isModalOpen, setIsModalOpen);

  const normalizeLines = (value: unknown) => {
    if (Array.isArray(value)) return value.map(String).join('\n');
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.map(String).join('\n');
      } catch {}
      return value;
    }
    return '';
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [infoData, statsData] = await Promise.all([
        getTrainingInfo(),
        getTrainingStats(),
      ]);

      setInfo(infoData || {});
      setStats(Array.isArray(statsData) ? statsData : []);
      setPoints(normalizeLines(infoData?.points));
      setPointsAr(normalizeLines(infoData?.pointsAr));
    } catch (error) {
      console.error('Failed to load training page data', error);
      toast.error('Failed to load training page data');
      setInfo({});
      setStats([]);
      setPoints('');
      setPointsAr('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Process points into JSON array
    const ptsArray = points.split('\n').map(s => s.trim()).filter(Boolean);
    const ptsArArray = pointsAr.split('\n').map(s => s.trim()).filter(Boolean);

    formData.set('points', JSON.stringify(ptsArray));
    formData.set('pointsAr', JSON.stringify(ptsArArray));

    const res = await updateTrainingInfo(formData);
    if (res.success) {
      toast.success('Training info saved successfully');
      loadData();
    } else {
      toast.error('Failed to save training info');
    }
  };

  const handleEditStat = (stat: any) => {
    setEditingStat(stat);
    setIsModalOpen(true);
  };

  const handleAddNewStat = () => {
    setEditingStat(null);
    setIsModalOpen(true);
  };

  const handleDeleteStat = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stat?')) return;
    const res = await deleteTrainingStat(id);
    if (res.success) {
      toast.success('Stat deleted');
      loadData();
    }
  };

  const handleSaveStat = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (editingStat?.id) {
      formData.append('id', editingStat.id);
    }

    const res = await upsertTrainingStat(formData);

    if (!res || !res.success) {
      toast.error('Failed to save stat');
    } else {
      toast.success('Stat saved successfully');
      setIsModalOpen(false);
      loadData();
    }
  };

  if (isLoading) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <div className="admin-eyebrow">Content</div>
            <h1 className="admin-title">Training Page Content</h1>
            <p className="admin-subtitle">Loading training settings and statistics.</p>
          </div>
        </div>
        <Card className="admin-panel">
          <div className="admin-empty">Loading...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <div className="admin-eyebrow">Content</div>
          <h1 className="admin-title">Training Page Content</h1>
          <p className="admin-subtitle">
            Manage the public mentorship page copy, Arabic translations, feature bullets, and top-line training stats.
          </p>
        </div>
      </div>

      {/* TRAINING INFO FORM */}
      <Card className="admin-panel">
        <Card.Header className="admin-panel-header">
          <div>
            <h2 className="admin-section-title">General Information</h2>
            <p className="admin-subtitle">This content feeds the public training page in both languages.</p>
          </div>
        </Card.Header>
        <Card.Content className="admin-panel-body">
          <form onSubmit={handleSaveInfo} className="space-y-6">
            <div className="admin-form-grid">
              <div className="admin-field">
                <label>Title (English)</label>
                <Input
                  name="title"
                  defaultValue={info?.title || ''}
                  variant="secondary"
                />
              </div>
              <div className="admin-field">
                <label>Title (Arabic)</label>
                <Input
                  name="titleAr"
                  defaultValue={info?.titleAr || ''}
                  dir="rtl"
                  variant="secondary"
                />
              </div>

              <div className="admin-field admin-field-wide">
                <label>Description (English)</label>
                <TextArea
                  name="description"
                  defaultValue={info?.description || ''}
                  rows={3}
                  variant="secondary"
                />
              </div>

              <div className="admin-field admin-field-wide">
                <label>Description (Arabic)</label>
                <TextArea
                  name="descriptionAr"
                  defaultValue={info?.descriptionAr || ''}
                  rows={3}
                  dir="rtl"
                  variant="secondary"
                />
              </div>

              <div className="admin-field">
                <label>Features/Points (English, one per line)</label>
                <TextArea
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  rows={5}
                  variant="secondary"
                  placeholder="Point 1\nPoint 2\n..."
                />
              </div>
              <div className="admin-field">
                <label>Features/Points (Arabic, one per line)</label>
                <TextArea
                  value={pointsAr}
                  onChange={(e) => setPointsAr(e.target.value)}
                  rows={5}
                  dir="rtl"
                  variant="secondary"
                  placeholder="نقطة ١\nنقطة ٢\n..."
                />
              </div>
            </div>

            <div className="admin-actions">
              <Button type="submit" className="admin-button-primary">Save General Info</Button>
            </div>
          </form>
        </Card.Content>
      </Card>

      {/* TRAINING STATS */}
      <Card className="admin-panel">
        <Card.Header className="admin-panel-header">
          <div>
            <h2 className="admin-section-title">Training Stats</h2>
            <p className="admin-subtitle">Numbers shown in the training section.</p>
          </div>
          <Button onPress={handleAddNewStat} variant="secondary" className="admin-button-secondary">
            Add New Stat
          </Button>
        </Card.Header>
        <Card.Content className="admin-panel-body">
          {!stats || stats.length === 0 ? (
            <div className="admin-empty">
              No stats found.
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Number / Metric</th>
                    <th>Label</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((item: any) => (
                    <tr key={item.id}>
                      <td>{item.order}</td>
                      <td className="admin-stat-value">{item.number}</td>
                      <td>
                        <div className="flex flex-col gap-1">
                          <span>{item.label}</span>
                          <span className="admin-muted text-xs" dir="rtl">{item.labelAr}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="secondary" className="admin-button-secondary" onPress={() => handleEditStat(item)}>Edit</Button>
                          <Button size="sm" variant="secondary" className="admin-button-secondary" onPress={() => handleDeleteStat(item.id)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* STAT MODAL */}
      <Modal state={modalState}>
        <Modal.Dialog>
          {({ close: onClose }: any) => (
            <form onSubmit={handleSaveStat}>
              <Modal.Header>{editingStat ? 'Edit Stat' : 'Add New Stat'}</Modal.Header>
              <Modal.Body className="py-6">
                <div className="space-y-4">
                  <div className="admin-field">
                    <label>Order</label>
                    <Input
                      name="order"
                      type="number"
                      defaultValue={editingStat?.order || 0}
                      required
                      variant="secondary"
                    />
                  </div>

                  <div className="admin-field">
                    <label>Number / Value</label>
                    <Input
                      name="number"
                      defaultValue={editingStat?.number}
                      required
                      variant="secondary"
                      placeholder="e.g. 50+, 100K"
                    />
                  </div>

                  <div className="admin-field">
                    <label>Label (English)</label>
                    <Input
                      name="label"
                      defaultValue={editingStat?.label}
                      required
                      variant="secondary"
                    />
                  </div>

                  <div className="admin-field">
                    <label>Label (Arabic)</label>
                    <Input
                      name="labelAr"
                      defaultValue={editingStat?.labelAr}
                      dir="rtl"
                      variant="secondary"
                    />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="ghost" onPress={onClose}>Cancel</Button>
                <Button type="submit" className="admin-button-primary">Save Stat</Button>
              </Modal.Footer>
            </form>
          )}
        </Modal.Dialog>
      </Modal>
    </div>
  );
}
