import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { genericSchemas } from '../../../generic-schema';
import { isChapterFieldRequired } from '../../taskWizard/wizard/helpers';

const { date, genericLocation, genericTextinput } = genericSchemas;

export const schema = {
  type: 'object',
  properties: {
    dateOfMarriage: date,
    locationOfMarriage: genericLocation,
    marriageType: {
      type: 'string',
      enum: ['CEREMONIAL', 'COMMON-LAW', 'TRIBAL', 'PROXY', 'OTHER'],
      enumNames: ['Ceremonial', 'Common-law', 'Tribal', 'Proxy', 'Other'],
    },
    marriageTypeOther: genericTextinput,
  },
};

export const uiSchema = {
  dateOfMarriage: {
    ...currentOrPastDateUI('Date of marriage'),
    ...{
      'ui:required': formData => isChapterFieldRequired(formData, 'addSpouse'),
    },
  },
  locationOfMarriage: {
    'ui:title': 'Where were you married?',
    state: {
      'ui:required': formData => isChapterFieldRequired(formData, 'addSpouse'),
      'ui:title': 'State (or Country if outside the U.S.',
    },
    city: {
      'ui:required': formData => isChapterFieldRequired(formData, 'addSpouse'),
      'ui:title': 'City (or APO/FPO/DPO)',
    },
  },
  marriageType: {
    'ui:required': formData => isChapterFieldRequired(formData, 'addSpouse'),
    'ui:title': 'Type of marriage',
    'ui:widget': 'radio',
  },
  marriageTypeOther: {
    'ui:required': formData => formData.marriageType === 'OTHER',
    'ui:title': 'Other type of marriage',
    'ui:options': {
      expandUnder: 'marriageType',
      expandUnderCondition: 'OTHER',
      showFieldLabel: true,
      keepInPageOnReview: true,
      widgetClassNames: 'vads-u-margin-y--0',
    },
  },
};
