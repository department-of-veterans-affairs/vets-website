import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { addSpouse } from '../../../utilities';
import { SpouseTitle } from '../../../../components/ArrayPageItemSpouseTitle';
import { stateTitle, cityTitle } from '../../../helpers';
import { locationUISchema } from '../../../location-schema';
import { get } from 'lodash';

// export const schema = addSpouse.properties.spouseMarriageHistoryDetails;

export const schema = {
  type: 'object',
  properties: {
    spouseMarriageHistoryDetails: {
      type: 'object',
      properties: {
        spouseMarriageHistory: {
          type: 'array',
          items: {
            type: 'object',
            minItems: 1,
            properties: {
              startDate: {
                pattern:
                  '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
                type: 'string',
              },
              startLocation: {
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
              reasonMarriageEnded: {
                type: 'string',
                enum: ['Divorce', 'Death', 'Other'],
                enumNames: ['Divorce', 'Death', 'Annulment/Other'],
              },
              reasonMarriageEndedOther: {
                type: 'string',
                maxLength: 50,
              },
              endDate: {
                pattern:
                  '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
                type: 'string',
              },
              endLocation: {
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
            },
          },
        },
      },
    },
  },
};

export const uiSchema = {
  spouseMarriageHistoryDetails: {
    spouseMarriageHistory: {
      items: {
        'ui:title': SpouseTitle,
        startDate: {
          ...currentOrPastDateUI('Date of marriage'),
          ...{
            'ui:required': formData => formData.spouseWasMarriedBefore,
          },
        },
        startLocation: {
          'ui:title': 'Where were you married?',
          isOutsideUS: {
            'ui:title': 'This occurred outsite the US',
          },
          country: {
            'ui:title': 'Country',

            'ui:options': {
              hideIf: (formData, index) => {
                const isOutsideUS = get(
                  formData,
                  'pouseMarriageHistory[`${index}`].startLocation.isOutsideUS',
                  false,
                );
                if (isOutsideUS) {
                  return true;
                }
              },
            },
          },
          state: {
            'ui:title': 'State',

            'ui:options': {
              hideIf: (formData, index) => {
                const isOutsideUS = get(
                  formData,
                  'pouseMarriageHistory[`${index}`].startLocation.isOutsideUS',
                  true,
                );
                if (isOutsideUS) {
                  return true;
                }
              },
            },
          },
          city: {
            'ui:required': formData =>
              isChapterFieldRequired(formData, 'addSpouse'),
            'ui:title': 'City',
          },
        },
        reasonMarriageEnded: {
          'ui:required': formData => formData.spouseWasMarriedBefore === true,
          'ui:title': 'Reason marriage ended',
          'ui:widget': 'radio',
          'ui:options': {
            updateSchema: () => ({
              enumNames: ['Divorce', 'Death', 'Annulment or other'],
            }),
          },
        },
        reasonMarriageEndedOther: {
          'ui:required': (formData, index) =>
            formData.spouseMarriageHistory[`${index}`].reasonMarriageEnded ===
            'Other',
          'ui:title': 'Please give a brief explanation',
          'ui:options': {
            expandUnder: 'reasonMarriageEnded',
            expandUnderCondition: 'Other',
            keepInPageOnReview: true,
            widgetClassNames: 'vads-u-margin-y--0',
          },
        },
        endDate: {
          ...currentOrPastDateUI('Date marriage ended'),
          ...{
            'ui:required': formData => formData.spouseWasMarriedBefore,
          },
        },
        endLocation: {
          'ui:title': 'Place marriage with former spouse ended',
          state: {
            'ui:required': formData => formData.spouseWasMarriedBefore,
            'ui:title': stateTitle,
          },
          city: {
            'ui:required': formData => formData.spouseWasMarriedBefore,
            'ui:title': cityTitle,
          },
        },
      },
    },
  },
};
