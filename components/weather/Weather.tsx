'use client';

import { useEffect, useState } from 'react';
import { useGetCurrentWeatherQuery } from './weatherApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, Wind, Droplets } from 'lucide-react';

/**
 * Weather code interpretation based on WMO Weather interpretation codes
 * https://open-meteo.com/en/docs
 */
const getWeatherIcon = (code: number, isDay: boolean) => {
  const iconClass = "w-8 h-8";
  
  if (code === 0) return <Sun className={iconClass} />;
  if (code === 1 || code === 2) return isDay ? <Sun className={iconClass} /> : <Cloud className={iconClass} />;
  if (code === 3) return <Cloud className={iconClass} />;
  if (code >= 45 && code <= 48) return <Cloud className={iconClass} />;
  if (code >= 51 && code <= 57) return <CloudDrizzle className={iconClass} />;
  if (code >= 61 && code <= 67) return <CloudRain className={iconClass} />;
  if (code >= 71 && code <= 77) return <CloudSnow className={iconClass} />;
  if (code >= 80 && code <= 82) return <CloudRain className={iconClass} />;
  if (code >= 85 && code <= 86) return <CloudSnow className={iconClass} />;
  if (code >= 95 && code <= 99) return <CloudRain className={iconClass} />;
  
  return <Cloud className={iconClass} />;
};

const getWeatherDescription = (code: number): string => {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 57) return 'Drizzle';
  if (code >= 61 && code <= 67) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code >= 85 && code <= 86) return 'Snow showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  
  return 'Unknown';
};

export function Weather() {
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError('Unable to get location. Using default location.');
          // Default to Tel Aviv coordinates if geolocation fails
          setCoordinates({ latitude: 32.0853, longitude: 34.7818 });
        }
      );
    } else {
      setLocationError('Geolocation not supported. Using default location.');
      // Default to Tel Aviv coordinates
      setCoordinates({ latitude: 32.0853, longitude: 34.7818 });
    }
  }, []);

  const { data, error, isLoading } = useGetCurrentWeatherQuery(
    coordinates!,
    { skip: !coordinates }
  );

  // Trigger Error Boundary for critical errors
  if (error && 'status' in error) {
    const status = typeof error.status === 'number' ? error.status : parseInt(String(error.status), 10);
    if (status >= 500) {
      throw error;
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isLoading ? (
            'Loading Weather...'
          ) : data ? (
            <>
              {getWeatherIcon(data.weatherCode, data.isDay)}
              Current Weather
            </>
          ) : (
            'Weather'
          )}
        </CardTitle>
        <CardDescription>
          {locationError || (data?.location ? `Location: ${data.location}` : 'Real-time weather data')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <div className="text-muted-foreground">Loading weather data...</div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-6">
            <div className="text-destructive">Failed to load weather data</div>
          </div>
        )}

        {data && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">
                  {data.temperature}°{data.temperatureUnit}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {getWeatherDescription(data.weatherCode)}
                </div>
              </div>
              <div className="text-6xl">
                {getWeatherIcon(data.weatherCode, data.isDay)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Humidity</div>
                  <div className="font-semibold">{data.humidity}%</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Wind</div>
                  <div className="font-semibold">
                    {data.windSpeed} {data.windSpeedUnit}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
