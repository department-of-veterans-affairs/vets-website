import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { genericSchemas } from '../../../generic-schema';
import { isChapterFieldRequired } from '../../../helpers';

import { marriageTypeInformation } from './helpers';

const { date, genericLocation, genericTextInput } = genericSchemas;

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
    marriageTypeOther: genericTextInput,
    'view:marriageTypeInformation': {
      type: 'object',
      properties: {},
    },
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
      'ui:title': 'State (or Country if outside the U.S.)',
    },
    city: {
      'ui:required': formData => isChapterFieldRequired(formData, 'addSpouse'),
      'ui:title': 'City or county',
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
  'view:marriageTypeInformation': {
    'ui:title': 'Additional evidence needed',
    'ui:description': marriageTypeInformation,
  },
};
