import { add } from 'date-fns';
import { formatDate, parseDate } from '../../../utils/dates';

/**
 * Test Date Helper Utilities
 *
 * This file provides date manipulation functions specifically for use in unit tests.
 * These helpers are designed to create predictable, relative dates for testing scenarios
 * while the main application transitions away from moment.js to centralized date utilities.
 *
 * Purpose:
 * - Provides a centralized location for test-specific date operations regarding use of `date-fns`
 * - Isolates the use of `date-fns` to this test helper, allowing the main application
 *   to migrate away from moment.js and utilizing the centralized date utility
 *   without affecting test functionality
 *
 * Note: This is a transitional approach. Once the application fully migrates
 * to centralized date utilities, these helpers should
 * be updated to match the application's approach.
 */
export const daysFromToday = days =>
  formatDate(add(new Date(), { days }), 'yyyy-MM-dd');

export const getToday = () => parseDate(daysFromToday(0));
