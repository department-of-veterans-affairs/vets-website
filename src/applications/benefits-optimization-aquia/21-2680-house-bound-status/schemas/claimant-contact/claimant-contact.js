import { z } from 'zod';
import {
  CONTACT_PATTERNS,
  VALIDATION_MESSAGES,
} from '@bio-aquia/shared/schemas/regex-patterns';

/**
 * Schema for claimant's phone number
 */
export const claimantPhoneNumberSchema = z
  .string()
  .min(1, 'Phone number is required')
  .refine(val => CONTACT_PATTERNS.PHONE_US.test(val.replace(/\D/g, '')), {
    message: 'Please enter a valid 10-digit phone number',
  });

/**
 * Schema for claimant's mobile phone number (optional)
 */
export const claimantMobilePhoneSchema = z
  .string()
  .refine(
    val =>
      !val ||
      val === '' ||
      CONTACT_PATTERNS.PHONE_US.test(val.replace(/\D/g, '')),
    {
      message: 'Please enter a valid 10-digit mobile phone number',
    },
  )
  .optional()
  .or(z.literal(''));

/**
 * Schema for claimant's email address
 */
export const claimantEmailSchema = z
  .string()
  .min(1, 'Email address is required')
  .email(VALIDATION_MESSAGES.EMAIL_FORMAT);

/**
 * Page schema for claimant contact page
 */
export const claimantContactPageSchema = z.object({
  claimantPhoneNumber: claimantPhoneNumberSchema,
  claimantMobilePhone: claimantMobilePhoneSchema,
  claimantEmail: claimantEmailSchema,
});
