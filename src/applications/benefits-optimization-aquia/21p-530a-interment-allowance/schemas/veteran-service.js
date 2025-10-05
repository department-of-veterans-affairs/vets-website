import { z } from 'zod';

/**
 * Veteran service information schemas for 21P-530a form
 * @module schemas/veteran-service
 */

/**
 * Schema for branch of service
 */
export const branchOfServiceSchema = z.enum(
  [
    'army',
    'navy',
    'marines',
    'air_force',
    'space_force',
    'coast_guard',
    'national_guard',
    'reserves',
  ],
  {
    errorMap: (issue, ctx) => {
      if (
        issue.code === 'invalid_enum_value' ||
        issue.code === 'invalid_type'
      ) {
        return { message: 'Please select a branch of service' };
      }
      return { message: ctx.defaultError };
    },
  },
);

/**
 * Schema for service entry date
 */
export const dateEnteredServiceSchema = z
  .string()
  .min(1, 'Service entry date is required')
  .refine(val => {
    const date = new Date(val);
    return date instanceof Date && !Number.isNaN(date.getTime());
  }, 'Please enter a valid date');

/**
 * Schema for place entered service
 */
export const placeEnteredServiceSchema = z
  .string()
  .min(1, 'Place entered service is required')
  .max(100, 'Place must be less than 100 characters');

/**
 * Schema for service separation date
 */
export const dateSeparatedSchema = z
  .string()
  .min(1, 'Service separation date is required')
  .refine(val => {
    const date = new Date(val);
    return date instanceof Date && !Number.isNaN(date.getTime());
  }, 'Please enter a valid date');

/**
 * Schema for place separated from service
 */
export const placeSeparatedSchema = z
  .string()
  .min(1, 'Place separated from service is required')
  .max(100, 'Place must be less than 100 characters');

/**
 * Schema for rank at separation
 */
export const rankSchema = z
  .string()
  .min(1, 'Rank at separation is required')
  .max(50, 'Rank must be less than 50 characters');

/**
 * Schema for alternate service name (optional)
 */
export const alternateNameSchema = z
  .object({
    hasAlternateName: z.enum(['yes', 'no'], {
      errorMap: (issue, ctx) => {
        if (
          issue.code === 'invalid_enum_value' ||
          issue.code === 'invalid_type'
        ) {
          return {
            message: 'Please indicate if veteran served under another name',
          };
        }
        return { message: ctx.defaultError };
      },
    }),
    alternateName: z.string().optional(),
    alternateServiceInfo: z.string().optional(),
  })
  .refine(
    data => {
      // If served under another name, require the name and service info
      if (data.hasAlternateName === 'yes') {
        return !!data.alternateName && !!data.alternateServiceInfo;
      }
      return true;
    },
    {
      message:
        'Alternate name and service information are required when veteran served under another name',
      path: ['alternateName'],
    },
  );

/**
 * Complete veteran service schema
 */
export const veteranServiceSchema = z
  .object({
    branchOfService: branchOfServiceSchema,
    dateEnteredService: dateEnteredServiceSchema,
    placeEnteredService: placeEnteredServiceSchema,
    rankAtSeparation: rankSchema,
    dateSeparated: dateSeparatedSchema,
    placeSeparated: placeSeparatedSchema,
    alternateNameInfo: alternateNameSchema,
  })
  .refine(
    data => {
      // Ensure service entry date is before separation date
      const entryDate = new Date(data.dateEnteredService);
      const sepDate = new Date(data.dateSeparated);
      return entryDate < sepDate;
    },
    {
      message: 'Service entry date must be before separation date',
      path: ['dateEnteredService'],
    },
  );
