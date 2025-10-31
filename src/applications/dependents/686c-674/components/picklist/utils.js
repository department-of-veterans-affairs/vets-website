import React from 'react';

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
      label: `${item.fullName.first} is your stepchild?`,
      value: item.isStepchild === 'Y' ? 'Yes' : 'No',
      action: 'is stepchild?',
      hideLabel: true,
      hideValue: false, // generic value
    };
    const reason = {
      label: `Reason for removing ${item.fullName.first}`,
      value: labels.Child[item.removalReason],
      action: 'reason for removing child',
      hideLabel: true,
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
        // TO DO
        return [isStepchild, reason];
      case 'stepchildNotMember':
        // TO DO
        return [isStepchild, reason];
      case 'childAdopted':
        // TO DO
        return [isStepchild, reason];
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

export const showExitLink = ({ data, index }) => {
  const selected = data[PICKLIST_DATA]?.filter(item => item.selected) || [];
  const list = data[PICKLIST_PATHS] || [];
  const exitPaths = list.filter(item => item.path.endsWith('-exit'));

  return (
    selected.length === exitPaths.length &&
    exitPaths[exitPaths.length - 1]?.index === index
  );
};
