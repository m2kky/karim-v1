'use client';

import { useEffect, useState } from 'react';
import { createOverlayState } from '@/lib/overlay-state';
import { Button, Card, Input, Modal, Switch, Table, TextArea, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { getAllTestimonials, upsertTestimonial, deleteTestimonial } from './actions';
import toast from 'react-hot-toast';
import ImageUploadField from '@/components/admin/ImageUploadField';

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const modalState = createOverlayState(isOpen, setIsOpen);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const data = await getAllTestimonials();
    setTestimonials(data || []);
    setIsLoading(false);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    const res = await deleteTestimonial(id);
    if (res.success) {
      toast.success('Testimonial deleted');
      loadData();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (editingItem?.id) {
      formData.append('id', editingItem.id);
    }

    // Convert switch values manually if needed, but Switch passes "true" if selected
    // Note: FormData handles switches that are "on" by passing their value.
    // We handle it gracefully in the server action.

    const res = await upsertTestimonial(formData);

    if (!res || !res.success) {
      toast.error('Failed to save testimonial');
    } else {
      toast.success('Testimonial saved successfully');
      loadData();
      setIsOpen(false);
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Testimonials</h1>
        <Button onPress={handleAddNew} className="bg-blue-600">
          Add Testimonial
        </Button>
      </div>

      <Card>
        <Card.Content className="p-0">
          {!testimonials || testimonials.length === 0 ? (
            <div className="p-8 text-center text-gray-400 bg-black/20 rounded-lg border border-[rgba(255,255,255,0.05)] mt-4">
              No records found.
            </div>
          ) : (
            <Table>
              <Table.Content aria-label="Testimonials">
              <TableHeader>
                <TableColumn>ORDER</TableColumn>
                <TableColumn>CLIENT NAME</TableColumn>
                <TableColumn>RATING</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody items={testimonials}>
                {(item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.order}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-400">{item.role || 'No role'}</div>
                      </div>
                    </TableCell>
                    <TableCell>{item.rating} / 5</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${item.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {item.active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button size="sm" variant="secondary" onPress={() => handleEdit(item)}>Edit</Button>
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
            <form onSubmit={handleSubmit} className="space-y-8">
              <Modal.Header>{editingItem ? 'Edit Testimonial' : 'Add Testimonial'}</Modal.Header>
              <Modal.Body className="py-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Order</label>
                    <Input
                      name="order"
                      type="number"
                      defaultValue={editingItem?.order || 0}
                      required
                      variant="secondary"
                    />
                  </div>

                  <div className="flex flex-col gap-2 px-2 justify-center">
                    <Switch name="active" defaultSelected={editingItem?.active !== false} value="true">
                      Active
                    </Switch>
                    <Switch name="isFeatured" defaultSelected={editingItem?.isFeatured === true} value="true">
                      Featured
                    </Switch>
                    <Switch name="isVideo" defaultSelected={editingItem?.isVideo === true} value="true">
                      Is Video Testimonial
                    </Switch>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <Input
                      name="name"
                      defaultValue={editingItem?.name}
                      required
                      variant="secondary"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Role / Company</label>
                    <Input
                      name="role"
                      defaultValue={editingItem?.role}
                      variant="secondary"
                    />
                  </div>

                  <ImageUploadField
                    name="avatar"
                    label="Avatar"
                    defaultValue={editingItem?.avatar}
                    className="mb-4"
                  />

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Rating (1-5)</label>
                    <Input
                      name="rating"
                      type="number"
                      min={1}
                      max={5}
                      defaultValue={editingItem?.rating || 5}
                      variant="secondary"
                    />
                  </div>

                  <div className="mb-4 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Testimonial Text (English)</label>
                    <TextArea
                      name="text"
                      defaultValue={editingItem?.text}
                      required
                      rows={3}
                      variant="secondary"
                    />
                  </div>

                  <div className="mb-4 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Testimonial Text (Arabic)</label>
                    <TextArea
                      name="textAr"
                      defaultValue={editingItem?.textAr}
                      rows={3}
                      dir="rtl"
                      variant="secondary"
                    />
                  </div>

                  <div className="mb-4 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Video URL (if applicable)</label>
                    <Input
                      name="videoUrl"
                      defaultValue={editingItem?.videoUrl}
                      variant="secondary"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="mb-4 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Video Thumbnail</label>
                    <ImageUploadField
                      name="videoThumbnail"
                      label="Video Thumbnail"
                      defaultValue={editingItem?.videoThumbnail}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Grid Row Size</label>
                    <Input
                      name="row"
                      type="number"
                      defaultValue={editingItem?.row || 1}
                      variant="secondary"
                    />
                  </div>

                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="ghost" onPress={onClose}>Cancel</Button>
                <Button type="submit" className="bg-blue-600">Save</Button>
              </Modal.Footer>
            </form>
          )}
        </Modal.Dialog>
      </Modal>
    </div>
  );
}
