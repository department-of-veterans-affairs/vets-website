const APP_NAMES = Object.freeze({
  CHECK_IN: 'dayOf',
  PRE_CHECK_IN: 'preCheckIn',
});

const EDITING_PAGE_NAMES = Object.freeze({
  DEMOGRAPHICS: 'demographics',
  NEXT_OF_KIN: 'nextOfKin',
  EMERGENCY_CONTACT: 'emergencyContact',
});

const getLabelForEditField = (
  field,
  options = { capitalizeFirstLetter: false },
) => {
  let rv = 'phone';
  if (field === 'homePhone') {
    rv = 'home phone';
  }
  if (field === 'mobilePhone') {
    rv = 'mobile phone';
  }
  if (field === 'workPhone') {
    rv = 'work phone';
  }
  if (field === 'address') {
    rv = 'address';
  }
  if (field === 'homeAddress') {
    rv = 'home address';
  }
  if (field === 'mailingAddress') {
    rv = 'mailing address';
  }
  if (options.capitalizeFirstLetter) {
    rv = rv.charAt(0).toUpperCase() + rv.slice(1);
  }
  return rv;
};

const countries = [
  {
    key: 'USA',
    value: 'USA',
    label: 'USA',
  },
  {
    key: 'other',
    value: 'other',
    label: 'Other',
  },
];

const usStates = [
  {
    key: 'az',
    value: 'Arizona',
    label: 'AZ',
  },
  {
    key: 'al',
    value: 'Alabama',
    label: 'AL',
  },
  {
    key: 'nm',
    value: 'New Mexico',
    label: 'NM',
  },
];

const apoFpoDpo = [
  {
    key: 'apo',
    value: 'APO',
    label: 'APO',
  },
  {
    key: 'fpo',
    value: 'FPO',
    label: 'FPO',
  },
  {
    key: 'dpo',
    value: 'DPO',
    label: 'DPO',
  },
];

const baseStates = [
  {
    key: 'aa',
    value: 'AA',
    label: 'Armed Forces Americas (AA)',
  },
  {
    key: 'AP',
    value: 'AP',
    label: 'Armed Forces Pacific (AP)',
  },
  {
    key: 'AE',
    value: 'AE',
    label: 'Armed Forces Europe (AE)',
  },
];

const zipCodeValid = zip => {
  if (!zip.match(/^[0-9]+$/) || zip.length !== 5) {
    return { valid: false, msg: 'Zip code must be 5 digits' };
  }

  return { valid: true };
};

const addressFormFields = Object.freeze({
  US: [
    {
      name: 'street1',
      label: 'Street address',
      type: 'text',
      required: true,
    },
    {
      name: 'street2',
      label: 'Street address line 2',
      type: 'text',
      required: false,
    },
    {
      name: 'street3',
      label: 'Street address line 3',
      type: 'text',
      required: false,
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
      required: true,
    },
    {
      name: 'state',
      label: 'State',
      type: 'select',
      required: true,
      options: usStates,
    },
    {
      name: 'zip',
      label: 'Zip code',
      type: 'text',
      required: true,
      inputMode: 'numeric',
      maxLength: '5',
      extraValidation: zipCodeValid,
    },
  ],
  OUTSIDE_US: [
    {
      name: 'street1',
      label: 'Street address',
      type: 'text',
      required: true,
    },
    {
      name: 'street2',
      label: 'Street address line 2',
      type: 'text',
      required: false,
    },
    {
      name: 'street3',
      label: 'Street address line 3',
      type: 'text',
      required: false,
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
      required: true,
    },
    {
      name: 'province',
      label: 'State/Province/Region',
      type: 'text',
      required: true,
    },
    {
      name: 'internationalPostalCode',
      label: 'International postal code',
      type: 'text',
      required: true,
    },
  ],
  BASE: [
    {
      name: 'street1',
      label: 'Street address',
      type: 'text',
      required: true,
    },
    {
      name: 'street2',
      label: 'Street address line 2',
      type: 'text',
      required: false,
    },
    {
      name: 'street3',
      label: 'Street address line 3',
      type: 'text',
      required: false,
    },
    {
      name: 'city',
      label: 'APO/FPO/DPO',
      type: 'select',
      required: true,
      options: apoFpoDpo,
    },
    {
      name: 'state',
      label: 'State',
      type: 'select',
      required: true,
      options: baseStates,
    },
    {
      name: 'zip',
      label: 'Zip code',
      type: 'text',
      required: true,
      inputMode: 'numeric',
      maxLength: '5',
      extraValidation: zipCodeValid,
    },
  ],
});

export {
  APP_NAMES,
  EDITING_PAGE_NAMES,
  getLabelForEditField,
  addressFormFields,
  countries,
  baseStates,
};
