import React from 'react';
import { parse, isValid, isPast } from 'date-fns';

import { getFormatedDate } from '../../../shared/utils';
import { PICKLIST_DATA, PICKLIST_PATHS } from '../../config/constants';

export const labels = {
  Spouse: {
    /**
     * @type {object}
     * @param {string} fullName - Full name of the dependent
     * @param {boolean} [isEditing] - Is in edit mode
     * @returns {React.ReactElement} Title element
     */
    removalReasonTitle: (fullName, isEditing) => (
      <span>
        {isEditing ? 'Edit reason' : 'Reason'} for removing{' '}
        <span className="dd-privacy-mask" data-dd-action-name="first name">
          {fullName}
        </span>
      </span>
    ),
    removalReasonHint: 'If more than one applies, select what happened first.',
    removalReason: 'Why do you need to remove this dependent?',
    removalReasonError: 'Select a reason',
    marriageEnded: 'You’re no longer married to them',
    divorce: 'You got divorced',
    annulmentOrVoid: 'Your marriage was annulled or declared void',
    spouseDied: 'They died',
  },
  Parent: {
    /**
     * @type {object}
     * @param {string} fullName - Full name of the dependent
     * @param {boolean} [isEditing] - Is in edit mode
     * @returns {React.ReactElement} Title element
     */
    removalReasonTitle: (fullName, isEditing) => (
      <span>
        {isEditing ? 'Edit reason' : 'Reason'} for removing{' '}
        <span className="dd-privacy-mask" data-dd-action-name="first name">
          {fullName}
        </span>
      </span>
    ),
    removalReasonHint: 'If more than one applies, select what happened first.',
    removalReason: 'Why do you need to remove this dependent?',
    removalReasonError: 'Select a reason',
    parentOther: 'Something else happened',
    parentDied: 'They died',
  },
  Child: {
    /**
     * @type {object}
     * @param {string} fullName - Full name of the dependent
     * @param {boolean} [isEditing] - Is in edit mode
     * @returns {React.ReactElement} Title element
     */
    isStepChildTitle: (fullName, age, isEditing) =>
      `${
        isEditing ? 'Edit is' : 'Is'
      } ${fullName} (age ${age}) your stepchild?`,
    isStepChildError: 'Select an option',
    isStepChildYes: 'Yes',
    isStepChildNo: 'No',

    /**
     * @type {object}
     * @param {string} fullName - Full name of the dependent
     * @param {boolean} [isEditing] - Is in edit mode
     * @returns {React.ReactElement} Title element
     */
    removalReasonTitle: (fullName, isEditing) => (
      <span>
        {isEditing ? 'Edit reason' : 'Reason'} for removing{' '}
        <span className="dd-privacy-mask" data-dd-action-name="first name">
          {fullName}
        </span>
      </span>
    ),
    removalReasonHint: 'If more than one applies, select what happened first.',
    removalReason: 'Why do you need to remove this dependent?',
    removalReasonError: 'Select a reason',
    childNotInSchool: 'They’re no longer enrolled in school',
    stepchildNotMember: 'They no longer live with you',
    childAdopted: 'They were adopted by another family',
    childMarried: 'They got married',
    childDied: 'They died',
  },
};

/**
 * Returns a formatted location string for the dependent's end location
 * @param {ItemData} item - dependent item data
 * @returns {string} - formatted location string
 */
export const location = item =>
  `${item.endCity}, ${
    item.endOutsideUs
      ? `${item.endProvince ? `${item.endProvince}, ` : ''}${item.endCountry}`
      : `${item.endState}`
  }`;

/**
 * @typedef PageReviewDetails - Page details for review page
 * @type {object} PageReviewDetails
 * @property {React.ReactElement|string} label - field label (key)
 * @property {string} value - field value (value)
 * @property {string} [action] - action name for Datadog RUM tracking
 * @property {boolean} [hideLabel] - whether to hide the label
 * @property {boolean} [hideValue] - whether to hide the value
 */
