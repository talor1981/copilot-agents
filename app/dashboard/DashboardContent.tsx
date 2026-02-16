'use client';

import { useGetPublicApisQuery, useGetUserLinksQuery } from './dashboardApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreateLinkDialog } from './CreateLinkDialog';
import { ExternalLink, Link2 } from 'lucide-react';

export function DashboardContent() {
  const { data, error, isLoading, refetch } = useGetPublicApisQuery({ 
    limit: 12, 
    sort: 'best' 
  });

  // Fetch user's links
  const { 
    data: userLinks, 
    error: linksError, 
    isLoading: linksLoading,
    refetch: refetchLinks 
  } = useGetUserLinksQuery();

  // Error Boundary pattern: throw error to nearest boundary if critical
  if (error) {
    console.error('Public APIs error:', error);
    throw new Error(`Failed to load public APIs: ${JSON.stringify(error)}`);
  }

  if (linksError) {
    console.error('User links error:', linksError);
    throw new Error(`Failed to load user links: ${JSON.stringify(linksError)}`);
  }

  if (isLoading || linksLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your shortened links and explore public APIs
          </p>
        </div>
        <div className="flex gap-3">
          <CreateLinkDialog />
          <Button onClick={() => { refetch(); refetchLinks(); }} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {/* User's Links Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          <h2 className="text-2xl font-semibold tracking-tight">Your Links</h2>
        </div>
        
        {userLinks && userLinks.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {userLinks.map((link) => (
              <Card key={link.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <code className="text-lg font-mono font-semibold">
                          /{link.shortCode}
                        </code>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {link.originalUrl}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(link.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      asChild
                    >
                      <a 
                        href={link.originalUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Visit
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No links yet. Create your first shortened link above!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Public APIs Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Public APIs</h2>
        
        {data && data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((api) => (
              <Card key={api.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="text-4xl mb-2">{api.emoji}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Health: {api.health}%
                      </span>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2">{api.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {api.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Methods:</span>
                      <span className="font-medium">{api.methods}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        asChild
                      >
                        <a 
                          href={api.documentation} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Docs
                        </a>
                      </Button>
                      {api.source && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          asChild
                        >
                          <a 
                            href={api.source} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            Source
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No APIs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
