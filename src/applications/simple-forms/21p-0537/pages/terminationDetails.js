import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const terminationDateUI = currentOrPastDateUI();
terminationDateUI['ui:title'] = 'Date of termination';
terminationDateUI['ui:required'] = () => true;

export default {
  uiSchema: {
    ...titleUI('Termination details'),
    remarriage: {
      terminationDate: terminationDateUI,
      terminationReason: textUI({
        title: 'Reason for termination (i.e., death, divorce)',
        required: () => true,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      remarriage: {
        type: 'object',
        required: ['terminationDate', 'terminationReason'],
        properties: {
          terminationDate: currentOrPastDateSchema,
          terminationReason: textSchema,
        },
      },
    },
  },
};
