'use client';

import { useState, useEffect } from 'react';
import { createLinkAction, updateLinkAction } from './actions';
import { useDispatch } from 'react-redux';
import { dashboardApi, UserLink } from './dashboardApi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface CreateLinkDialogProps {
  editMode?: boolean;
  editData?: UserLink;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateLinkDialog({ 
  editMode = false, 
  editData, 
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange 
}: CreateLinkDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setError(null);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    // Client-side validation
    const shortCode = formData.get('shortCode') as string;
    const originalUrl = formData.get('originalUrl') as string;
    
    // Validate short code format
    if (!/^[a-zA-Z0-9_-]+$/.test(shortCode)) {
      setError('Short code can only contain letters, numbers, hyphens, and underscores');
      setIsLoading(false);
      return;
    }
    
    // Validate URL format
    try {
      const url = new URL(originalUrl);
      if (!url.protocol.startsWith('http')) {
        setError('URL must start with http:// or https://');
        setIsLoading(false);
        return;
      }
    } catch {
      setError('Please enter a valid URL');
      setIsLoading(false);
      return;
    }

    if (editMode && editData) {
      // Update existing link
      const input = {
        linkId: editData.id,
        shortCode,
        originalUrl,
      };

      const result = await updateLinkAction(input);

      if (result.success) {
        dispatch(dashboardApi.util.invalidateTags(['UserLinks']));
        setOpen(false);
      } else {
        setError(result.error || 'Failed to update link');
      }
    } else {
      // Create new link
      const input = {
        shortCode,
        originalUrl,
      };

      const result = await createLinkAction(input);

      if (result.success) {
        dispatch(dashboardApi.util.invalidateTags(['UserLinks']));
        setOpen(false);
        (e.target as HTMLFormElement).reset();
      } else {
        setError(result.error || 'Failed to create link');
      }
    }

    setIsLoading(false);
  }

  const defaultTrigger = (
    <Button size="lg">
      <Plus className="w-4 h-4 mr-2" />
      Create Link
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Link' : 'Create Short Link'}</DialogTitle>
            <DialogDescription>
              {editMode 
                ? 'Update your shortened link details.' 
                : 'Create a new shortened link. Enter the original URL and choose a custom short code.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="originalUrl">
                Original URL
              </Label>
              <Input
                id="originalUrl"
                name="originalUrl"
                type="url"
                placeholder="https://example.com/very-long-url"
                defaultValue={editData?.originalUrl || ''}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="shortCode">
                Short Code
              </Label>
              <Input
                id="shortCode"
                name="shortCode"
                type="text"
                placeholder="my-link"
                pattern="[a-zA-Z0-9_-]+"
                minLength={3}
                maxLength={10}
                defaultValue={editData?.shortCode || ''}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                3-10 characters. Letters, numbers, hyphens, and underscores only.
              </p>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading 
                ? (editMode ? 'Updating...' : 'Creating...') 
                : (editMode ? 'Update Link' : 'Create Link')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
