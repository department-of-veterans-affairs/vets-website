import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { addSpouse } from '../../../utilities';
import { SpouseTitle } from '../../../../components/ArrayPageItemSpouseTitle';

export const schema = addSpouse.properties.spouseMarriageHistoryDetails;

export const uiSchema = {
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
        'ui:title': 'Place of marriage to former spouse',
        state: {
          'ui:required': formData => formData.spouseWasMarriedBefore,
          'ui:title': 'State (or country if outside the U.S.)',
        },
        city: {
          'ui:required': formData => formData.spouseWasMarriedBefore,
          'ui:title': 'City or county',
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
          'ui:title': 'State (or country if outside the U.S.)',
        },
        city: {
          'ui:required': formData => formData.spouseWasMarriedBefore,
          'ui:title': 'City or county',
        },
      },
    },
  },
};
