import {
  ssnOrVaFileNumberNoHintUI,
  ssnOrVaFileNumberNoHintSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const spouseVeteranIdUI = ssnOrVaFileNumberNoHintUI();
spouseVeteranIdUI['ui:title'] =
  "Provide your spouse's VA file number or Social Security number";
spouseVeteranIdUI['ui:required'] = () => true;

export default {
  uiSchema: {
    ...titleUI('Spouse veteran information'),
    remarriage: {
      spouseVeteranId: spouseVeteranIdUI,
    },
  },
  schema: {
    type: 'object',
    properties: {
      remarriage: {
        type: 'object',
        required: ['spouseVeteranId'],
        properties: {
          spouseVeteranId: ssnOrVaFileNumberNoHintSchema,
        },
      },
    },
  },
};
