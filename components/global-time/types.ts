/**
 * Type definitions for Global Time feature
 */

/**
 * TimeAPI response structure for timezone data
 */
export interface TimeZoneResponse {
  timezone: string;
  current_utc_offset_seconds: number;
  standard_utc_offset_seconds: number;
  dst_utc_offset_seconds: number;
  has_dst: boolean;
  dst_offset_seconds: number;
  dst_active: boolean;
  dst_from: string;
  dst_until: string;
  local_time: string;
  day_of_week: string;
  utc_time: string;
  unix_timestamp: number;
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
