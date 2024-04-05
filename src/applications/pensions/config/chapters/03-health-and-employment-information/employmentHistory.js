import React from 'react';
import PropTypes from 'prop-types';

import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  numberUI,
  numberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import ListItemView from '../../../components/ListItemView';

export const EmployerView = ({ formData }) => (
  <ListItemView title={formData.jobTitle} />
);

EmployerView.propTypes = {
  formData: PropTypes.shape({
    jobTitle: PropTypes.string,
  }),
};

/**
 * Function to generate UI Schema and Schema for employment history
 * @param {string} employersKey - Key for employers in the schema
 * @param {string} employersTitle - Title for the employers in UI
 * @param {string} employerMessage - Message for individual employers in UI
 * @param {string} jobTypeFieldLabel - Label for the job type field in UI
 * @param {string} jobHoursWeekFieldLabel - Label for the job hours per week field in UI
 * @param {string} jobTitleFieldLabel - Label for the job title field in UI
 * @param {string} employersReviewTitle - Review title for employers
 * @param {number} maxEmployersAmount - Optional maximum number of employers
 * @param {boolean} showJobDateField - Optional job date field in UI
 * @returns {Object} - Object containing uiSchema and schema
 */
const generateEmployersSchemas = (
  employersKey = 'employers',
  employersTitle = 'Default Employers Title',
  employerMessage = 'Default Message',
  jobTypeFieldLabel = 'Default Field Label',
  jobHoursWeekFieldLabel = 'Default Field Label',
  jobTitleFieldLabel = 'Default Field Label',
  employersReviewTitle = 'Default Review Title',
  maxEmployersAmount = 2,
  showJobDateField = false,
) => {
  return {
    uiSchema: {
      ...titleUI(employersTitle),
      [employersKey]: {
        'ui:title': employerMessage,
        'ui:options': {
          itemName: 'Job',
          itemAriaLabel: data => data.jobTitle,
          viewField: EmployerView,
          reviewTitle: employersReviewTitle,
          keepInPageOnReview: true,
          customTitle: ' ',
          confirmRemove: true,
          useDlWrap: true,
          useVaCards: true,
        },
        items: {
          ...(showJobDateField && {
            jobDate: currentOrPastDateUI('When did you last work?'),
          }),
          jobType: {
            'ui:title': jobTypeFieldLabel,
            'ui:webComponentField': VaTextInputField,
          },
          jobHoursWeek: numberUI({
            title: jobHoursWeekFieldLabel,
            width: 'sm',
            min: 1,
            max: 168,
          }),
          jobTitle: {
            'ui:title': jobTitleFieldLabel,
            'ui:webComponentField': VaTextInputField,
          },
        },
      },
    },
    schema: {
      type: 'object',
      properties: {
        [employersKey]: {
          type: 'array',
          minItems: 1,
          maxItems: maxEmployersAmount,
          items: {
            type: 'object',
            required: ['jobType', 'jobHoursWeek', 'jobTitle'],
            properties: {
              ...(showJobDateField && { jobDate: currentOrPastDateSchema }),
              jobType: {
                type: 'string',
              },
              jobHoursWeek: numberSchema,
              jobTitle: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  };
};

export default generateEmployersSchemas;
