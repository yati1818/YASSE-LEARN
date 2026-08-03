import { z } from 'zod';

// Strict 10-digit Indian Mobile Regex (must start with 6, 7, 8, or 9)
export const mobileNumberRegex = /^[6-9]\d{9}$/;

export const OtpSendSchema = z.object({
  mobileNumber: z
    .string()
    .transform((val) => val.replace(/[\s\-\+\(\)]/g, '').replace(/^91/, ''))
    .refine((val) => mobileNumberRegex.test(val), {
      message: 'Invalid 10-digit mobile number format. Must start with 6-9 and contain 10 digits.',
    }),
  targetEmail: z.string().email().optional(),
});

export const OtpVerifySchema = z.object({
  mobileNumber: z
    .string()
    .transform((val) => val.replace(/[\s\-\+\(\)]/g, '').replace(/^91/, ''))
    .refine((val) => mobileNumberRegex.test(val), {
      message: 'Invalid mobile number format.',
    }),
  otp: z
    .string()
    .length(6, { message: 'OTP must be exactly 6 digits.' })
    .regex(/^\d{6}$/, { message: 'OTP must contain numeric digits only.' }),
});

export const FeedbackSchema = z.object({
  userName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  userEmail: z.string().email({ message: 'Invalid email address.' }),
  role: z.string(),
  grade: z.string().optional(),
  type: z.enum(['suggestion', 'bug', 'feature_request', 'general']),
  rating: z.number().min(1).max(5),
  message: z.string().min(5, { message: 'Message must be at least 5 characters long.' }),
  destinationEmail: z.string().email().default('yatishsathish3012@gmail.com'),
  clientDiagnostics: z.object({
    deviceType: z.string(),
    operatingSystem: z.string(),
    browser: z.string(),
    screenResolution: z.string(),
    activeGradeView: z.string().optional(),
    submittedAt: z.string(),
  }),
});

export const VideoUploadSchema = z.object({
  title: z.string().min(3, { message: 'Video title must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  grade: z.string(),
  subject: z.string(),
  videoUrl: z.string().min(5, { message: 'Valid video URL or upload file source is required.' }),
  teacherName: z.string(),
  creatorEmail: z.string().email(),
});
