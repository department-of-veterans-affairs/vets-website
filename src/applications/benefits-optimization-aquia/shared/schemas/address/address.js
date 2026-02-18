/**
 * @module schemas/address
 * @description Comprehensive address validation schemas for US, international, and military addresses.
 * Includes conditional validation based on country and military status.
 */

import { z } from 'zod';
import constants from 'vets-json-schema/dist/constants.json';
import addressData from 'platform/forms/address/data';

import {
  isValidUSZipCode,
  isValidCanPostalCode,
  isValidMexicoPostalCode,
  MILITARY_ZIP_PATTERNS,
  VALIDATION_MESSAGES,
} from '../../utils/validators';

/**
 * Valid military cities - from platform
 * @type {string[]}
 */
const MILITARY_CITIES = addressData.militaryCities;

/**
 * Valid military state codes - from platform
 * @type {string[]}
 */
const MILITARY_STATES = addressData.militaryStates;

/**
 * US States including territories (excluding military codes) - from platform
 * Extracted from vets-json-schema constants
 * @type {string[]}
 */
const US_STATES = constants.states.USA.map(state => state.value);

/**
 * All valid state codes including US states, territories, and military codes
 * @type {string[]}
 */
const ALL_STATES_AND_TERRITORIES = [...US_STATES, ...MILITARY_STATES];

/**
 * Street address schema - validates street addresses
 */
export const streetAddressSchema = z
  .string()
  .min(1, 'Street address is required')
  .max(100, 'Street address must be 100 characters or less')
  .regex(/^.*\S.*/, 'Street address cannot be only whitespace')
  .trim();

/**
 * City schema - validates city names
 */
export const citySchema = z
  .string()
  .min(1, 'City is required')
  .max(50, 'City must be 50 characters or less')
  .trim();

/**
 * State code schema - validates US state codes
 */
export const stateCodeSchema = z
  .string()
  .length(2, 'State must be a 2-letter code')
  .toUpperCase()
  .refine(
    val => ALL_STATES_AND_TERRITORIES.includes(val),
    'Invalid state code',
  );

/**
 * Postal code schema - validates postal codes based on country
 */
export const postalCodeSchema = z
  .string()
  .optional()
  .refine(val => {
    if (!val) return true;
    // Accept US, Canadian, Mexican, and military postal codes using platform validators
    return (
      isValidUSZipCode(val) ||
      isValidCanPostalCode(val) ||
      isValidMexicoPostalCode(val) ||
      Object.values(MILITARY_ZIP_PATTERNS).some(pattern => pattern.test(val))
    );
  }, 'Invalid postal code format');

/**
 * Country code schema - validates country codes
 */
export const countryCodeSchema = z
  .string()
  .optional()
  .default('USA')
  .refine(val => {
    if (!val) return true;
    return (
      ['USA', 'US', 'CAN', 'CA', 'MEX', 'MX'].includes(val) ||
      val.length === 2 ||
      val.length === 3
    );
  }, 'Invalid country code');

/**
 * International address schema - for addresses outside USA
 */
export const internationalAddressSchema = z.object({
  street: streetAddressSchema,
  street2: z.string().optional(),
  city: citySchema,
  province: z.string().optional(),
  country: z.string(),
  postalCode: z.string().optional(),
  internationalPostalCode: z.string().optional(),
});

/**
 * Military address schema - for APO/FPO/DPO addresses
 */
export const militaryAddressSchema = z.object({
  street: streetAddressSchema,
  street2: z.string().optional(),
  city: z.enum(['APO', 'FPO', 'DPO']),
  state: z.enum(['AA', 'AE', 'AP']),
  postalCode: z
    .string()
    .refine(val => isValidUSZipCode(val), 'Invalid ZIP code format'),
  country: z.literal('USA').default('USA'),
  isMilitary: z.literal(true).default(true),
});

/**
 * Canadian provinces and territories - from platform
 * Extracted from vets-json-schema constants
 * @type {string[]}
 */
const CANADIAN_PROVINCES = constants.states.CAN.map(state => state.value);

/**
 * Mexican states
 * TODO: Investigate format mismatch with platform constants
 * Local uses 2-letter codes ('AG', 'BC'), platform uses full names in kebab-case
 * ('aguascalientes', 'baja-california-norte'). Need to verify what backend API expects.
 * @type {string[]}
 */
