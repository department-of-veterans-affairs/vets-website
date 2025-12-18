/**
 * @module @bio-aquia/shared/forms
 * @description Forms module providing utilities for integrating with VA.gov's form system.
 * This module exports data processing utilities that enhance VA.gov's existing form
 * infrastructure without duplicating it.
 *
 * VA.gov provides the core form infrastructure:
 * - Save-in-progress through RoutedSavableApp
 * - Form state management through Redux
 * - Form configuration through formConfig
 * - Multi-step navigation through createRoutesWithSaveInProgress
 *
 * This module provides enhancement utilities:
 * - Data processors for common transformations (dates)
 *
 * @example
 * ```javascript
 * import { transformDates } from '@bio-aquia/shared/forms';
 *
 * // Transform date fields to ensure proper formatting
 * const processedData = transformDates(formData, ['dateOfBirth', 'dateOfDeath']);
 * ```
 */

/**
 * Data processing utilities for form data transformation
 * @see {@link module:data-processors}
 */
export * from './data-processors';
