import { add } from 'date-fns';
import { formatDate } from '../../../utils/dates';

/**
 * Test Date Helper Utilities
 *
 * This file provides date manipulation functions specifically for use in unit tests.
 * These helpers are designed to create predictable, relative dates for testing scenarios
 * while the main application transitions away from moment.js to native date utilities.
 *
 * Purpose:
 * - Provides a centralized location for test-specific date operations regarding use of `date-fns`
 * - Isolates the use of date-fns to this test helper, allowing the main application
 *   to migrate away from moment.js without affecting test functionality
 * - Ensures consistent date formatting across all unit tests
 *
 * Note: This is a transitional approach. Once the application fully migrates
 * to centralized date utilities, these helpers should
 * be updated to match the application's approach.
 */
export const daysFromToday = days =>
  formatDate(add(new Date(), { days }), 'YYYY-MM-DD');
