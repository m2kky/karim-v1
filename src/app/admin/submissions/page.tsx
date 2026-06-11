'use client';

import { useEffect, useState } from 'react';
import { Button, Card, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';
import toast from 'react-hot-toast';
import { deleteSubmission, getSubmissions, markAsRead } from './actions';

export default function SubmissionsAdminPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSubmissions = async () => {
    setIsLoading(true);
    setSubmissions((await getSubmissions()) || []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleMarkRead = async (id: string) => {
    const res = await markAsRead(id);
    if (res.success) {
      toast.success('Submission marked as read');
      loadSubmissions();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this submission?')) return;
    const res = await deleteSubmission(id);
    if (res.success) {
      toast.success('Submission deleted');
      loadSubmissions();
    }
  };

  if (isLoading) return <div className="">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-8">Contact Submissions</h1>

      <Card>
        <Card.Content className="p-0">
          {submissions.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No submissions yet.</div>
          ) : (
            <Table>
              <Table.Content aria-label="Contact submissions">
                <TableHeader>
                  <TableColumn>DATE</TableColumn>
                  <TableColumn>NAME</TableColumn>
                  <TableColumn>CONTACT</TableColumn>
                  <TableColumn>SOURCE</TableColumn>
                  <TableColumn>PROJECT</TableColumn>
                  <TableColumn>MESSAGE</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody items={submissions}>
                  {(item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <div>{item.email || '-'}</div>
                        <div className="text-xs text-gray-400">{item.phone || ''}</div>
                      </TableCell>
                      <TableCell>
                        <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-gray-300">
                          {item.source || 'contact-form'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>{item.projectType || '-'}</div>
                        <div className="text-xs text-gray-400">{[item.budget, item.timeline].filter(Boolean).join(' / ')}</div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[260px] whitespace-pre-wrap text-sm text-gray-300">{item.message || '-'}</div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${item.read ? 'bg-gray-500/20 text-gray-400' : 'bg-blue-500/20 text-blue-300'}`}>
                          {item.read ? 'Read' : 'Unread'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          {!item.read && <Button size="sm" variant="secondary" onPress={() => handleMarkRead(item.id)}>Mark Read</Button>}
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
    </div>
  );
}
