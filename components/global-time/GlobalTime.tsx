'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useGetTimeZoneQuery } from './globalTimeApi';
import type { SupportedTimeZone } from './types';

/**
 * Individual timezone display component
 */
function TimeZoneCard({ timezone }: { timezone: SupportedTimeZone }) {
  const { data, error, isLoading } = useGetTimeZoneQuery(timezone);

  const displayName = timezone === 'Europe/Amsterdam' ? 'Amsterdam' : 'Jerusalem';

  return (
    <Card className="flex-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          {displayName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-muted-foreground text-sm">Loading...</div>
        ) : error ? (
          <div className="text-destructive text-sm">
            Unable to load time data
          </div>
        ) : data ? (
          <div className="space-y-1">
            <div className="text-2xl font-bold">
              {data.time.split('.')[0]}
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date(data.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {data.day_of_week}
              {data.dst_active && ' (DST)'}
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">No data available</div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Global Time component - displays current time for multiple timezones
 * Fetches data from TimeAPI.io and displays Amsterdam and Jerusalem times
 */
export function GlobalTime() {
  const timezones: SupportedTimeZone[] = ['Europe/Amsterdam', 'Asia/Jerusalem'];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4">
        {timezones.map((timezone) => (
          <TimeZoneCard key={timezone} timezone={timezone} />
        ))}
      </div>
    </div>
  );
}
