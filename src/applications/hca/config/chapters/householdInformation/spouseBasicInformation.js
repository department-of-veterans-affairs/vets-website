import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import fullNameUI from 'platform/forms/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const {
  dateOfMarriage,
  spouseDateOfBirth,
  spouseFullName,
  spouseSocialSecurityNumber,
} = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(
      content['household-info--spouse-basic-info-title'],
      content['household-info--spouse-basic-info-description'],
    ),
    spouseFullName: {
      ...fullNameUI,
      first: {
        ...fullNameUI.first,
        'ui:title':
          content['household-info--spouse-basic-info-first-name-label'],
      },
      middle: {
        ...fullNameUI.middle,
        'ui:title':
          content['household-info--spouse-basic-info-middle-name-label'],
      },
      last: {
        ...fullNameUI.last,
        'ui:title':
          content['household-info--spouse-basic-info-last-name-label'],
      },
      suffix: {
        ...fullNameUI.suffix,
        'ui:title': content['household-info--spouse-basic-info-suffix-label'],
      },
    },
    spouseSocialSecurityNumber: {
      ...ssnUI,
      'ui:title': content['household-info--spouse-basic-info-ssn-label'],
    },
    spouseDateOfBirth: currentOrPastDateUI(
      content['household-info--spouse-basic-info-birthdate-label'],
    ),
    dateOfMarriage: currentOrPastDateUI(
      content['household-info--spouse-basic-info-marriage-date-label'],
    ),
  },
  schema: {
    type: 'object',
    required: [
      'spouseSocialSecurityNumber',
      'spouseDateOfBirth',
      'dateOfMarriage',
    ],
    properties: {
      spouseFullName,
      spouseSocialSecurityNumber,
      spouseDateOfBirth,
      dateOfMarriage,
    },
  },
};
