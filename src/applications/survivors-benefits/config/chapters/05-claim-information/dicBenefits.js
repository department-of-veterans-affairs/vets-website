import {
  radioUI,
  radioSchema,
  arrayBuilderItemFirstPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const dicOptions = {
  DIC: 'D.I.C.',
  DIC_1151:
    'D.I.C. under U.S.C. 1151 (Note: D.I.C. under 38 U.S.C. is a rare benefit. Please refer to the Instructions page 5 for guidance on 38 U.S.C. 1151)',
  DIC_REEVALUATION:
    'D.I.C. due to claimant election of a re-evaluation of a previously denied claim based on expanded eligibility under PL 117-168 (PACT Act)',
};

const uiSchema = {
  ...arrayBuilderItemFirstPageTitleUI({ title: 'D.I.C. benefits' }),
  'view:dicType': radioUI({
    title:
      'What Dependency and indemnity compensation (D.I.C.) benefit are you claiming? (*Required)',
    labels: dicOptions,
    classNames: 'vads-u-margin-bottom--2',
  }),
};

const schema = {
  type: 'object',
  properties: {
    'view:dicType': radioSchema(Object.keys(dicOptions)),
  },
  required: ['view:dicType'],
};

export default {
  uiSchema,
  schema,
};
