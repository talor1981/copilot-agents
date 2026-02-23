'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bell, List } from 'lucide-react';
import { useAlerts } from '@/lib/features/alerts/hooks';

export function Alerts() {
  const { alerts, addAlert } = useAlerts();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCancel = useCallback(() => {
    setTitle('');
    setDescription('');
    setIsCreateOpen(false);
  }, []);

  const handleOk = useCallback(() => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    
    if (trimmedTitle && trimmedDescription) {
      addAlert(trimmedTitle, trimmedDescription);
      handleCancel();
    }
  }, [title, description, addAlert, handleCancel]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-4">
      {/* Alert Me Button */}
      <Button
        size="lg"
        variant="outline"
        className="text-lg px-8"
        onClick={() => setIsCreateOpen(true)}
      >
        <Bell className="mr-2 h-5 w-5" />
        Alert Me
      </Button>

      {/* Alert List Button */}
      <Button
        size="lg"
        variant="outline"
        className="text-lg px-8"
        onClick={() => setIsListOpen(true)}
      >
        <List className="mr-2 h-5 w-5" />
        Alert List
      </Button>

      {/* Create Alert Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Alert</DialogTitle>
            <DialogDescription>
              Add a new alert with a title and description.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter alert title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter alert description"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleOk} 
              disabled={!title.trim() || !description.trim()}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert List Modal */}
      <Dialog open={isListOpen} onOpenChange={setIsListOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Alert List</DialogTitle>
            <DialogDescription>
              View all your created alerts.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[400px] overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No alerts yet. Create your first alert!
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">
                        {alert.title}
                      </TableCell>
                      <TableCell>{alert.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsListOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