const MEXICAN_STATES = [
  'AG',
  'BC',
  'BS',
  'CM',
  'CS',
  'CH',
  'CO',
  'CL',
  'DF',
  'DG',
  'GT',
  'GR',
  'HG',
  'JA',
  'ME',
  'MI',
  'MO',
  'NA',
  'NL',
  'OA',
  'PU',
  'QT',
  'QR',
  'SL',
  'SI',
  'SO',
  'TB',
  'TM',
  'TL',
  'VE',
  'YU',
  'ZA',
];

/**
 * Base address schema without refinements (for extending)
 */
const baseAddressSchema = z.object({
  isMilitary: z.boolean().optional(),
  country: z.string().min(1, 'Country is required'),
  street: z
    .string()
    .min(1, 'Street address is required')
    .regex(/^.*\S.*/, 'Street address cannot be only whitespace')
    .trim(),
  street2: z.string().optional(),
  street3: z.string().optional(),
  city: z
    .string()
    .min(1, 'City is required')
    .trim(),
  state: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  internationalPostalCode: z.string().optional(),
});

/**
 * Enhanced address schema with conditional validation based on country and military status
 */
export const addressSchema = baseAddressSchema.superRefine((data, ctx) => {
  const { isMilitary, country, city, state, postalCode } = data;

  // Military base validation
  if (isMilitary) {
    // City must be APO, FPO, or DPO
    if (!MILITARY_CITIES.includes(city)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Select a type of post office: APO, FPO, or DPO',
        path: ['city'],
      });
    }

    // State must be AA, AE, or AP
    if (!MILITARY_STATES.includes(state)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Select an abbreviation: AA, AE, or AP',
        path: ['state'],
      });
    }

    // Validate military ZIP code ranges
    if (state && postalCode) {
      const pattern = MILITARY_ZIP_PATTERNS[state];
      if (pattern && !pattern.test(postalCode)) {
        let expectedFormat;
        if (state === 'AA') {
          expectedFormat = '340xx';
        } else if (state === 'AE') {
          expectedFormat = '09xxx';
        } else {
          expectedFormat = '96[2-6]xx';
        }
        ctx.addIssue({
          code: 'custom',
          message: `Invalid postal code for military state ${state}. Expected format: ${expectedFormat}`,
          path: ['postalCode'],
        });
      }
    }

    // Postal code is required for military
    if (!postalCode) {
      ctx.addIssue({
        code: 'custom',
        message: 'Postal code is required',
        path: ['postalCode'],
      });
    }
  }

  // Country-specific validation
  if (country === 'USA' && !isMilitary) {
    // State is required for USA
    if (!state) {
      ctx.addIssue({
        code: 'custom',
        message: 'State is required',
        path: ['state'],
      });
    } else if (!US_STATES.includes(state)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Select a valid state',
        path: ['state'],
      });
    }

    // Validate US postal code
    if (!postalCode) {
      ctx.addIssue({
        code: 'custom',
        message: 'ZIP code is required',
        path: ['postalCode'],
      });
    } else if (!isValidUSZipCode(postalCode)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Enter a valid 5-digit ZIP code (12345) or ZIP+4 (12345-6789)',
        path: ['postalCode'],
      });
    }
  }

  if (country === 'CAN') {
    // Province is required for Canada
    if (!state) {
      ctx.addIssue({
        code: 'custom',
        message: 'Province or territory is required',
        path: ['state'],
      });
    } else if (!CANADIAN_PROVINCES.includes(state)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Select a valid province or territory',
        path: ['state'],
      });
    }

    // Validate Canadian postal code
    if (!postalCode) {
      ctx.addIssue({
        code: 'custom',
        message: 'Postal code is required',
        path: ['postalCode'],
      });
    } else if (!isValidCanPostalCode(postalCode)) {
      ctx.addIssue({
        code: 'custom',
        message: VALIDATION_MESSAGES.POSTAL_CANADA,
        path: ['postalCode'],
      });
    }
  }

  if (country === 'MEX') {
    // State is required for Mexico
    if (!state) {
      ctx.addIssue({
        code: 'custom',
        message: 'State is required',
        path: ['state'],
      });
    } else if (!MEXICAN_STATES.includes(state)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Select a valid state',
        path: ['state'],
      });
    }

    // Validate Mexican postal code
    if (!postalCode) {
      ctx.addIssue({
        code: 'custom',
        message: 'Postal code is required',
        path: ['postalCode'],
      });
    } else if (!isValidMexicoPostalCode(postalCode)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Enter a valid 5-digit postal code',
        path: ['postalCode'],
      });
    }
  }

  // International addresses (not USA, CAN, MEX)
  if (country && !['USA', 'CAN', 'MEX'].includes(country) && !isMilitary) {
    // Use province field for state/province/region
    if (!data.province) {
      ctx.addIssue({
        code: 'custom',
        message: 'State, province, or region is required',
        path: ['province'],
      });
    }

    // International postal code (allow 'NA' if no postal code)
    if (!data.internationalPostalCode) {
      ctx.addIssue({
        code: 'custom',
        message:
          "Enter a postal code (or 'NA' if your country doesn't use postal codes)",
        path: ['internationalPostalCode'],
      });
    }
  }
});

