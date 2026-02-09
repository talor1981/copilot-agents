---
description: Read this file before you start working on any UI-related features. It contains critical rules and patterns for using shadcn/ui components in this project.
---
# UI Components Rules

## ⚠️ CRITICAL: shadcn/ui Components Only

**ALL UI elements in this application MUST use shadcn/ui components.**

- ❌ NO custom component creation for standard UI elements
- ❌ NO raw HTML form elements (input, button, select, etc.)
- ❌ NO custom styling on standard elements
- ✅ ALWAYS use shadcn/ui components
- ✅ ONLY create custom components for business logic/features

## Installing shadcn/ui Components

Before using any component, install it first:

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add select
npx shadcn@latest add label
npx shadcn@latest add textarea
npx shadcn@latest add toast
```

All components will be added to `components/ui/`.

## Component Usage Examples

### Buttons

❌ **WRONG** - Custom button
```typescript
<button className="px-4 py-2 bg-blue-500 text-white rounded">
  Click Me
</button>
```

✅ **CORRECT** - shadcn/ui Button
```typescript
import { Button } from "@/components/ui/button";

<Button>Click Me</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Forms & Inputs

❌ **WRONG** - Raw HTML input
```typescript
<input 
  type="text" 
  className="border p-2 rounded"
  placeholder="Enter text"
/>
```

✅ **CORRECT** - shadcn/ui Input
```typescript
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter email" />
</div>
```

### Cards

❌ **WRONG** - Custom card div
```typescript
<div className="border rounded-lg p-4 shadow">
  <h3>Title</h3>
  <p>Content</p>
</div>
```

✅ **CORRECT** - shadcn/ui Card
```typescript
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content</p>
  </CardContent>
</Card>
```

### Dialogs/Modals

❌ **WRONG** - Custom modal
```typescript
{isOpen && (
  <div className="fixed inset-0 bg-black/50">
    <div className="bg-white p-4 rounded">
      Content
    </div>
  </div>
)}
```

✅ **CORRECT** - shadcn/ui Dialog
```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    <p>Content</p>
  </DialogContent>
</Dialog>
```

### Select Dropdowns

❌ **WRONG** - Raw HTML select
```typescript
<select className="border p-2 rounded">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

✅ **CORRECT** - shadcn/ui Select
```typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Textarea

❌ **WRONG** - Raw HTML textarea
```typescript
<textarea className="border p-2 rounded" />
```

✅ **CORRECT** - shadcn/ui Textarea
```typescript
import { Textarea } from "@/components/ui/textarea";

<Textarea placeholder="Enter text here" />
```

### Forms with Validation

✅ **CORRECT** - shadcn/ui Form with React Hook Form
```typescript
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function MyForm() {
  const form = useForm();
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Commonly Used Components

Install these first:

```bash
# Essential components
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add label
npx shadcn@latest add form

# Layout & Navigation
npx shadcn@latest add separator
npx shadcn@latest add tabs
npx shadcn@latest add sheet

# Feedback & Overlays
npx shadcn@latest add dialog
npx shadcn@latest add alert
npx shadcn@latest add toast
npx shadcn@latest add skeleton

# Data Display
npx shadcn@latest add table
npx shadcn@latest add badge
npx shadcn@latest add avatar

# Forms
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add switch
npx shadcn@latest add textarea

# Dropdowns & Menus
npx shadcn@latest add dropdown-menu
npx shadcn@latest add popover
```

## Styling shadcn/ui Components

Use the `cn()` utility for additional styling:

```typescript
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

<Button className={cn("w-full", isActive && "bg-blue-600")}>
  Button
</Button>
```

## When Can You Create Custom Components?

You can ONLY create custom components for:
- **Business logic components** (e.g., `LinkCard`, `LinkForm`, `DashboardStats`)
- **Feature-specific components** (e.g., `QRCodeGenerator`, `LinkAnalytics`)
- **Layout components** (e.g., `Header`, `Footer`, `Sidebar`)
- **Composing multiple shadcn/ui components** together

Example of acceptable custom component:

```typescript
// components/links/LinkCard.tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function LinkCard({ link }: { link: Link }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {link.title || link.shortCode}
          <Badge>{link.clickCount} clicks</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{link.originalUrl}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">View Analytics</Button>
      </CardFooter>
    </Card>
  );
}
```

## Icons

Use **Lucide React** for all icons (included with shadcn/ui):

```typescript
import { Copy, ExternalLink, Trash2, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

<Button variant="ghost" size="icon">
  <Copy className="h-4 w-4" />
</Button>
```

## Loading States

Use shadcn/ui Skeleton:

```typescript
import { Skeleton } from "@/components/ui/skeleton";

<Card>
  <CardHeader>
    <Skeleton className="h-4 w-[200px]" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-10 w-full" />
  </CardContent>
</Card>
```

## Notifications

Use shadcn/ui Toast:

```typescript
import { useToast } from "@/components/ui/use-toast";

export function MyComponent() {
  const { toast } = useToast();
  
  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Link created successfully",
    });
  };
  
  const handleError = () => {
    toast({
      title: "Error",
      description: "Failed to create link",
      variant: "destructive",
    });
  };
  
  return <Button onClick={handleSuccess}>Create Link</Button>;
}
```

## Quick Checklist

Before creating any UI element:

- [ ] Is there a shadcn/ui component for this? ✅
- [ ] Have I installed the component? ✅
- [ ] Am I importing from `@/components/ui/`? ✅
- [ ] Am I NOT using raw HTML elements? ✅
- [ ] Am I using `cn()` for additional styling? ✅

## Common Mistakes to Avoid

❌ Creating a custom button component
❌ Using `<input>` directly
❌ Creating custom modal components
❌ Using raw `<select>` elements
❌ Building custom form controls from scratch

✅ Always check shadcn/ui docs first: https://ui.shadcn.com
✅ Install components before using them
✅ Compose shadcn/ui components for complex UIs
✅ Use Lucide React for icons
✅ Use `cn()` utility for conditional styling
