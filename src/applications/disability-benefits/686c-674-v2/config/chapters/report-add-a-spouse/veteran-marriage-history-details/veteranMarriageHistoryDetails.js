import {
  radioUI,
  radioSchema,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { marriageEnums, veteranFormerMarriageLabels } from '../../../helpers';
import { FormerSpouseHeader } from '../../../../components/SpouseViewField';

export const schema = {
  type: 'object',
  properties: {
    veteranMarriageHistory: {
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
  veteranMarriageHistory: {
    items: {
      'ui:title': FormerSpouseHeader,
      reasonMarriageEnded: {
        ...radioUI({
          title: 'How did your marriage end?',
          required: () => true,
          labels: veteranFormerMarriageLabels,
        }),
      },
      reasonMarriageEndedOther: {
        ...textUI('Briefly describe how your marriage ended'),
        'ui:required': (formData, index) =>
          formData.veteranMarriageHistory[`${index}`].reasonMarriageEnded ===
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
