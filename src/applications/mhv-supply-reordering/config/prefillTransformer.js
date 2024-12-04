import constants from 'vets-json-schema/dist/constants.json';

// constants.countries = [
//   {
//     'value': 'USA',
//     'label': 'United States',
//   },
//   ...
// ]

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
  let country = getValue(permanentAddress?.country, constants.countries);
  let isMilitary = !!getLabel(
    permanentAddress?.state,
    constants.militaryStates,
  );
  if (country) {
    permanentAddress = {
      ...permanentAddress,
      country,
      isMilitary,
    };
  }

  country = getValue(temporaryAddress?.country, constants.countries);
  isMilitary = !!getLabel(temporaryAddress?.state, constants.militaryStates);
  if (country) {
    temporaryAddress = {
      ...temporaryAddress,
      country,
      isMilitary,
    };
  }

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
