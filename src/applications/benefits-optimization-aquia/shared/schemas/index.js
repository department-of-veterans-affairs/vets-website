/**
 * @module @bio-aquia/shared/schemas
 * @description Zod validation schemas with user-friendly error messages for VA forms
 */

/** Address validation schemas (US/international/military) */
export * from './address';

/** Contact information schemas (phone/email) */
export * from './contact';

/** Name validation schemas */
export * from './name';

/** Personal information schemas (names/SSN/DOB) */
export * from './personal-info';

/** Regular expression patterns for validation */
export * from './regex-patterns';
