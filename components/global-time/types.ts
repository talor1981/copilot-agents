/**
 * Type definitions for Global Time feature
 */

/**
 * TimeAPI response structure for timezone data
 */
export interface TimeZoneResponse {
  date_time: string;
  date: string;
  time: string;
  day_of_week: string;
  dst_active: boolean;
  timezone: string;
  utc_offset_seconds: number;
}

/**
 * Supported timezones for the global time display
 */
export type SupportedTimeZone = 'Europe/Amsterdam' | 'Asia/Jerusalem';

/**
 * Internal state for timezone display
 */
export interface TimeZoneDisplay {
  timezone: SupportedTimeZone;
  data: TimeZoneResponse | null;
  isLoading: boolean;
  error: string | null;
}
