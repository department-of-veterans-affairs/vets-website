import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { addSpouse } from '../../../utilities';
import { SpouseTitle } from '../../../../components/ArrayPageItemSpouseTitle';
import { locationUISchema } from '../../../location-schema';

import { get } from 'lodash';

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
      startLocation: locationUISchema(
        'spouseMarriageHistory',
        'startLocation',
        true,
        'Place of marriage to former spouse',
        'addSpouse',
      ),
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
      endLocation: locationUISchema(
        'spouseMarriageHistory',
        'endLocation',
        true,
        'Place marriage with former spouse ended',
        'addSpouse',
      ),
    },
  },
};
