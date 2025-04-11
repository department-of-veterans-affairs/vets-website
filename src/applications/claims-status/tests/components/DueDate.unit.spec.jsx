import React from 'react';
import { expect } from 'chai';
import {
  subMonths,
  subDays,
  addMonths,
  addDays,
  format,
  formatDistanceToNowStrict,
  parseISO,
  isBefore,
} from 'date-fns';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { buildDateFormatter } from '../../utils/helpers';
import { renderWithRouter } from '../utils';

import DueDate from '../../components/DueDate';

const formatDate = buildDateFormatter();

/**
 * Types for helper functions
 */

/**
 * @typedef {Object} CreateTestDateParams
 * @property {DateModifierFn} dateFn - date-fns function to modify the date (subMonths, addDays, etc)
 * @property {number} amount - amount to modify the date by
 */

/**
 * @typedef {Object} TestDateResult
 * @property {string} dateString - formatted date string in yyyy-MM-dd format
 * @property {string} timeAgoFormatted - relative time string (2 months ago, over 1 year ago, etc)
 * @property {string} formattedClaimDate - formatted date for display (April 1, 2024)
 * @property {boolean} isPastDue - whether the date is in the past
 */

/**
 * @typedef {Object} RenderResult
 * @property {HTMLElement} container - rendering result container element
 * @property {function(string): HTMLElement} getByText - RTL find elements by text func
 */

/**
 * Helper functions
 */

/**
 * Helper function to create test dates and determine if the date is past due
 * @param {CreateTestDateParams} params - The date function and amount
 * @returns {TestDateResult} The test date information
 */
const createTestDate = ({ dateFn, amount }) => {
  const dateString = format(dateFn(new Date(), amount), 'yyyy-MM-dd');
  return {
    dateString,
    timeAgoFormatted: formatDistanceToNowStrict(parseISO(dateString)),
    formattedClaimDate: formatDate(dateString),
    isPastDue: isBefore(parseISO(dateString), new Date()),
  };
};

/**
 * Helper function to render the DueDate component and perform common assertions
 * @param {TestDateResult} testDate - The test date object created by createTestDate
 * @param {string} [expectedClass] - Optional override for the expected CSS class
 * @returns {RenderResult} The rendered component's container and utilities
 */
const renderAndAssertDueDate = (testDate, expectedClass) => {
  const { container, getByText } = renderWithRouter(
    <DueDate date={testDate.dateString} />,
  );

  const expectedText = testDate.isPastDue
    ? `Needed from you by ${testDate.formattedClaimDate} - Due ${testDate.timeAgoFormatted} ago`
    : `Needed from you by ${testDate.formattedClaimDate}`;

  getByText(expectedText);

  const cssClass =
    expectedClass || (testDate.isPastDue ? '.past-due' : '.due-file');
  expect($(cssClass, container)).to.exist;

  return { container, getByText };
};

/**
 * Tests
 */

describe('<DueDate>', () => {
  describe('past due dates', () => {
    it('should render past due class when theres more than a years difference', () => {
      const testDate = createTestDate({ dateFn: subMonths, amount: 15 });
      renderAndAssertDueDate(testDate);
    });

    it('should render past due class when theres more than a months difference', () => {
      const testDate = createTestDate({ dateFn: subMonths, amount: 4 });
      renderAndAssertDueDate(testDate);
    });

    it('should render past due class when theres more than a days difference', () => {
      const testDate = createTestDate({ dateFn: subDays, amount: 3 });
      renderAndAssertDueDate(testDate);
    });

    it('should render past due class when theres more than a few hours difference', () => {
      const testDate = createTestDate({ dateFn: subDays, amount: 1 });
      renderAndAssertDueDate(testDate);
    });
  });

  describe('upcoming due dates', () => {
    it('should render file due class when more than a days difference', () => {
      const testDate = createTestDate({ dateFn: addDays, amount: 3 });
      renderAndAssertDueDate(testDate);
    });

    it('should render file due class when more than a months difference', () => {
      const testDate = createTestDate({ dateFn: addMonths, amount: 10 });
      renderAndAssertDueDate(testDate);
    });

    it('should render file due class when more than a years difference', () => {
      const testDate = createTestDate({ dateFn: addMonths, amount: 15 });
      renderAndAssertDueDate(testDate);
    });
  });
});
