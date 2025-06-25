import {
  titleUI,
  titleSchema,
  selectUI,
  selectSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const claimIdentifyingNumberOptions = [
  'PDI number',
  'Claim control number',
];

export const claimIdentifyingNumber = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${
          formData?.certifierRole === 'applicant' ? 'Your' : 'Beneficiary’s'
        } claim identifying number`,
      'The PDI number or claim control number is used to identify the original claim that was submitted. These can be found on the letter you received from CHAMPVA requesting further action on your claim.',
    ),
    pdiOrClaimNumber: selectUI({
      title: 'Is this a PDI or claim control number?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      pdiOrClaimNumber: selectSchema(claimIdentifyingNumberOptions),
    },
  },
};
