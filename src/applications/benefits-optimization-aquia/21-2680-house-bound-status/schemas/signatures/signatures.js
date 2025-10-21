import { z } from 'zod';

/**
 * Schema for claimant signature
 */
export const claimantSignatureSchema = z
  .string()
  .min(1, 'Signature is required')
  .max(50, 'Signature must be less than 50 characters');

/**
 * Schema for claimant signature date
 */
export const claimantSignatureDateSchema = z
  .string()
  .min(1, 'Date is required')
  .refine(val => {
    const date = new Date(val);
    return date instanceof Date && !Number.isNaN(date.getTime());
  }, 'Please enter a valid date')
  .refine(val => {
    const date = new Date(val);
    return date <= new Date();
  }, 'Date cannot be in the future');

/**
 * Schema for examination date
 */
export const examinationDateSchema = z
  .string()
  .min(1, 'Examination date is required')
  .refine(val => {
    const date = new Date(val);
    return date instanceof Date && !Number.isNaN(date.getTime());
  }, 'Please enter a valid date')
  .refine(val => {
    const date = new Date(val);
    return date <= new Date();
  }, 'Examination date cannot be in the future');

/**
 * Schema for examiner signature
 */
export const examinerSignatureSchema = z
  .string()
  .min(1, 'Signature is required')
  .max(50, 'Signature must be less than 50 characters');

/**
 * Schema for examiner signature date
 */
export const examinerSignatureDateSchema = z
  .string()
  .min(1, 'Date is required')
  .refine(val => {
    const date = new Date(val);
    return date instanceof Date && !Number.isNaN(date.getTime());
  }, 'Please enter a valid date')
  .refine(val => {
    const date = new Date(val);
    return date <= new Date();
  }, 'Date cannot be in the future');

/**
 * Complete claimant signature schema
 */
export const claimantSignaturePageSchema = z.object({
  claimantSignature: claimantSignatureSchema,
  claimantSignatureDate: claimantSignatureDateSchema,
});

/**
 * Complete examiner signature schema
 */
export const examinerSignaturePageSchema = z.object({
  examinationDate: examinationDateSchema,
  examinerSignature: examinerSignatureSchema,
  examinerSignatureDate: examinerSignatureDateSchema,
});
