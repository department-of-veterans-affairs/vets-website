import { replaceStrValues } from './helpers';
import content from '../locales/en/content.json';

export const ADDRESS_REGEX = {
  county: () => {
    const disallowList = [
      'US',
      'U.S',
      'U.S.',
      'USA',
      'U.SA',
      'U.S.A',
      'U.S.A.',
      'United States',
      'UnitedStates',
      'United States of America',
      'UnitedStatesOfAmerica',
    ];
    return `^(?!(${disallowList.join('|')})$)`;
  },
};

export const ALLOWED_FILE_TYPES = ['pdf', 'jpg', 'jpeg', 'png'];

export const API_ENDPOINTS = {
  facilities: '/caregivers_assistance_claims/facilities',
};

export const DOWNLOAD_ERRORS_BY_CODE = {
  '5': content['alert-download-message--500'],
  generic: content['alert-download-message--generic'],
};

export const MAX_FILE_SIZE_MB = 10;

export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const REQUIRED_ADDRESS_FIELDS = [
  'street',
  'city',
  'state',
  'postalCode',
  'county',
];

export const SIGNATURE_CERTIFICATION_STATEMENTS = {
  veteran: [content['certification-statement--vet']],
  primary: [
    content['certification-statement--caregiver-1'],
    replaceStrValues(
      content['certification-statement--caregiver-2'],
      'Primary',
    ),
    content['certification-statement--caregiver-3'],
    replaceStrValues(
      content['certification-statement--caregiver-4'],
      'Primary',
    ),
    replaceStrValues(
      content['certification-statement--caregiver-5'],
      'Primary',
    ),
    content['certification-statement--caregiver-6'],
  ],
  secondary: [
    content['certification-statement--caregiver-1'],
    replaceStrValues(
      content['certification-statement--caregiver-2'],
      'Secondary',
    ),
    content['certification-statement--caregiver-3'],
    replaceStrValues(
      content['certification-statement--caregiver-4'],
      'Secondary',
    ),
    replaceStrValues(
      content['certification-statement--caregiver-5'],
      'Secondary',
    ),
    content['certification-statement--caregiver-6'],
  ],
  representative: [
    content['certification-statement--rep-1'],
    content['certification-statement--rep-2'],
  ],
};
