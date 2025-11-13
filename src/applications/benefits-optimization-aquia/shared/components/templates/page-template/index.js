/**
 * PageTemplate module exports
 *
 * This module provides flexible form page templates for VA.gov applications
 * with optional save-in-progress functionality and performance optimizations.
 *
 * Available exports:
 * - PageTemplate: Standard version (default export)
 * - PageTemplateCore: Core version without save-in-progress
 * - PageTemplateWithSaveInProgress: Standard version with save-in-progress
 * - PageTemplateOptimized: Performance-optimized version with save-in-progress
 * - PageTemplateCoreOptimized: Performance-optimized core version
 * - StableSaveStatus: Save status component
 * - StableSaveStatusOptimized: Performance-optimized save status
 *
 * @module components/templates/page-template
 */

// Standard components
export {
  PageTemplate as default,
  PageTemplate,
  PageTemplateCore,
  PageTemplateWithSaveInProgress,
} from './page-template';

// Optimized components
export {
  PageTemplateOptimized,
  PageTemplateCoreOptimized,
  OptimizedNavigationButtons,
  OptimizedFormHeader,
  OptimizedSaveFormLink,
} from './page-template-optimized';

// Save status components
export { default as StableSaveStatus } from './stable-save-status';
export {
  default as StableSaveStatusOptimized,
} from './stable-save-status-optimized';

// Constants and utilities
export * from './constants';
export * from './prop-types';
