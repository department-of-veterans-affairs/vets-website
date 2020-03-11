import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import { genericSchemas } from '../../../generic-schema';
import { SpouseTitle } from '../../../../components/ArrayPageItemSpouseTitle';

const { date, genericLocation, genericTextInput } = genericSchemas;

const reasonMarriageEndedSchema = {
  type: 'string',
  enum: ['DIVORCE', 'DEATH', 'ANNULMENT', 'OTHER'],
  enumNames: ['Divorce', 'Death', 'Annulment', 'Other'],
};

const reasonMarriageEndedUISchema = {
  'ui:required': formData => formData.veteranWasMarriedBefore,
  'ui:title': 'Why did marriage end?',
  'ui:widget': 'radio',
};

export const schema = {
  type: 'object',
  properties: {
    veteranMarriageHistory: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          marriageStartDate: date,
          marriageStartLocation: genericLocation,
          reasonMarriageEnded: reasonMarriageEndedSchema,
          reasonMarriageEndedOther: genericTextInput,
          marriageEndDate: date,
          marriageEndLocation: genericLocation,
        },
      },
    },
  },
};

export const uiSchema = {
  veteranMarriageHistory: {
    items: {
      'ui:title': SpouseTitle,
      marriageStartDate: {
        ...currentOrPastDateUI('Date of marriage'),
        ...{
          'ui:required': formData => formData.veteranWasMarriedBefore,
        },
      },
      marriageStartLocation: {
        'ui:title': 'Where did this marriage take place?',
        state: {
          'ui:required': formData => formData.veteranWasMarriedBefore,
          'ui:title': 'State (or country if outside the U.S.)',
        },
        city: {
          'ui:required': formData => formData.veteranWasMarriedBefore,
          'ui:title': 'City or county',
        },
      },
      reasonMarriageEnded: reasonMarriageEndedUISchema,
      reasonMarriageEndedOther: {
        'ui:required': (formData, index) =>
          formData.veteranMarriageHistory[`${index}`].reasonMarriageEnded ===
          'OTHER',
        'ui:title': 'Please give a brief explanation',
        'ui:options': {
          expandUnder: 'reasonMarriageEnded',
          expandUnderCondition: 'OTHER',
          keepInPageOnReview: true,
          widgetClassNames: 'vads-u-margin-y--0',
        },
      },
      marriageEndDate: {
        ...currentOrPastDateUI('When did marriage end?'),
        ...{
          'ui:required': formData => formData.veteranWasMarriedBefore,
        },
      },
      marriageEndLocation: {
        'ui:title': 'Where did this marriage end?',
        state: {
          'ui:required': formData => formData.veteranWasMarriedBefore,
          'ui:title': 'State (or country if outside the U.S.)',
        },
        city: {
          'ui:required': formData => formData.veteranWasMarriedBefore,
          'ui:title': 'City or county',
        },
      },
    },
  },
};
