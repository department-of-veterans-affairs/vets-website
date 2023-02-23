import AdditionalInfoDescription from '../widgets/AdditionalInfoDescription';
import TextareaWidget from '../widgets/TextareaWidget';

// we're not using constants-fullSchema imports and related patterns here
// remarks is a top-level field in the schema -- no required or properties keys
export default {
  uiSchema: {
    remarks: {
      'ui:title':
        'Please describe any service-connected conditions you may have due to your military service. If you have a VA Decision Rating, please include that as well.',
      'ui:description': AdditionalInfoDescription({
        customClass: 'additional-info-description-wrapper',
        id: 'additionalInfoDescriptionWrapper',
        testId: 'additionalInfoDescriptionWrapper',
      }),
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
