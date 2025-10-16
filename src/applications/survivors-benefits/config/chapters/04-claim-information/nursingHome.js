import {
  arrayBuilderItemFirstPageTitleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...arrayBuilderItemFirstPageTitleUI({
    title: 'Nursing home or increased survivor entitlement',
  }),
  needRegularAssistance: radioUI({
    title:
      'Are you claiming special monthly pension or special monthly D.I.C. because you need the regular assistance of another person, have severe visual problems, or are generally confined to your immediate premises? (*Required)',
    classNames: 'vads-u-margin-bottom--2',
  }),
  inNursingHome: radioUI({
    title: 'Are you in a nursing home? (*Required)',
  }),
};

const schema = {
  type: 'object',
  properties: {
    needRegularAssistance: radioSchema(['YES', 'NO']),
    inNursingHome: radioSchema(['YES', 'NO']),
  },
  required: ['needRegularAssistance', 'inNursingHome'],
};

export default {
  uiSchema,
  schema,
};
