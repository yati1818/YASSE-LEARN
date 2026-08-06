import { VideoLecture, DoubtItem, UserProfile } from './types';

interface RegisteredUserRecord {
  mobileNumber: string;
  username: string;
  playerId: string;
  pin: string;
  profile: UserProfile;
}

interface ServerDbStore {
  otps: Map<string, { otp: string; expiresAt: number }>;
  users: Map<string, RegisteredUserRecord>;
  usernames: Set<string>;
  playerIds: Set<string>;
  friendRequests: Map<string, Set<string>>;
  friends: Map<string, Set<string>>;
  videos: VideoLecture[];
  doubts: DoubtItem[];
}

const globalDb = global as unknown as { __yasse_server_db?: ServerDbStore };

if (!globalDb.__yasse_server_db) {
  globalDb.__yasse_server_db = {
    otps: new Map(),
    users: new Map(),
    usernames: new Set(),
    playerIds: new Set(),
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

// 1 Mobile Number = 1 Account & Gamer Player ID Engine (#YASSE-XXXX)
export function generateUniquePlayerId(mobileNumber: string): string {
  const lastFour = mobileNumber.slice(-4);
  let tag = `#YASSE-${lastFour}`;
  let counter = 1;
  while (serverDb.playerIds.has(tag)) {
    const randomFour = Math.floor(1000 + Math.random() * 9000);
    tag = `#YASSE-${randomFour}`;
    counter++;
    if (counter > 100) break;
  }
  return tag;
}

export function checkMobileExists(mobileNumber: string): boolean {
  return serverDb.users.has(mobileNumber);
}

export function checkUsernameExists(username: string): boolean {
  return serverDb.usernames.has(username.toLowerCase());
}

export function registerUserAccount(mobileNumber: string, pin: string, profile: UserProfile): { success: boolean; error?: string; user?: UserProfile } {
  if (serverDb.users.has(mobileNumber)) {
    return { success: false, error: 'This mobile number is already registered. Please log in.' };
  }

  const cleanUsername = profile.username.toLowerCase();
  if (serverDb.usernames.has(cleanUsername)) {
    return { success: false, error: `Username @${profile.username} is already taken. Please choose another.` };
  }

  const playerId = generateUniquePlayerId(mobileNumber);
  const fullProfile: UserProfile = {
    ...profile,
    playerId,
  };

  serverDb.users.set(mobileNumber, { mobileNumber, username: cleanUsername, playerId, pin, profile: fullProfile });
  serverDb.usernames.add(cleanUsername);
  serverDb.playerIds.add(playerId);

  return { success: true, user: fullProfile };
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

// REAL SOCIAL GRAPH & DYNAMIC LEADERBOARD ENGINE WITH PLAYER ID
export function getGlobalLeaderboard(): UserProfile[] {
  const allProfiles: UserProfile[] = [];
  serverDb.users.forEach((rec) => {
    allProfiles.push(rec.profile);
  });
  return allProfiles;
}

export function sendPeerFriendRequest(fromUsername: string, targetQuery: string): { success: boolean; message?: string } {
  const cleanFrom = fromUsername.toLowerCase();
  const cleanTarget = targetQuery.trim().toLowerCase();

  let targetUsername = '';

  serverDb.users.forEach((rec) => {
    if (rec.username.toLowerCase() === cleanTarget || rec.playerId.toLowerCase() === cleanTarget) {
      targetUsername = rec.username;
    }
  });

  if (!targetUsername) {
    return { success: false, message: 'Target @username or #YASSE-XXXX Player ID not found.' };
  }

  if (!serverDb.friendRequests.has(targetUsername)) {
    serverDb.friendRequests.set(targetUsername, new Set());
  }

  serverDb.friendRequests.get(targetUsername)!.add(cleanFrom);
  return { success: true, message: `Friend request sent to @${targetUsername}.` };
}

export function calculateUtcStreak(calendarLogs: string[], lastWatchDate: string): { newLogs: string[]; newStreakDays: number; isIncremented: boolean } {
  const utcToday = new Date().toISOString().split('T')[0];
  
  if (lastWatchDate === utcToday) {
    return { newLogs: calendarLogs, newStreakDays: calendarLogs.length, isIncremented: false };
  }

  const updatedLogs = Array.from(new Set([...calendarLogs, utcToday]));
  return { newLogs: updatedLogs, newStreakDays: updatedLogs.length, isIncremented: true };
}
