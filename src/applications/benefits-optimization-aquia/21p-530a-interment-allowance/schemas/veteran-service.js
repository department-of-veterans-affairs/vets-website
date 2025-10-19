import { z } from 'zod';
<<<<<<< HEAD
import constants from 'vets-json-schema/dist/constants.json';
=======
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)

/**
 * Veteran service information schemas for 21P-530a form
 * @module schemas/veteran-service
 */

/**
 * Schema for branch of service
<<<<<<< HEAD
 * Matches constants.branchesServed from vets-json-schema
 */
export const branchOfServiceSchema = z
  .string()
  .min(1, 'Please select a branch of service')
  .refine(
    val =>
      [
        'air force',
        'army',
        'coast guard',
        'marine corps',
        'merchant seaman',
        'navy',
        'noaa',
        'space force',
        'usphs',
        'f.commonwealth',
        'f.guerilla',
        'f.scouts new',
        'f.scouts old',
      ].includes(val),
    {
      message: 'Please select a branch of service',
    },
  );
=======
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
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)

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
<<<<<<< HEAD
  .max(100, 'Place must be less than 100 characters')
  .optional()
  .or(z.literal(''));
=======
  .min(1, 'Place entered service is required')
  .max(100, 'Place must be less than 100 characters');
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)

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
<<<<<<< HEAD
  .max(100, 'Place must be less than 100 characters')
  .optional()
  .or(z.literal(''));
=======
  .min(1, 'Place separated from service is required')
  .max(100, 'Place must be less than 100 characters');
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)

/**
 * Schema for rank at separation
 */
export const rankSchema = z
  .string()
<<<<<<< HEAD
  .max(50, 'Rank must be less than 50 characters')
  .optional()
  .or(z.literal(''));

/**
 * Schema for yes/no question about alternate names
 */
export const hasAlternateNamesSchema = z.enum(['yes', 'no'], {
  errorMap: (issue, ctx) => {
    if (issue.code === 'invalid_enum_value' || issue.code === 'invalid_type') {
      return {
        message: 'Please select yes or no',
      };
    }
    return { message: ctx.defaultError };
  },
});

/**
 * Schema for a single previous name item
 */
export const previousNameItemSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  middleName: z
    .string()
    .max(50, 'Middle name must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
});

/**
 * Schema for previous names array
 */
export const previousNamesSchema = z
  .array(previousNameItemSchema)
  .min(1, 'At least one previous name is required');

/**
 * Helper function to check if a previous name is empty
 * @param {Object} name - Previous name object
 * @returns {boolean} True if the name has no data
 */
export const isPreviousNameEmpty = name => {
  return !name.firstName && !name.middleName && !name.lastName;
};

/**
 * Helper function to format previous name summary for display
 * @param {Object} name - Previous name object
 * @returns {string} Formatted name or empty string if name is empty
 */
export const formatPreviousNameSummary = name => {
  if (isPreviousNameEmpty(name)) {
    return '';
  }

  const parts = [name.firstName, name.middleName, name.lastName].filter(
    Boolean,
  );
  return parts.join(' ');
};
=======
  .min(1, 'Rank at separation is required')
  .max(50, 'Rank must be less than 50 characters');
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)

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
<<<<<<< HEAD
 * Schema for a single service period item
 */
export const servicePeriodItemSchema = z
  .object({
    branchOfService: branchOfServiceSchema,
    dateFrom: dateEnteredServiceSchema,
    dateTo: dateSeparatedSchema,
    placeOfEntry: placeEnteredServiceSchema.optional(),
    placeOfSeparation: placeSeparatedSchema.optional(),
    rank: rankSchema.optional(),
  })
  .refine(
    data => {
      // Ensure service start date is before end date
      if (!data.dateFrom || !data.dateTo) return true;
      const startDate = new Date(data.dateFrom);
      const endDate = new Date(data.dateTo);
      return startDate < endDate;
    },
    {
      message: 'Service start date must be before end date',
      path: ['dateFrom'],
    },
  );

/**
 * Schema for service periods array
 */
export const servicePeriodsSchema = z
  .array(servicePeriodItemSchema)
  .min(1, 'At least one service period is required');

/**
 * Helper function to check if a service period is empty/not filled out
 * @param {Object} period - Service period object
 * @returns {boolean} True if the period has no data
 */
export const isServicePeriodEmpty = period => {
  return (
    !period.branchOfService &&
    !period.dateFrom &&
    !period.dateTo &&
    !period.placeOfEntry &&
    !period.placeOfSeparation &&
    !period.rank
  );
};

/**
 * Helper function to format service period summary for display
 * Used in confirmation modals and summaries
 * @param {Object} period - Service period object
 * @returns {string} Formatted summary or empty string if period is empty
 */
export const formatServicePeriodSummary = period => {
  // Don't return summary for empty periods
  if (isServicePeriodEmpty(period)) {
    return '';
  }

  // Find matching branch label from constants
  const branchOption = constants.branchesServed.find(
    branch => branch.value === period.branchOfService,
  );
  const branchLabel = branchOption
    ? branchOption.label
    : period.branchOfService || '';

  const from = period.dateFrom
    ? new Date(period.dateFrom).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';
  const to = period.dateTo
    ? new Date(period.dateTo).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  // Build summary based on what's filled out
  const parts = [];
  if (branchLabel) parts.push(branchLabel);
  if (from || to) {
    parts.push(`${from || 'Unknown'} to ${to || 'Unknown'}`);
  }

  return parts.join(', ');
};

/**
=======
>>>>>>> 33c4dc25a0 (feat(bio-aquia): Setup page patterns for bio-aquia apps)
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
