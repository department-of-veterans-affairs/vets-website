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
import { parseISO, startOfDay, subYears, isBefore } from 'date-fns';
import ListItemView from '../../../components/ListItemView';
import { getJobTitleOrType } from '../../../helpers';
import ArrayDescription from '../../../components/ArrayDescription';

/**
 * Determines if the applicant has federal treatment history
 * @param {object} formData - full form data
 * @returns {boolean} True if the applicant has federal treatment history, false
 * otherwise
 */
export function hasFederalTreatmentHistory(formData) {
  return formData.federalTreatmentHistory === true;
}

/**
 * Determines if the applicant does not have social security disability
 * @param {object} formData - full form data
 * @returns {boolean} True if the applicant does not have social security disability, false otherwise
 */
export function hasNoSocialSecurityDisability(formData) {
  return formData.socialSecurityDisability === false;
}

/**
 * Determines if the applicant has VA treatment history
 * @param {object} formData - full form data
 * @returns {boolean} True if the applicant has VA treatment history, false otherwise
 */
export function hasVaTreatmentHistory(formData) {
  return formData.vaTreatmentHistory === true;
}

/**
 * Determines if the applicant is in a nursing home
 * @param {object} formData - full form data
 * @returns {boolean} True if the applicant is in a nursing home, false otherwise
 */
export function isInNursingHome(formData) {
  return formData.nursingHome === true;
}

/**
 * Determines if the applicant is under 65 years old
 * @param {object} formData - full form data
 * @param {Date} currentDate - current date
 * @returns {boolean} True if the applicant is under 65, false otherwise
 */
export function isUnder65(formData, currentDate) {
  const today = currentDate || new Date();
  const dateToCompare = startOfDay(subYears(today, 65));

  return (
    isBefore(dateToCompare, parseISO(formData.veteranDateOfBirth)) ||
    !formData.isOver65
  );
}

/**
 * Determines if employment history is required
 * @param {object} formData - full form data
 * @returns {boolean} True if employment history is required, false otherwise
 */
export function requiresEmploymentHistory(formData) {
  return isUnder65(formData) && hasNoSocialSecurityDisability(formData);
}

/**
 * Determines if the applicant is employed and under 65 years old
 * @param {object} formData - full form data
 * @returns {boolean} True if the applicant is employed and under 65, false otherwise
 */
export function isEmployedUnder65(formData) {
  return formData.currentEmployment === true && isUnder65(formData);
}

/**
 * Determines if the applicant is unemployed and under 65 years old
 * @param {object} formData - full form data
 * @returns {boolean} True if the applicant is unemployed and under 65, false otherwise
 */
export function isUnemployedUnder65(formData) {
  return formData.currentEmployment === false && isUnder65(formData);
}

/**
 * Determines if the applicant does not have current employers
 * @param {object} formData - full form data
 * @returns {boolean} True if the applicant does not have current employers, false otherwise
 */
export function doesNotHaveCurrentEmployers(formData) {
  const currentEmployers = formData?.currentEmployers;
  return !currentEmployers || currentEmployers.length === 0;
}

/**
 * Determines if Medicaid does not cover nursing home
 * @param {object} formData - full form data
 * @returns {boolean} True if Medicaid does not cover nursing home, false otherwise
 */
export function medicaidDoesNotCoverNursingHome(formData) {
  return formData.nursingHome === true && formData.medicaidCoverage === false;
}

const MedicalCenterView = ({ formData }) => (
  <ListItemView title={formData.medicalCenter} />
);

MedicalCenterView.propTypes = {
  formData: PropTypes.shape({
    medicalCenter: PropTypes.string,
  }),
};

/**
 * Function to generate UI Schema and Schema for medical centers
 * @param {string} medicalCentersKey - Key for medical centers in the schema
 * @param {string} medicalCentersTitle - Title for the medical centers in UI
 * @param {string} medicalCenterMessage - Message for individual medical centers in UI
 * @param {string} medicalCenterFieldLabel - Label for the medical center field in UI
 * @param {string} medicalCentersReviewTitle - Review title for medical centers
 * @returns {Object} - Object containing uiSchema and schema
 */
