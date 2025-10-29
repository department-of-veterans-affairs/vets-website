import React from 'react';

import { getFormatedDate } from '../../../shared/utils';

export const labels = {
  Spouse: {
    removalReasonTitle: (fullName, isEditing) =>
      `${isEditing ? 'Edit reason' : 'Reason'} for removing ${fullName}`,
    removalReasonHint: 'If more than one applies, select what happened first.',
    removalReason: 'Why do you need to remove this dependent?',
    removalReasonError: 'Select a reason',
    marriageEnded: 'You’re no longer married to them',
    divorce: 'You got divorced',
    annulmentOrVoid: 'Your marriage was annulled or declared void',
    death: 'They died',
  },
  Parent: {
    removalReasonTitle: (fullName, isEditing) =>
      `${isEditing ? 'Edit reason' : 'Reason'} for removing ${fullName}`,
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

    removalReasonTitle: (fullName, isEditing) =>
      `${isEditing ? 'Edit reason' : 'Reason'} for removing ${fullName}`,
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
      ? `${item.endProvince ? `${item.endProvince},` : ''} ${item.endCountry}`
      : `${item.endState}`
  }`;

export const pageDetails = {
  Spouse: item => {
    const reason = {
      label: `Reason for removing ${item.fullName.first}`,
      value: labels.Spouse[item.removalReason],
    };

    switch (item.removalReason) {
      case 'marriageEnded':
        return [
          reason,
          {
            label: 'How did the marriage end?',
            value: labels.Spouse[item.endType],
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
    };
    const reason = {
      label: `Reason for removing ${item.fullName.first}`,
      value: labels.Child[item.removalReason],
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
