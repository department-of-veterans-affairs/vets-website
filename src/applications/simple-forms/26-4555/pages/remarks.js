import AdditionalInfoDescription from '../widgets/AdditionalInfoDescription';
import TextareaWidget from '../widgets/TextareaWidget';

// we're not using constants-fullSchema imports and related patterns here
// remarks is a top-level field in the schema -- no required or properties keys
const remarks = {
  uiSchema: {
    remarks: {
      'ui:title':
        'Please describe any service-connected conditions you may have due to your military service. If you have a VA Decision Rating, please include that as well.',
      'ui:description': AdditionalInfoDescription,
      'ui:widget': TextareaWidget,
      'ui:options': {
        rows: 8,
      },
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      remarks: {
        type: 'string',
      },
    },
  },
};

export default remarks;
