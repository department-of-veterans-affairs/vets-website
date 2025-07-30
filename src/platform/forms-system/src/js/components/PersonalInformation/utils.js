import { isValid, parse, parseISO } from 'date-fns';
import { get } from 'lodash';
import React from 'react';

/**
 * Checks if required data is present based on config
 * @param {Object} data - The data to check
 * @param {Object} config - The field configuration
 * @returns {string[]} Array of missing required field names
 */
export const getMissingData = (data, config) => {
  const checks = {
    name: {
      required: config.name?.required,
      present:
        get(data, 'userFullName.first') || get(data, 'userFullName.last'),
    },
    ssn: {
      required: config.ssn?.required,
      present: get(data, 'ssn'),
    },
    vaFileNumber: {
      required: config.vaFileNumber?.required,
      present: get(data, 'vaFileLastFour'),
    },
    dateOfBirth: {
      required: config.dateOfBirth?.required,
      present: get(data, 'dob'),
    },
    gender: {
      required: config.gender?.required,
      present: get(data, 'gender'),
    },
  };

  return Object.entries(checks)
    .filter(([_, { required, present }]) => required && !present)
    .map(([key]) => key);
};

/**
 * parseDateToDateObj from ISO8601 or JS number date (not unix time)
 * @param {string, number, Date} date - date to format
 * @returns {dateObj|null} date object
 */
export const parseDateToDateObj = (date, template) => {
  let newDate = date;
  if (typeof date === 'string') {
    if (date.includes('T')) {
      newDate = parseISO((date || '').split('T')[0]);
    } else if (template) {
      newDate = parse(date, template, new Date());
    }
  } else if (date instanceof Date && isValid(date)) {
    // Remove timezone offset - the only time we pass in a date object is for
    // unit tests (see https://stackoverflow.com/a/67599505)
    newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
  }
  return isValid(newDate) ? newDate : null;
};
export const FORMAT_YMD_DATE_FNS_CONCAT = 'yyyyMMdd';
export const FORMAT_YMD_DATE_FNS = 'yyyy-MM-dd';
export const FORMAT_COMPACT_DATE_FNS = 'MMM d, yyyy';
export const FORMAT_READABLE_DATE_FNS = 'MMMM d, yyyy';

/**
 * @param {React.ReactNode} children - The children to get by type
 * @returns {Object} The children by type
 */
export function getChildrenByType(children) {
  const childrenByType = {
    note: null,
    header: null,
    footer: null,
    cardHeader: null,
  };

  React.Children.forEach(children, child => {
    if (!child) return;
    // Check for the componentType property instead of display name
    if (child.type && child.type.componentType) {
      childrenByType[child.type.componentType] = child;
    }
  });

  return childrenByType;
}
