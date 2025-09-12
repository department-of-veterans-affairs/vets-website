/**
 * @module on-submit
 * @description Data transformation utilities for form submission.
 *
 * Organized by data domain, each transformation is a pure function that
 * takes form data as input and returns transformed data as output.
 *
 * @example
 * import { cleanToxicExposureData } from './utils/on-submit';
 * const transformedData = cleanToxicExposureData(formData);
 */

// Toxic Exposure Data Transformations
export {
  cleanToxicExposureData,
  getAllToxicExposureKeys,
} from './clean-toxic-exposure-data';
