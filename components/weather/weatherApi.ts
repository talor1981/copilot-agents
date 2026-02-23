import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { WeatherResponse, WeatherData } from './types';

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://api.open-meteo.com/v1' 
  }),
  tagTypes: ['Weather'],
  endpoints: (builder) => ({
    getCurrentWeather: builder.query<WeatherData, { latitude: number; longitude: number }>({
      query: ({ latitude, longitude }) => ({
        url: '/forecast',
        params: {
          latitude,
          longitude,
          current: 'temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m',
        },
      }),
      transformResponse: (response: WeatherResponse, meta) => {
        // Enforce HTTP 200 only policy
        if (meta?.response?.status !== 200) {
          throw new Error('API Response was not 200 OK');
        }

        return {
          temperature: response.current.temperature_2m,
          temperatureUnit: response.current_units.temperature_2m,
          weatherCode: response.current.weather_code,
          humidity: response.current.relative_humidity_2m,
          windSpeed: response.current.wind_speed_10m,
          windSpeedUnit: response.current_units.wind_speed_10m,
          isDay: response.current.is_day === 1,
          location: response.timezone,
        };
      },
      providesTags: ['Weather'],
    }),
  }),
});

export const { useGetCurrentWeatherQuery } = weatherApi;