export const pageDetails = {
  /**
   * Prepare review page details for a spouse dependent
   * @param {ItemData} item - dependent item data
   * @returns {PageReviewDetails[]} - Array of page review details
   */
  Spouse: item => {
    const reason = {
      label: `Reason for removing ${item.fullName.first}`,
      value: labels.Spouse[item.removalReason],
      action: 'reason for removing spouse',
      hideLabel: true, // Hide label because it includes first name
      hideValue: false, // generic value
    };

    switch (item.removalReason) {
      case 'marriageEnded':
        return [
          reason,
          {
            label: 'How did the marriage end?',
            value: labels.Spouse[item.endType],
            hideValue: false, // generic value
          },
          item.endType === 'annulmentOrVoid'
            ? {
                label: 'Description of annulment or void',
                value: item.endAnnulmentOrVoidDescription,
              }
            : null,
          {
            label: 'When did the marriage end?',
            value: getFormatedDate(item.endDate),
          },
          {
            label: 'Where did the marriage end?',
            value: location(item),
          },
        ];
      case 'spouseDied':
        return [
          reason,
          {
            label: 'When was the death?',
            value: getFormatedDate(item.endDate),
          },
          {
            label: 'Where was the death?',
            value: location(item),
          },
        ];
      default:
        return [{ label: 'Something went wrong', value: '' }];
    }
  },

  /**
   * Prepare review page details for a parent dependent
   * @param {ItemData} item - dependent item data
   * @returns {PageReviewDetails[]} - Array of page review details
   */
  Parent: item => {
    const reason = {
      label: `Reason for removing ${item.fullName.first}`,
      value: labels.Parent[item.removalReason],
      action: 'reason for removing parent',
      hideLabel: true,
      hideValue: false, // generic value
    };
    switch (item.removalReason) {
      case 'parentDied':
        return [
          reason,
          {
            label: 'When was the death?',
            value: getFormatedDate(item.endDate),
          },
          {
            label: 'Where was the death?',
            value: location(item),
          },
        ];
      case 'parentOther':
        return [
          // reason, // Design doesn't want to show the reason in this situation
          {
            // We can't leave a DT blank
            label: (
              <div className="sr-only">
                This form only supports removing a parent if they died
              </div>
            ),
            // added to "data-dd-action-name" if label is not a string
            action: 'This form only supports removing a parent if they died',
            value: `${item.fullName.first} will remain on your benefits`,
          },
        ];
      default:
        return [{ label: 'Something went wrong', value: '' }];
    }
  },

  /**
   * Prepare review page details for a child dependent
   * @param {ItemData} item - dependent item data
   * @returns {PageReviewDetails[]} - Array of page review details
   */
  Child: item => {
    const isStepchild = {
      label: `Is ${item.fullName.first} your stepchild?`,
      value: item.isStepchild === 'Y' ? 'Yes' : 'No',
      action: 'is this dependent a stepchild?',
      hideLabel: true,
      hideValue: false, // generic value
    };
    const reason = {
      label: 'Reason for removing this child',
      value: labels.Child[item.removalReason],
      hideValue: false, // generic value
    };
    switch (item.removalReason) {
      case 'childMarried':
        return [
          isStepchild,
          reason,
          {
            label: 'Date of marriage',
            value: getFormatedDate(item.endDate),
          },
        ];
      case 'childNotInSchool':
        return [
          isStepchild,
          reason,
          {
            label: 'Does this child have a permanent disability?',
            value: item.childHasPermanentDisability === 'Y' ? 'Yes' : 'No',
          },
          item.childHasPermanentDisability === 'Y'
            ? {
                // We can't leave a DT blank
                label: (
                  <div className="sr-only">
                    This child is still an eligible dependent
                  </div>
                ),
                action: 'This child is still an eligible dependent',
                value: `${item.fullName.first} will remain on your benefits`,
              }
            : {
                label: 'Date child stopped attending school',
                value: getFormatedDate(item.endDate),
              },
        ];
      case 'stepchildNotMember':
        return [
          isStepchild,
          reason,
          {
            label:
              'Do you provide at least half of this child’s financial support?',
            value: item.stepchildFinancialSupport === 'Y' ? 'Yes' : 'No',
            hideValue: false,
          },
          item.stepchildFinancialSupport === 'Y'
            ? {
                // We can't leave a DT blank
                label: (
                  <div className="sr-only">
                    This child still qualifies as your dependent
                  </div>
                ),
                action: 'This child still qualifies as your dependent',
                value: `${item.fullName.first} will remain on your benefits`,
              }
            : {
                label: 'When did this child stop living with you?',
                value: getFormatedDate(item.endDate),
              },
        ];
      case 'childAdopted':
        return [
          isStepchild,
          reason,
          {
            // We can't leave a DT blank
            label: (
              <div className="sr-only">
                This child can’t be removed using this application
              </div>
            ),
            action: 'This child can’t be removed using this application',
            value: `${item.fullName.first} will remain on your benefits`,
          },
        ];
      case 'childDied':
        return [
          isStepchild,
          reason,
          {
            label: 'When was the death?',
            value: getFormatedDate(item.endDate),
          },
          {
            label: 'Where was the death?',
            value: location(item),
          },
        ];
      default:
        return [{ label: 'Something went wrong', value: '' }];
    }
  },
};

/**
 * Determine if an exit link should be displayed on the exit page, or should
 * the Veteran see the continue button to navigate to the next dependent
 * @typedef {object} ShowExitLinkParams
 * @property {object} data - form data
 * @property {number} index - current dependent index
 *
 * @param {ShowExitLinkParams} props - Show exit link props
 * @returns {boolean} - whether to show the exit link or continue button
 */
export const showExitLink = ({ data = {}, index = 0 } = {}) => {
  const selected = data[PICKLIST_DATA]?.filter(item => item.selected) || [];
  const list = data[PICKLIST_PATHS] || [];
  const exitPaths = list.filter(item => item.path.endsWith('-exit'));

  return (
    selected.length === exitPaths.length &&
    exitPaths[exitPaths.length - 1]?.index === index
  );
};

/**
 * Get past date error message
 * @param {string} date - date string in YYYY-MM-DD format
 * @param {string} [missingErrorMessage] - error message for missing date
 * @returns {string|null} - error message or null if no error
 */
export const getPastDateError = (
  date,
  missingErrorMessage = 'Enter a date',
) => {
  if (!date) {
    return missingErrorMessage;
  }

  const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
  if (!isValid(parsedDate)) {
    return 'Enter a valid date';
  }
  if (!isPast(parsedDate)) {
    return 'Enter a past date';
  }

  return null;
};
