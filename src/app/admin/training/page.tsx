'use client';

import { useEffect, useState } from 'react';
import { createOverlayState } from '@/lib/overlay-state';
import { Button, Card, Input, Modal, Table, TextArea, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
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

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Training Page Content</h1>
      </div>

      {/* TRAINING INFO FORM */}
      <Card className="mb-12">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">General Information</h2>
          <form onSubmit={handleSaveInfo} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title (English)</label>
                <Input
                  name="title"
                  defaultValue={info?.title || ''}
                  variant="secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title (Arabic)</label>
                <Input
                  name="titleAr"
                  defaultValue={info?.titleAr || ''}
                  dir="rtl"
                  variant="secondary"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Description (English)</label>
                <TextArea
                  name="description"
                  defaultValue={info?.description || ''}
                  rows={3}
                  variant="secondary"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Description (Arabic)</label>
                <TextArea
                  name="descriptionAr"
                  defaultValue={info?.descriptionAr || ''}
                  rows={3}
                  dir="rtl"
                  variant="secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Features/Points (English, one per line)</label>
                <TextArea
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  rows={5}
                  variant="secondary"
                  placeholder="Point 1\nPoint 2\n..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Features/Points (Arabic, one per line)</label>
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

            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600">Save General Info</Button>
            </div>
          </form>
        </div>
      </Card>

      <hr className="my-8 border-[rgba(255,255,255,0.1)]" />

      {/* TRAINING STATS */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Training Stats</h2>
        <Button onPress={handleAddNewStat} variant="secondary">
          Add New Stat
        </Button>
      </div>

      <Card>
        <div className="p-0">
          {!stats || stats.length === 0 ? (
            <div className="p-8 text-center text-gray-400 bg-black/20 rounded-lg border border-[rgba(255,255,255,0.05)] mt-4">
              No stats found.
            </div>
          ) : (
            <Table>
              <Table.Content aria-label="Training Stats">
              <TableHeader>
                <TableColumn>ORDER</TableColumn>
                <TableColumn>NUMBER / METRIC</TableColumn>
                <TableColumn>LABEL</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody items={stats}>
                {(item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.order}</TableCell>
                    <TableCell className="font-medium text-xl text-blue-400">{item.number}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{item.label}</span>
                        <span className="text-xs text-gray-500">{item.labelAr}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button size="sm" variant="secondary" onPress={() => handleEditStat(item)}>Edit</Button>
                        <Button size="sm" variant="secondary" onPress={() => handleDeleteStat(item.id)}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              </Table.Content>
            </Table>
          )}
        </div>
      </Card>

      {/* STAT MODAL */}
      <Modal state={modalState}>
        <Modal.Dialog>
          {({ close: onClose }: any) => (
            <form onSubmit={handleSaveStat}>
              <Modal.Header>{editingStat ? 'Edit Stat' : 'Add New Stat'}</Modal.Header>
              <Modal.Body className="py-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Order</label>
                    <Input
                      name="order"
                      type="number"
                      defaultValue={editingStat?.order || 0}
                      required
                      variant="secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Number / Value</label>
                    <Input
                      name="number"
                      defaultValue={editingStat?.number}
                      required
                      variant="secondary"
                      placeholder="e.g. 50+, 100K"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Label (English)</label>
                    <Input
                      name="label"
                      defaultValue={editingStat?.label}
                      required
                      variant="secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Label (Arabic)</label>
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
                <Button type="submit" className="bg-blue-600">Save Stat</Button>
              </Modal.Footer>
            </form>
          )}
        </Modal.Dialog>
      </Modal>
    </div>
  );
}
