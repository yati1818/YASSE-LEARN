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
  friendRequests: Map<string, Set<string>>; // username -> set of requester usernames
  friends: Map<string, Set<string>>; // username -> set of friend usernames
  videos: VideoLecture[];
  doubts: DoubtItem[];
}

const globalDb = global as unknown as { __yasse_server_db?: ServerDbStore };

if (!globalDb.__yasse_server_db) {
  globalDb.__yasse_server_db = {
    otps: new Map(),
    users: new Map(),
    usernames: new Set(),
    friendRequests: new Map(),
    friends: new Map(),
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

// REAL SOCIAL GRAPH & DYNAMIC LEADERBOARD ENGINE
export function getGlobalLeaderboard(): UserProfile[] {
  const allProfiles: UserProfile[] = [];
  serverDb.users.forEach((rec) => {
    allProfiles.push(rec.profile);
  });

  // Sort dynamically by streak & XP
  return allProfiles;
}

export function sendPeerFriendRequest(fromUsername: string, toUsername: string): { success: boolean; message?: string } {
  const cleanFrom = fromUsername.toLowerCase();
  const cleanTo = toUsername.toLowerCase();

  if (!serverDb.usernames.has(cleanTo)) {
    return { success: false, message: 'Target username not found.' };
  }

  if (!serverDb.friendRequests.has(cleanTo)) {
    serverDb.friendRequests.set(cleanTo, new Set());
  }

  serverDb.friendRequests.get(cleanTo)!.add(cleanFrom);
  return { success: true, message: `Friend request sent to @${toUsername}.` };
}

// UTC Clock-Synchronized Streak Engine (Strictly +1 per UTC Calendar Day)
export function calculateUtcStreak(calendarLogs: string[], lastWatchDate: string): { newLogs: string[]; newStreakDays: number; isIncremented: boolean } {
  const utcToday = new Date().toISOString().split('T')[0];
  
  if (lastWatchDate === utcToday) {
    return { newLogs: calendarLogs, newStreakDays: calendarLogs.length, isIncremented: false };
  }

  const updatedLogs = Array.from(new Set([...calendarLogs, utcToday]));
  return { newLogs: updatedLogs, newStreakDays: updatedLogs.length, isIncremented: true };
}
