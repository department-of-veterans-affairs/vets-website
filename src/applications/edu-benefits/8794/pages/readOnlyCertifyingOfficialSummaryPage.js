import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

const arrayBuilderOptions = {
  arrayPath: 'readOnlyCertifyingOfficials',
  nounSingular: 'certifying official',
  nounPlural: 'certifying officials',
  required: false,
  text: { getItemName: item => item.fullName },
};

const readOnlyCertifyingOfficialSummaryPage = {
  uiSchema: {
    hasReadOnlyCertifyingOfficial: arrayBuilderYesNoUI(
      arrayBuilderOptions,
      {
        title: 'Do you have any read-only certifying officials to add?',
        labels: { Y: 'Yes', N: 'No' },
        errorMessages: { required: 'Please provide a response' },
        hint: () => null,
      },

      /* ── AFTER ≥ 1 official is on the list ────────────────── */
      {
        title:
          'Do you have another read-only school certifying official to add?',
        labels: { Y: 'Yes', N: 'No' },
        errorMessages: {
          required: 'Select yes if you have another certifying official to add',
        },
        hint: () => null,
      },
    ),
  },
  schema: {
    type: 'object',
    properties: { hasReadOnlyCertifyingOfficial: arrayBuilderYesNoSchema },
    required: ['hasReadOnlyCertifyingOfficial'],
  },
};

export { readOnlyCertifyingOfficialSummaryPage, arrayBuilderOptions };
