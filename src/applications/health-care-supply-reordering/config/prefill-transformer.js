import {
  countryNameToValue,
  isMilitaryState,
  isTerritory,
} from '../utils/addresses';

const cleanEmptyAddressFields = address => {
  if (!address || typeof address !== 'object') {
    return address;
  }

  const fieldsToClean = [
    'street',
    'street2',
    'city',
    'state',
    'postalCode',
    'country',
  ];

  const cleanedAddress = { ...address };

  fieldsToClean.forEach(fieldName => {
    if (cleanedAddress[fieldName] === '') {
      cleanedAddress[fieldName] = undefined;
    }
  });

  return cleanedAddress;
};

export default function prefillTransformer(pages, formData, metadata) {
  const newFormData = formData;

  for (const addressType of ['permanentAddress', 'temporaryAddress']) {
    if (newFormData[addressType]?.country) {
      newFormData[addressType].country =
        countryNameToValue(formData[addressType].country) ?? 'USA';
      if (isTerritory(formData[addressType].country)) {
        newFormData[addressType].country = 'USA';
      }
    }
    if (newFormData[addressType]) {
      newFormData[addressType].isMilitary = isMilitaryState(
        formData[addressType]?.state,
      );
    }
    if (newFormData[addressType]?.street2) {
      newFormData[addressType].street2 =
        newFormData[addressType].street2.trim() !== ','
          ? newFormData[addressType].street2
          : undefined;
    }
  }

  // Clean empty strings from temporaryAddress
  if (newFormData.temporaryAddress) {
    newFormData.temporaryAddress = cleanEmptyAddressFields(
      newFormData.temporaryAddress,
    );
  }

  return {
    pages,
    formData: newFormData,
    metadata,
  };
}
