/**
 * @module @bio-aquia/shared/hooks
 * @description Custom React hooks for form management, validation, and field handling
 * in VA.gov applications. These hooks provide reusable logic for common form patterns
 * and integrate with the VA Design System components.
 */

/**
 * Form-specific hooks for managing form sections and validation
 */

/**
 * Hook for managing form sections with automatic namespacing and validation.
 * Handles data extraction, validation, and namespacing for save-in-progress.
 * @see {@link module:use-form-section~useFormSection}
 */
export { useFormSection } from './use-form-section';

/**
 * Hook for form validation using Zod schemas.
 * Provides validation utilities for entire forms and individual fields.
 * @see {@link module:use-form-validation~useFormValidation}
 */
export { useFormValidation } from './use-form-validation';

/**
 * Field-level hooks for individual form field management
 */

/**
 * Hook for single field validation with debouncing and real-time feedback.
 * Integrates with VA web components for consistent error handling.
 * @see {@link module:use-field-validation~useFieldValidation}
 */
export { useFieldValidation } from './use-field-validation';

/**
 * Monitoring and analytics hooks
 */

/**
 * Hook for initializing Datadog RUM (Real User Monitoring).
 * Provides session replay, error tracking, and performance monitoring.
 * @see {@link module:use-datadog-rum~useDatadogRum}
 */
export { useDatadogRum } from './useDatadogRum';
