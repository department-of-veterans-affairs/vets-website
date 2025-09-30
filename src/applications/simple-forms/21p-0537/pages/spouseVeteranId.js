import {
  ssnOrVaFileNumberNoHintUI,
  ssnOrVaFileNumberNoHintSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const spouseVeteranIdUI = ssnOrVaFileNumberNoHintUI();
spouseVeteranIdUI['ui:description'] =
  'You must enter a Social Security number or VA file number';
spouseVeteranIdUI['ui:required'] = () => true;
spouseVeteranIdUI.ssn['ui:title'] = "Spouse's Social Security number";
spouseVeteranIdUI.vaFileNumber['ui:title'] = "Spouse's VA file number";

export default {
  uiSchema: {
    ...titleUI('Spouse Veteran information'),
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
