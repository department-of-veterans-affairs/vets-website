/**
 * @module on-submit
 * @description Data transformation utilities for form submission.
 *
 * Organized by data domain, each transformation is a pure function that
 * takes form data as input and returns transformed data as output.
 *
 * @example
 * import { purgeToxicExposureData } from './utils/on-submit';
 * const transformedData = purgeToxicExposureData(formData);
 */

// Toxic Exposure Data Transformations
export {
  purgeToxicExposureData,
  EXPOSURE_TYPE_MAPPING,
} from './purge-toxic-exposure-data';
