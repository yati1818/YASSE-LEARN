import { VideoLecture, DoubtItem, UserProfile } from './types';

// Server-side persistent database store (1 Mobile = 1 Account & Unique Usernames)
interface RegisteredUserRecord {
  mobileNumber: string;
  username: string;
  pin: string;
  profile: UserProfile;
}

interface ServerDbStore {
  otps: Map<string, { otp: string; expiresAt: number }>;
  users: Map<string, RegisteredUserRecord>;
  usernames: Set<string>;
  videos: VideoLecture[];
  doubts: DoubtItem[];
}

const globalDb = global as unknown as { __yasse_server_db?: ServerDbStore };

if (!globalDb.__yasse_server_db) {
  globalDb.__yasse_server_db = {
    otps: new Map(),
    users: new Map(),
    usernames: new Set(),
    videos: [],
    doubts: [],
  };
}

export const serverDb = globalDb.__yasse_server_db;

export function setServerOtp(mobileNumber: string, otp: string) {
  const expiresAt = Date.now() + 5 * 60 * 1000;
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

// 1 Mobile Number = 1 Unique Account & Unique Username Engine
export function checkMobileExists(mobileNumber: string): boolean {
  return serverDb.users.has(mobileNumber);
}

export function checkUsernameExists(username: string): boolean {
  return serverDb.usernames.has(username.toLowerCase());
}

export function registerUserAccount(mobileNumber: string, pin: string, profile: UserProfile): { success: boolean; error?: string } {
  if (serverDb.users.has(mobileNumber)) {
    return { success: false, error: 'This mobile number is already registered. Please log in.' };
  }

  const cleanUsername = profile.username.toLowerCase();
  if (serverDb.usernames.has(cleanUsername)) {
    return { success: false, error: `Username @${profile.username} is already taken. Please choose another.` };
  }

  serverDb.users.set(mobileNumber, { mobileNumber, username: cleanUsername, pin, profile });
  serverDb.usernames.add(cleanUsername);
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
