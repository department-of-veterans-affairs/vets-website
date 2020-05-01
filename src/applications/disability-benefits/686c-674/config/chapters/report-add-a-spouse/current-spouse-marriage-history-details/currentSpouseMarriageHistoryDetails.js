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
        'ui:title': 'Why did marriage end?',
        'ui:widget': 'radio',
      },
      reasonMarriageEndedOther: {
        'ui:required': (formData, index) =>
          formData.spouseMarriageHistory[`${index}`].reasonMarriageEnded ===
          'OTHER',
        'ui:title': 'Please give a brief explanation',
        'ui:options': {
          expandUnder: 'reasonMarriageEnded',
          expandUnderCondition: 'OTHER',
          keepInPageOnReview: true,
          widgetClassNames: 'vads-u-margin-y--0',
        },
      },
      endDate: {
        ...currentOrPastDateUI('When did marriage end?'),
        ...{
          'ui:required': formData => formData.spouseWasMarriedBefore,
        },
      },
      endLocation: {
        'ui:title': 'Place marriage to former spouse ended',
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
