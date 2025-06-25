import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  radioUI,
  radioSchema,
  titleUI,
  titleSchema,
  selectUI,
  selectSchema,
  textUI,
  textSchema,
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

export const claimType = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${
          formData?.certifierRole === 'applicant' ? 'Your' : 'Beneficiary’s'
        } claim type`,
    ),
    claimType: radioUI({
      title: 'What type of claim was the original submission for?',
      labels: {
        medical: 'Medical claim',
        pharmacy: 'Pharmacy claim',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['claimType'],
    properties: {
      titleSchema,
      claimType: radioSchema(['medical', 'pharmacy']),
    },
  },
};

export const claimDetails = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${
          formData?.certifierRole === 'applicant' ? 'Your' : 'Beneficiary’s'
        } claim details`,
      'Enter the details for your claim to help us find your original claim.',
    ),
    providerName: textUI('Provider name'),
    beginningDateOfService: {
      ...currentOrPastDateUI({
        title: 'Beginning date of service',
        hint: '',
      }),
    },
    endDateOfService: {
      ...currentOrPastDateUI({
        title: 'End date of service date',
        hint:
          'Enter end date of service if service occurred over multiple days',
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['providerName', 'beginningDateOfService', 'endDateOfService'],
    properties: {
      titleSchema,
      providerName: textSchema,
      beginningDateOfService: currentOrPastDateSchema,
      endDateOfService: currentOrPastDateSchema,
    },
  },
};
