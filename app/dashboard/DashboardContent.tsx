'use client';

import { useGetPublicApisQuery } from './dashboardApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function DashboardContent() {
  const { data, error, isLoading, refetch } = useGetPublicApisQuery({ 
    limit: 12, 
    sort: 'best' 
  });

  // Error Boundary pattern: throw error to nearest boundary if critical
  if (error) {
    throw error;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading public APIs...</p>
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
            Explore free public APIs from around the web
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          Refresh
        </Button>
      </div>

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
  );
}
