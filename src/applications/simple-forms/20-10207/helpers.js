import { PREPARER_TYPES } from './config/constants';

export function getMockData(mockData, isLocalhost) {
  return !!mockData && isLocalhost() && !window.Cypress ? mockData : undefined;
}

export function getPersonalInformationChapterTitle(formData) {
  const { preparerType } = formData;
  const { THIRD_PARTY_NON_VETERAN, THIRD_PARTY_VETERAN } = PREPARER_TYPES;

  switch (preparerType) {
    case THIRD_PARTY_VETERAN:
      return 'Veteran’s personal information';
    case THIRD_PARTY_NON_VETERAN:
      return 'Claimant’s personal information';
    default:
      return 'Your personal information';
  }
}
