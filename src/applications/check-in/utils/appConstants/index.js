import { stateList } from './stateList';

const APP_NAMES = Object.freeze({
  CHECK_IN: 'dayOf',
  PRE_CHECK_IN: 'preCheckIn',
});

// Taken from https://dsva.slack.com/archives/C022AC2STBM/p1631650347300600?thread_ts=1631210248.227300&cid=C022AC2STBM
const VISTA_CHECK_IN_STATUS_IENS = Object.freeze({
  PRE_CHECK_IN_STARTED: 1,
  PRE_CHECK_IN_COMPLETE: 2,
  CHECK_IN_STARTED: 3,
  CHECK_IN_COMPLETE: 4,
  E_CHECK_IN_STARTED: 5,
  E_CHECK_IN_COMPLETE: 6,
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

const baseCities = [
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
      options: {
        required: true,
      },
    },
    {
      name: 'street2',
      label: 'Street address line 2',
      type: 'text',
    },
    {
      name: 'street3',
      label: 'Street address line 3',
      type: 'text',
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
      options: {
        required: true,
      },
    },
    {
      name: 'state',
      label: 'State',
      type: 'select',
      options: {
        required: true,
        options: stateList,
      },
    },
    {
      name: 'zip',
      label: 'Zip code',
      type: 'text',
      options: {
        required: true,
        inputMode: 'numeric',
        maxLength: '5',
        extraValidation: zipCodeValid,
      },
    },
  ],
  OUTSIDE_US: [
    {
      name: 'street1',
      label: 'Street address',
      type: 'text',
      options: {
        required: true,
      },
    },
    {
      name: 'street2',
      label: 'Street address line 2',
      type: 'text',
    },
    {
      name: 'street3',
      label: 'Street address line 3',
      type: 'text',
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
      options: {
        required: true,
      },
    },
    {
      name: 'province',
      label: 'State/Province/Region',
      type: 'text',
      options: {
        required: true,
      },
    },
    {
      name: 'internationalPostalCode',
      label: 'International postal code',
      type: 'text',
      options: {
        required: true,
      },
    },
  ],
  BASE: [
    {
      name: 'street1',
      label: 'Street address',
      type: 'text',
      options: {
        required: true,
      },
    },
    {
      name: 'street2',
      label: 'Street address line 2',
      type: 'text',
    },
    {
      name: 'street3',
      label: 'Street address line 3',
      type: 'text',
    },
    {
      name: 'city',
      label: 'APO/FPO/DPO',
      type: 'select',
      options: {
        required: true,
        options: baseCities,
      },
    },
    {
      name: 'state',
      label: 'State',
      type: 'select',
      options: {
        required: true,
        options: baseStates,
      },
    },
    {
      name: 'zip',
      label: 'Zip code',
      type: 'text',
      options: {
        required: true,
        inputMode: 'numeric',
        maxLength: '5',
        extraValidation: zipCodeValid,
      },
    },
  ],
});

const phoneNumbers = {
  textCheckIn: '53079',
  mainInfo: '8006982411',
  btsssCallCenter: '8555747292',
  veteransCrisisLine: '988',
  veteransCrisisText: '838255',
  tty: '711',
  emergency: '911',
};

export {
  APP_NAMES,
  VISTA_CHECK_IN_STATUS_IENS,
  getLabelForEditField,
  addressFormFields,
  baseCities,
  phoneNumbers,
};
