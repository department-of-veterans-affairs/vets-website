import constants from 'vets-json-schema/dist/constants.json';

// constants.countries = [
//   {
//     'value': 'USA',
//     'label': 'United States',
//   },
//   ...
// ]

const countries = [
  ...constants.countries,
  {
    value: 'USA',
    label: 'ARMED FORCES AF,EU,ME,CA',
  },
];

// constants.states.USA = [  // includes territories
//   {
//     'value': 'AL',
//     'label': 'Alabama',
//   },
//   ...
// ]

// constants.militaryCities = [
//   {
//     'value': 'APO',
//     'label': 'Army Post Office',
//   },
//   ...
// ]

// constants.militaryStates = [
//   {
//     'value': 'AA',
//     'label': 'Armed Forces Americas (AA)',
//   },
//   ...
// ]

const getValue = (label, arr) => {
  if (!label) return undefined;
  return arr.find(el => el.label.toUpperCase() === label.toUpperCase())?.value;
};

const getLabel = (value, arr) => {
  if (!value) return undefined;
  return arr.find(el => el.value === value)?.label;
};

const prefillTransformer = (pages, formData, metadata) => {
  const emailAddress = formData?.vetEmail || formData?.emailAddress;

  let { permanentAddress = {}, temporaryAddress = {} } = formData;
  let country = getValue(permanentAddress?.country, countries);
  let street2 =
    permanentAddress?.street2?.trim() === ','
      ? undefined
      : permanentAddress?.street2;
  let isMilitary = !!getLabel(
    permanentAddress?.state,
    constants.militaryStates,
  );
  permanentAddress = {
    ...permanentAddress,
    street2,
    country,
    isMilitary,
  };

  country = getValue(temporaryAddress?.country, countries);
  street2 =
    temporaryAddress?.street2?.trim() === ','
      ? undefined
      : temporaryAddress?.street2;
  isMilitary = !!getLabel(temporaryAddress?.state, constants.militaryStates);
  temporaryAddress = {
    ...temporaryAddress,
    street2,
    country,
    isMilitary,
  };

  return {
    pages,
    formData: {
      ...formData,
      emailAddress,
      permanentAddress,
      temporaryAddress,
    },
    metadata,
  };
};

export default prefillTransformer;
