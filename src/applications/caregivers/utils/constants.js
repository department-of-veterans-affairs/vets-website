import { mapValues } from 'lodash';
import facilities from 'vets-json-schema/dist/caregiverProgramFacilities.json';
import { createUSAStateLabels } from 'platform/forms-system/src/js/helpers';
import { states } from 'platform/forms/address';
import { replaceStrValues } from './helpers';
import content from '../locales/en/content.json';

export const ALLOWED_FILE_TYPES = ['pdf', 'jpg', 'jpeg', 'png'];

export const DOWNLOAD_ERRORS_BY_CODE = {
  '5': content['alert-download-message--500'],
  default: content['alert-download-message--default'],
};

export const MAX_FILE_SIZE_MB = 10;

export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const MED_CENTER_LABELS = Object.keys(facilities).reduce(
  (labels, state) => {
    const stateLabels = facilities[state].reduce(
      (centers, center) =>
        Object.assign(centers, {
          [center.code]: center.label,
        }),
      {},
    );

    return Object.assign(labels, stateLabels);
  },
  {},
);

export const MED_CENTERS_BY_STATE = mapValues(facilities, val =>
  val.map(c => c.code),
);

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

export const STATE_LABELS = createUSAStateLabels(states);
