import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import {
  isChapterFieldRequired,
  stateTitle,
  cityTitle,
} from '../../../helpers';
import { addSpouse } from '../../../utilities';
import { marriageTypeInformation } from './helpers';

import { locationUISchema } from '../../../location-schema';

const { currentMarriageInformation } = addSpouse.properties;

// export const schema = {
// type: 'object',
// properties: {
//  currentMarriageInformation,
// },
// };

export const schema = {
  type: 'object',
  properties: {
    currentMarriageInformation: {
      type: 'object',
      properties: {
        date: {
          pattern:
            '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
          type: 'string',
        },
        location: {
          type: 'object',
          properties: {
            isOutsideUS: {
              type: 'boolean',
              default: false,
            },
            state: {
              type: 'string',
              enum: ['CA', 'AL', 'FL'],
              enumNames: ['California', 'Alabama', 'Florida'],
            },
            country: {
              type: 'string',
              maxLength: 50,
              pattern: '^(?!\\s)(?!.*?\\s{2,})[^<>%$#@!^&*0-9]+$',
            },
            city: {
              type: 'string',
              maxLength: 30,
              pattern: '^(?!\\s)(?!.*?\\s{2,})[^<>%$#@!^&*0-9]+$',
            },
          },
        },
        type: {
          type: 'string',
          enum: ['CEREMONIAL', 'COMMON-LAW', 'TRIBAL', 'PROXY', 'OTHER'],
          enumNames: [
            'Religious or civil ceremony (minister, justice of the peace, etc.)',
            'Common-law',
            'Tribal',
            'Proxy',
            'Other',
          ],
        },
        typeOther: {
          type: 'string',
          maxLength: 50,
        },
        'view:marriageTypeInformation': {
          type: 'object',
          properties: {},
        },
      },
    },
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
    ),
    type: {
      'ui:required': formData => isChapterFieldRequired(formData, 'addSpouse'),
      'ui:title': 'Type of marriage:',
      'ui:widget': 'radio',
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
