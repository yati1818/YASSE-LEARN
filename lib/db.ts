import { VideoLecture, DoubtItem, UserProfile } from './types';

// In-memory server session database store with persistent state
interface ServerDbStore {
  otps: Map<string, { otp: string; expiresAt: number }>;
  videos: VideoLecture[];
  doubts: DoubtItem[];
}

const globalDb = global as unknown as { __yasse_server_db?: ServerDbStore };

if (!globalDb.__yasse_server_db) {
  globalDb.__yasse_server_db = {
    otps: new Map(),
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

  // Clear OTP after successful verification
  serverDb.otps.delete(mobileNumber);
  return { success: true };
}
