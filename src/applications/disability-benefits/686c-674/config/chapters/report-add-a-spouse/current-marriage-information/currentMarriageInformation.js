import merge from 'lodash/merge';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { isChapterFieldRequired } from '../../../helpers';
import { addSpouse } from '../../../utilities';
import { marriageTypeInformation } from './helpers';

import { locationUISchema } from '../../../location-schema';

const { currentMarriageInformation } = addSpouse.properties;

const newCurrentMarriageInformation = merge(
  currentMarriageInformation.properties.type,
  {
    type: 'string',
    enum: ['CEREMONIAL', 'CIVIL', 'COMMON-LAW', 'TRIBAL', 'PROXY', 'OTHER'],
    enumNames: [
      'Religious ceremony (minister, justice of the peace, etc.)',
      'Civil ceremony',
      'Common-law',
      'Tribal',
      'Proxy',
      'Other',
    ],
  },
);

export const schema = {
  type: 'object',
  properties: {
    currentMarriageInformation,
  },
};

export const uiSchema = {
  currentMarriageInformation: {
    date: {
      ...currentOrPastDateUI('Date of marriage'),
      ...{
        'ui:required': formData =>
          isChapterFieldRequired(formData, 'addSpouse'),
      },
    },
    location: locationUISchema(
      'currentMarriageInformation',
      'location',
      false,
      'Where were you married?',
      'addSpouse',
    ),
    type: {
      'ui:required': formData => isChapterFieldRequired(formData, 'addSpouse'),
      'ui:title': 'Type of marriage:',
      'ui:widget': 'radio',
      'ui:options': {
        updateSchema: formData => {
          if (formData?.useNewPDF) {
            return { newCurrentMarriageInformation };
          }
          return { currentMarriageInformation };
        },
      },
    },
    typeOther: {
      'ui:required': formData =>
        formData?.currentMarriageInformation?.type === 'OTHER',
      'ui:title': 'Other type of marriage',
      'ui:options': {
        expandUnder: 'type',
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
  },
};
