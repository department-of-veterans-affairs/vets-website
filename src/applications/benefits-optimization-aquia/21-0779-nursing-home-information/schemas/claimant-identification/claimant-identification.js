import { z } from 'zod';

import {
  dateOfBirthSchema,
  fullNameSchema,
  ssnSchema,
  vaFileNumberSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas/veteran-identification';

/**
 * Schema for claimant personal information (name and DOB)
 */
export const claimantPersonalInfoSchema = z.object({
  claimantFullName: fullNameSchema,
  claimantDateOfBirth: dateOfBirthSchema,
});

/**
 * Schema for claimant identification information (SSN and file number)
 */
export const claimantIdentificationInfoSchema = z.object({
  claimantSsn: ssnSchema,
  claimantVaFileNumber: vaFileNumberSchema.optional().or(z.literal('')),
});
