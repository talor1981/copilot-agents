'use client';

import { useState } from 'react';
import { createLinkAction } from './actions';
import { useDispatch } from 'react-redux';
import { dashboardApi } from './dashboardApi';
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

export function CreateLinkDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Extract and type data explicitly
    const input = {
      shortCode: formData.get('shortCode') as string,
      originalUrl: formData.get('originalUrl') as string,
    };

    const result = await createLinkAction(input);

    if (result.success) {
      // Invalidate RTK Query cache to refetch user's links
      dispatch(dashboardApi.util.invalidateTags(['UserLinks']));
      
      // Close dialog and reset form
      setOpen(false);
      (e.target as HTMLFormElement).reset();
    } else {
      // Show error
      setError(result.error || 'Failed to create link');
    }

    setIsLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Create Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Short Link</DialogTitle>
            <DialogDescription>
              Create a new shortened link. Enter the original URL and choose a custom short code.
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
              {isLoading ? 'Creating...' : 'Create Link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
