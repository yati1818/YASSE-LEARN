import { VideoLecture, DoubtItem, UserProfile } from './types';

// Server-side persistent database store (1 Mobile = 1 Unique Account)
interface RegisteredUserRecord {
  mobileNumber: string;
  pin: string;
  profile: UserProfile;
}

interface ServerDbStore {
  otps: Map<string, { otp: string; expiresAt: number }>;
  users: Map<string, RegisteredUserRecord>;
  videos: VideoLecture[];
  doubts: DoubtItem[];
}

const globalDb = global as unknown as { __yasse_server_db?: ServerDbStore };

if (!globalDb.__yasse_server_db) {
  globalDb.__yasse_server_db = {
    otps: new Map(),
    users: new Map(),
    videos: [],
    doubts: [],
  };
}

export const serverDb = globalDb.__yasse_server_db;

export function setServerOtp(mobileNumber: string, otp: string) {
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiration
  serverDb.otps.set(mobileNumber, { otp, expiresAt });
}

export function verifyServerOtp(mobileNumber: string, userOtp: string): { success: boolean; error?: string } {
  const record = serverDb.otps.get(mobileNumber);
  if (!record) {
    return { success: false, error: 'OTP request not found or expired. Please request a new OTP.' };
  }

  if (Date.now() > record.expiresAt) {
    serverDb.otps.delete(mobileNumber);
    return { success: false, error: 'OTP code has expired. Please request a new code.' };
  }

  if (record.otp !== userOtp.trim()) {
    return { success: false, error: 'Invalid 6-digit OTP code entered.' };
  }

  serverDb.otps.delete(mobileNumber);
  return { success: true };
}

// 1 Mobile Number = 1 Unique Account Engine
export function checkMobileExists(mobileNumber: string): boolean {
  return serverDb.users.has(mobileNumber);
}

export function registerUserAccount(mobileNumber: string, pin: string, profile: UserProfile): { success: boolean; error?: string } {
  if (serverDb.users.has(mobileNumber)) {
    return { success: false, error: 'This mobile number is already registered. Please log in.' };
  }

  serverDb.users.set(mobileNumber, { mobileNumber, pin, profile });
  return { success: true };
}

export function loginUserAccount(mobileNumber: string, pin: string): { success: boolean; user?: UserProfile; error?: string } {
  const record = serverDb.users.get(mobileNumber);
  if (!record) {
    return { success: false, error: 'Account not found for this mobile number. Please sign up.' };
  }

  if (record.pin !== pin) {
    return { success: false, error: 'Invalid 6-digit security PIN entered.' };
  }

  return { success: true, user: record.profile };
}

// UTC Clock-Synchronized Streak Engine (Strictly +1 per UTC Calendar Day)
export function calculateUtcStreak(calendarLogs: string[], lastWatchDate: string): { newLogs: string[]; newStreakDays: number; isIncremented: boolean } {
  const utcToday = new Date().toISOString().split('T')[0]; // YYYY-MM-DD UTC
  
  if (lastWatchDate === utcToday) {
    // Already logged today; +0 increment
    return { newLogs: calendarLogs, newStreakDays: calendarLogs.length, isIncremented: false };
  }

  const updatedLogs = Array.from(new Set([...calendarLogs, utcToday]));
  return { newLogs: updatedLogs, newStreakDays: updatedLogs.length, isIncremented: true };
}
