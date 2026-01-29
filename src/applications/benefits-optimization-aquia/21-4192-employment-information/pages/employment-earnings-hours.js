/**
 * @module config/form/pages/employment-earnings-hours
 * @description Standard form system configuration for Employment Earnings/Hours page
 * VA Form 21-4192 - Request for Employment Information
 */

import {
  textareaUI,
  textUI,
  currencyUI,
  currencySchema,
  numberUI,
  numberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  getVeteranName,
  getEmploymentTense,
  getEmploymentTimeframe,
} from './helpers';

/**
 * Generate title for type of work field
 */
const getTypeOfWorkTitle = formData => {
  if (!formData || typeof formData !== 'object') return 'Type of work';
  const veteranName = getVeteranName(formData);
  const tense = getEmploymentTense(formData);
  return `What type of work ${tense.does} ${veteranName} do?`;
};

/**
 * Generate title for amount earned field
 */
const getAmountEarnedTitle = formData => {
  if (!formData || typeof formData !== 'object') return 'Amount earned';
  const veteranName = getVeteranName(formData);
  const timeframe = getEmploymentTimeframe(formData);
  return `How much did ${veteranName} earn in the ${timeframe} (before deductions)?`;
};

/**
 * Generate title for time lost field
 */
const getTimeLostTitle = formData => {
  if (!formData || typeof formData !== 'object')
    return 'Time lost to disability';
  const veteranName = getVeteranName(formData);
  const timeframe = getEmploymentTimeframe(formData);
  return `How many hours did ${veteranName} lose to disability in the ${timeframe}?`;
};

/**
 * Generate title for daily hours field
 */
const getDailyHoursTitle = formData => {
  if (!formData || typeof formData !== 'object') return 'Daily hours worked';
  const veteranName = getVeteranName(formData);
  const tense = getEmploymentTense(formData);
  return `How many hours ${tense.does} ${veteranName} work each day?`;
};

/**
 * Generate title for weekly hours field
 */
const getWeeklyHoursTitle = formData => {
  if (!formData || typeof formData !== 'object') return 'Weekly hours worked';
  const veteranName = getVeteranName(formData);
  const tense = getEmploymentTense(formData);
  return `How many hours ${tense.does} ${veteranName} work each week?`;
};

/**
 * Generate page title
 * @param {Object} props - Props object with formData and formContext
 * @param {Object} props.formData - The form data
 * @returns {string} The page title
 */
const getPageTitle = ({ formData }) => {
  // Defensive: getVeteranName handles formData validation
  const veteranName = getVeteranName(formData);
  return `Details about ${veteranName}'s employment`;
};

/**
 * uiSchema for Employment Earnings/Hours page
 * Collects employment earnings and hours information
 */
export const employmentEarningsHoursUiSchema = {
  ...titleUI(getPageTitle),
  employmentEarningsHours: {
    typeOfWork: textareaUI({
      title: 'Type of work',
      charcount: true,
      errorMessages: {
        required: 'Type of work is required',
        maxLength: 'Type of work must be less than 1000 characters',
      },
    }),
    amountEarned: currencyUI({
      title: 'Amount earned',
      errorMessages: {
        required: 'Amount earned is required',
        min: 'Amount earned must be at least $0',
      },
    }),
    timeLost: textUI({
      title: 'Time lost to disability',
      inputSuffix: 'hours',
      errorMessages: {
        required: 'Time lost is required',
        maxLength: 'Time lost must be less than 100 characters',
      },
    }),
    dailyHours: numberUI({
      title: 'Daily hours worked',
      inputSuffix: 'hours',
      min: 0,
      max: 24,
      errorMessages: {
        required: 'Daily hours is required',
        min: 'Daily hours must be at least 0',
        max: 'Daily hours cannot exceed 24',
      },
    }),
    weeklyHours: numberUI({
      title: 'Weekly hours worked',
      inputSuffix: 'hours',
      min: 0,
      max: 168,
      errorMessages: {
        required: 'Weekly hours is required',
        min: 'Weekly hours must be at least 0',
        max: 'Weekly hours cannot exceed 168',
      },
    }),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      // Evaluate dynamic field titles
      const typeOfWorkTitle = getTypeOfWorkTitle(fullData || formData);
      const amountEarnedTitle = getAmountEarnedTitle(fullData || formData);
      const timeLostTitle = getTimeLostTitle(fullData || formData);
      const dailyHoursTitle = getDailyHoursTitle(fullData || formData);
      const weeklyHoursTitle = getWeeklyHoursTitle(fullData || formData);

      return {
        employmentEarningsHours: {
          typeOfWork: {
            'ui:title': typeOfWorkTitle,
          },
          amountEarned: {
            'ui:title': amountEarnedTitle,
          },
          timeLost: {
            'ui:title': timeLostTitle,
          },
          dailyHours: {
            'ui:title': dailyHoursTitle,
          },
          weeklyHours: {
            'ui:title': weeklyHoursTitle,
          },
        },
      };
    },
  },
};

/**
 * JSON Schema for Employment Earnings/Hours page
 * Validates employment earnings and hours fields
 */
export const employmentEarningsHoursSchema = {
  type: 'object',
  required: ['employmentEarningsHours'],
  properties: {
    employmentEarningsHours: {
      type: 'object',
      required: [
        'typeOfWork',
        'amountEarned',
        'timeLost',
        'dailyHours',
        'weeklyHours',
      ],
      properties: {
        typeOfWork: {
          type: 'string',
          maxLength: 1000,
        },
        amountEarned: currencySchema,
        timeLost: {
          type: 'string',
          maxLength: 100,
        },
        dailyHours: numberSchema,
        weeklyHours: numberSchema,
      },
    },
  },
};
