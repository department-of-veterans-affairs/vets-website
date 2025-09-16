import {
  ssnOrVaFileNumberNoHintUI,
  ssnOrVaFileNumberNoHintSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const ssnVaFileUI = ssnOrVaFileNumberNoHintUI();
ssnVaFileUI['ui:title'] =
  'In reply refer to your VA file number or Social Security number';

export default {
  uiSchema: {
    ...titleUI('Your identification'),
    recipient: {
      ssnOrVaFileNumber: ssnVaFileUI,
    },
  },
  schema: {
    type: 'object',
    properties: {
      recipient: {
        type: 'object',
        properties: {
          ssnOrVaFileNumber: ssnOrVaFileNumberNoHintSchema,
        },
      },
    },
  },
};
