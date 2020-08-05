import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { addSpouse } from '../../../utilities';
import { SpouseTitle } from '../../../../components/ArrayPageItemSpouseTitle';
import { locationUISchema } from '../../../location-schema';

export const schema = addSpouse.properties.veteranMarriageHistoryDetails;

export const uiSchema = {
  veteranMarriageHistory: {
    items: {
      'ui:title': SpouseTitle,
      startDate: {
        ...currentOrPastDateUI('Date of marriage'),
        ...{
          'ui:required': formData => formData.veteranWasMarriedBefore,
        },
      },
      startLocation: locationUISchema(
        'veteranMarriageHistory',
        'startLocation',
        true,
        'Place of marriage to former spouse',
        'addSpouse',
      ),
      reasonMarriageEnded: {
        'ui:required': formData => formData.veteranWasMarriedBefore,
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
          formData.veteranMarriageHistory[`${index}`].reasonMarriageEnded ===
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
          'ui:required': formData => formData.veteranWasMarriedBefore,
        },
      },
      endLocation: locationUISchema(
        'veteranMarriageHistory',
        'endLocation',
        true,
        'Place marriage with former spouse ended',
        'addSpouse',
      ),
    },
  },
};
