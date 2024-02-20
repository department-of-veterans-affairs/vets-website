import { PREPARER_TYPES } from './constants';

export default function prefillTransformer(pages, formData, metadata) {
  // TODO: once backend prefill is implemented, refactor to
  // remove test-data with incoming prefill data
  const { preparerType } = formData;
  const newFormData = {
    ...formData,
    fullName: {
      first: 'John',
      middle: '',
      last: 'Preparer',
    },
    dateOfBirth: '1985-01-01',
    placeOfBirth: 'Washington, DC',
    address: {
      street: '123 Any St',
      city: 'Washington',
      state: 'DC',
      postalCode: '54321',
      country: 'USA',
    },
    homePhone: '1234567890',
  };

  if (preparerType === PREPARER_TYPES.CITIZEN) {
    newFormData.citizenId = {
      ssn: '333221111',
    };
  }

  return {
    pages,
    formData: newFormData,
    metadata,
  };
}
