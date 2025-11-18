/**
 * @module schemas/contact
 * @description Contact information validation schemas for phone numbers and email addresses.
 * Provides US phone number validation and email format validation.
 */

import { z } from 'zod';

import { VALIDATION_MESSAGES } from '../../utils/validators';

/**
 * @typedef {Object} ContactInfo
 * @property {string} [phoneNumber] - Phone number in (XXX) XXX-XXXX format (optional)
 * @property {string} [emailAddress] - Email address (optional)
 */

/**
 * Phone number validation schema for US phone numbers.
 * Accepts optional values and validates for 10-digit US format.
 * Transforms formatted numbers to digits only, removing all non-digit characters.
 * Rejects test patterns like 000-000-0000 and 123-456-7890.
 * @type {import('zod').ZodSchema<string | undefined>}
 * @example
 * phoneNumberSchema.parse('(555) 123-4567') // '5551234567'
 * phoneNumberSchema.parse('555.123.4567') // '5551234567'
 * phoneNumberSchema.parse('') // ''
 * phoneNumberSchema.parse('123') // throws - not 10 digits
 */
export const phoneNumberSchema = z
  .string()
  .optional()
  .transform(val => {
    if (!val) return val;
    // Extract digits only
    return val.replace(/\D/g, '');
  })
  .refine(
    val => {
      if (!val) return true;
      // Must be exactly 10 digits
      if (val.length !== 10) return false;
      // Reject test patterns like 000-000-0000
      if (val === '0000000000') return false;
      // Reject test pattern 123-456-7890
      return val !== '1234567890';
    },
    {
      message: 'Phone number must be 10 digits',
    },
  );

/**
 * Email address validation schema.
 * Validates email format and enforces maximum length of 100 characters.
 * Transforms email to lowercase and trims whitespace.
 * @type {import('zod').ZodSchema<string>}
 * @example
 * emailAddressSchema.parse('John.Doe@Example.COM  ') // 'john.doe@example.com'
 * emailAddressSchema.parse('invalid-email') // throws - invalid format
 */
export const emailAddressSchema = z
  .string()
  .min(1, 'Email address is required')
  .max(100, 'Email address must be 100 characters or less')
  .email(VALIDATION_MESSAGES.EMAIL_FORMAT)
  .transform(val => val?.trim().toLowerCase() || '');

/**
 * Contact information composite schema.
 * Combines phone number and email validation.
 * Requires at least one contact method (phone or email).
 * @type {import('zod').ZodSchema<ContactInfo>}
 * @example
 * contactSchema.parse({
 *   phoneNumber: '555-123-4567',
 *   emailAddress: 'user@example.com'
 * })
 * contactSchema.parse({ phoneNumber: '555-123-4567' }) // valid - has phone
 * contactSchema.parse({}) // throws - needs at least one contact method
 */
export const contactSchema = z
  .object({
    phoneNumber: phoneNumberSchema,
    emailAddress: emailAddressSchema.optional(),
  })
  .refine(data => data.phoneNumber || data.emailAddress, {
    message: 'Please provide either a phone number or email address',
  });