export const generateMedicalCentersSchemas = (
  medicalCentersKey = 'medicalCenters',
  medicalCentersTitle = 'Default Medical Centers Title',
  medicalCenterMessage = 'Default Message',
  medicalCenterFieldLabel = 'Default Field Label',
  medicalCentersReviewTitle = 'Default Review Title',
) => {
  return {
    uiSchema: {
      ...titleUI(
        medicalCentersTitle,
        <ArrayDescription message={medicalCenterMessage} />,
      ),
      [medicalCentersKey]: {
        'ui:options': {
          itemName: 'Medical center',
          itemAriaLabel: data => data.medicalCenter,
          viewField: MedicalCenterView,
          reviewTitle: medicalCentersReviewTitle,
          keepInPageOnReview: true,
          customTitle: ' ',
          confirmRemove: true,
          useDlWrap: true,
          useVaCards: true,
          showSave: true,
          reviewMode: true,
        },
        items: {
          medicalCenter: {
            'ui:title': medicalCenterFieldLabel,
            'ui:webComponentField': VaTextInputField,
          },
        },
      },
    },
    schema: {
      type: 'object',
      properties: {
        [medicalCentersKey]: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            required: ['medicalCenter'],
            properties: {
              medicalCenter: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  };
};

export const EmployerView = ({ formData }) => (
  <ListItemView title={getJobTitleOrType(formData)} />
);

EmployerView.propTypes = {
  formData: PropTypes.shape({
    jobTitle: PropTypes.string,
  }),
};

const generateEmployersUISchema = ({
  employersKey,
  employersTitle,
  employerMessage,
  jobTypeFieldLabel,
  jobHoursWeekFieldLabel,
  jobTitleFieldLabel,
  employersReviewTitle,
  showJobDateField,
  showJobTitleField,
}) => ({
  ...titleUI(employersTitle, <ArrayDescription message={employerMessage} />),
  [employersKey]: {
    'ui:options': {
      itemName: 'Job',
      itemAriaLabel: data => getJobTitleOrType(data),
      viewField: EmployerView,
      reviewTitle: employersReviewTitle,
      keepInPageOnReview: true,
      customTitle: ' ',
      confirmRemove: true,
      useDlWrap: true,
      useVaCards: true,
      showSave: true,
      reviewMode: true,
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
      ...(showJobTitleField && {
        jobTitle: {
          'ui:title': jobTitleFieldLabel,
          'ui:webComponentField': VaTextInputField,
        },
      }),
    },
  },
});

const generateEmployersSchema = ({
  employersKey,
  maxEmployersAmount,
  showJobTitleField,
  showJobDateField,
}) => ({
  type: 'object',
  properties: {
    [employersKey]: {
      type: 'array',
      minItems: 1,
      maxItems: maxEmployersAmount,
      items: {
        type: 'object',
        required: showJobTitleField
          ? ['jobType', 'jobHoursWeek', 'jobTitle']
          : ['jobType', 'jobHoursWeek'],
        properties: {
          ...(showJobDateField && { jobDate: currentOrPastDateSchema }),
          jobType: {
            type: 'string',
          },
          jobHoursWeek: numberSchema,
          ...(showJobTitleField && {
            jobTitle: {
              type: 'string',
            },
          }),
        },
      },
    },
  },
});

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
export const generateEmployersSchemas = ({
  employersKey = 'employers',
  employersTitle = 'Default Employers Title',
  employerMessage = 'Default Message',
  jobTypeFieldLabel = 'Default Field Label',
  jobHoursWeekFieldLabel = 'Default Field Label',
  jobTitleFieldLabel = 'Default Field Label',
  employersReviewTitle = 'Default Review Title',
  maxEmployersAmount = 2,
  showJobDateField = false,
  showJobTitleField = false,
}) => {
  return {
    uiSchema: generateEmployersUISchema({
      employersKey,
      employersTitle,
      employerMessage,
      jobTypeFieldLabel,
      jobHoursWeekFieldLabel,
      jobTitleFieldLabel,
      employersReviewTitle,
      showJobDateField,
      showJobTitleField,
    }),
    schema: generateEmployersSchema({
      employersKey,
      maxEmployersAmount,
      showJobTitleField,
      showJobDateField,
    }),
  };
};

/**
 * Medical condition description component
 * @returns {React.Element} Medical condition description
 */
export function MedicalConditionDescription() {
  return (
    <div>
      <p>
        A medical condition is an illness or injury that affects your mind or
        body. It doesn't have to be service connected.
      </p>
      <va-additional-info
        trigger="How we define a medical condition that prevents you from working"
        uswds
      >
        <div>
          <p>
            If your medical condition prevents you from working, both of these
            must be true:
          </p>
          <ul>
            <li>
              Your medical condition is reasonably certain to continue
              throughout your lifetime, <strong>and</strong>
            </li>
            <li>
              Your medical condition makes it impossible to be gainfully
              employed
            </li>
          </ul>
        </div>
      </va-additional-info>
    </div>
  );
}

/**
 * Medical evidence notice component
 * @returns {React.Element} Medical evidence notice
 */
export function MedicalEvidenceNotice() {
  return (
    <div>
      <p>
        Based on your answer, you’ll need to submit additional evidence about
        your medical condition or disability.
      </p>
      <p>
        We’ll give you instructions for submitting your additional evidence at
        the end of this application.
      </p>
    </div>
  );
}