/**
 * Simplified mailing address schema
 */
export const mailingAddressSchema = addressSchema.describe('Mailing address');

/**
 * Home address schema with optional same-as-mailing flag
 */
export const homeAddressSchema = baseAddressSchema
  .extend({
    sameAsMailing: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const { isMilitary, country, city, state, postalCode } = data;

    // Military base validation
    if (isMilitary) {
      if (!state) {
        ctx.addIssue({
          code: 'custom',
          message: 'State is required for military bases',
          path: ['state'],
        });
      }

      const isValidMilitaryState = MILITARY_STATES.includes(state);
      const isValidMilitaryCity = MILITARY_CITIES.includes(city?.toUpperCase());

      if (!isValidMilitaryState && !isValidMilitaryCity) {
        ctx.addIssue({
          code: 'custom',
          message: 'Please enter a valid military base city or state',
          path: ['city'],
        });
      }

      if (!postalCode) {
        ctx.addIssue({
          code: 'custom',
          message: 'Postal code is required for military addresses',
          path: ['postalCode'],
        });
      }
      return;
    }

    // US address validation
    if (country === 'US' || country === 'USA') {
      if (!state) {
        ctx.addIssue({
          code: 'custom',
          message: 'State is required for US addresses',
          path: ['state'],
        });
      }

      if (!postalCode) {
        ctx.addIssue({
          code: 'custom',
          message: 'Postal code is required for US addresses',
          path: ['postalCode'],
        });
      } else if (!isValidUSZipCode(postalCode)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Enter a valid 5-digit ZIP code (or ZIP+4)',
          path: ['postalCode'],
        });
      }
      return;
    }

    // Canadian address validation
    if (country === 'CA' || country === 'CAN' || country === 'Canada') {
      if (!data.province) {
        ctx.addIssue({
          code: 'custom',
          message: 'Province is required for Canadian addresses',
          path: ['province'],
        });
      }

      if (!postalCode) {
        ctx.addIssue({
          code: 'custom',
          message: 'Postal code is required for Canadian addresses',
          path: ['postalCode'],
        });
      } else if (!isValidCanPostalCode(postalCode)) {
        ctx.addIssue({
          code: 'custom',
          message: VALIDATION_MESSAGES.POSTAL_CANADA,
          path: ['postalCode'],
        });
      }
      return;
    }

    // Mexican address validation
    if (country === 'MX' || country === 'MEX' || country === 'Mexico') {
      if (!state) {
        ctx.addIssue({
          code: 'custom',
          message: 'State is required for Mexican addresses',
          path: ['state'],
        });
      }

      if (!postalCode) {
        ctx.addIssue({
          code: 'custom',
          message: 'Postal code is required for Mexican addresses',
          path: ['postalCode'],
        });
      } else if (!isValidMexicoPostalCode(postalCode)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Enter a valid 5-digit Mexican postal code',
          path: ['postalCode'],
        });
      }
      return;
    }

    // International address
    if (!data.internationalPostalCode) {
      ctx.addIssue({
        code: 'custom',
        message:
          "Enter a postal code (or 'NA' if your country doesn't use postal codes)",
        path: ['internationalPostalCode'],
      });
    }
  })
  .describe('Home address');

/**
 * Transform address data for backend submission
 * Consolidates postalCode fields and removes UI-only fields
 */
export const transformAddressForSubmission = address => {
  const transformed = { ...address };

  delete transformed.isMilitary;
  if (address.internationalPostalCode) {
    transformed.postalCode = address.internationalPostalCode;
    delete transformed.internationalPostalCode;
  }

  if (address.province) {
    transformed.state = address.province;
    delete transformed.province;
  }

  ['street2', 'street3'].forEach(field => {
    if (!transformed[field]) {
      delete transformed[field];
    }
  });

  return transformed;
};

/**
 * Validate if address needs USPS verification
 */
export const requiresUSPSVerification = address => {
  return (
    address.country === 'USA' &&
    !address.isMilitary &&
    address.street &&
    address.city &&
    address.state &&
    address.postalCode
  );
};
