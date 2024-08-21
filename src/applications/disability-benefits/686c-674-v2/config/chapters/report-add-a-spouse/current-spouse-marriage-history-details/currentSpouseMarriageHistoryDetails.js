import {
  radioUI,
  radioSchema,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { marriageEnums, spouseFormerMarriageLabels } from '../../../helpers';
import { FormerSpouseHeader } from '../../../../components/SpouseViewField';

export const schema = {
  type: 'object',
  properties: {
    spouseMarriageHistory: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        properties: {
          reasonMarriageEnded: radioSchema(marriageEnums),
          reasonMarriageEndedOther: textSchema,
        },
      },
    },
  },
};

export const uiSchema = {
  spouseMarriageHistory: {
    items: {
      'ui:title': FormerSpouseHeader,
      reasonMarriageEnded: {
        ...radioUI({
          title: 'How did their marriage end?',
          required: () => true,
          labels: spouseFormerMarriageLabels,
        }),
      },
      reasonMarriageEndedOther: {
        ...textUI('Briefly describe how their marriage ended'),
        'ui:required': (formData, index) =>
          formData.spouseMarriageHistory[`${index}`].reasonMarriageEnded ===
          'Other',
        'ui:options': {
          expandUnder: 'reasonMarriageEnded',
          expandUnderCondition: 'Other',
          keepInPageOnReview: true,
        },
      },
    },
  },
};
