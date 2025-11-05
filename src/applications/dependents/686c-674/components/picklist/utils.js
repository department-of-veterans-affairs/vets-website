import React from 'react';
import { parse, isValid, isPast } from 'date-fns';

import { getFormatedDate } from '../../../shared/utils';
import { PICKLIST_DATA, PICKLIST_PATHS } from '../../config/constants';

export const labels = {
  Spouse: {
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
    death: 'They died',
  },
  Parent: {
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
    isStepChildTitle: (fullName, age, isEditing) =>
      `${
        isEditing ? 'Edit is' : 'Is'
      } ${fullName} (age ${age}) your stepchild?`,
    isStepChildError: 'Select an option',
    isStepChildYes: 'Yes',
    isStepChildNo: 'No',

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

export const location = item =>
  `${item.endCity}, ${
    item.endOutsideUS
      ? `${item.endProvince ? `${item.endProvince}, ` : ''}${item.endCountry}`
      : `${item.endState}`
  }`;

export const pageDetails = {
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
      case 'death':
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
      // childAdopted work has been moved to the backlog
      // case 'childAdopted':
      //   return [isStepchild, reason];
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

export const showExitLink = ({ data = {}, index = 0 } = {}) => {
  const selected = data[PICKLIST_DATA]?.filter(item => item.selected) || [];
  const list = data[PICKLIST_PATHS] || [];
  const exitPaths = list.filter(item => item.path.endsWith('-exit'));

  return (
    selected.length === exitPaths.length &&
    exitPaths[exitPaths.length - 1]?.index === index
  );
};

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
