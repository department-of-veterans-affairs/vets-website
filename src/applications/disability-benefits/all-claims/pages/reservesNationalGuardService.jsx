import { get } from 'lodash';

import fullSchema from '../config/schema';

import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import phoneUI from 'us-forms-system/lib/js/definitions/phone';

import { ReservesGuardDescription } from '../utils';

import {
  MILITARY_CITIES,
  MILITARY_STATE_LABELS,
  MILITARY_STATE_VALUES,
  STATE_LABELS,
  STATE_VALUES,
  USA,
} from '../constants';

function validateMilitaryCity(errors, city, formData) {
  const isMilitaryState = MILITARY_STATE_VALUES.includes(
    formData.serviceInformation.reservesNationalGuardService.unitAddress
      .state || '',
  );
  const isMilitaryCity = MILITARY_CITIES.includes(city.trim().toUpperCase());
  if (isMilitaryState && !isMilitaryCity) {
    errors.addError(
      'City must match APO, DPO, or FPO when using a military state code',
    );
  }
}

function validateMilitaryState(errors, state, formData) {
  const isMilitaryCity = MILITARY_CITIES.includes(
    formData.serviceInformation.reservesNationalGuardService.unitAddress.city
      .trim()
      .toUpperCase(),
  );
  const isMilitaryState = MILITARY_STATE_VALUES.includes(state);
  if (isMilitaryCity && !isMilitaryState) {
    errors.addError('State must be AA, AE, or AP when using a military city');
  }
}

function isValidZIP(value) {
  if (value !== null) {
    return /^\d{5}(?:(?:[-\s])?\d{4})?$/.test(value);
  }
  return true;
}

function validateZIP(errors, zip) {
  if (zip && !isValidZIP(zip)) {
    errors.addError('Please enter a valid 9 digit ZIP (dashes allowed)');
  }
}

const updateStates = form => {
  const currentCity = get(
    form,
    'serviceInformation.reservesNationalGuardService.unitAddress.city',
    '',
  )
    .trim()
    .toUpperCase();
  if (MILITARY_CITIES.includes(currentCity)) {
    return {
      enum: MILITARY_STATE_VALUES,
      enumNames: MILITARY_STATE_LABELS,
    };
  }

  return {
    enum: STATE_VALUES,
    enumNames: STATE_LABELS,
  };
};
const {
  unitPhone,
  unitAddress,
  unitName,
  obligationTermOfServiceDateRange,
} = fullSchema.properties.serviceInformation.properties.reservesNationalGuardService.properties;

export const uiSchema = {
  'ui:title': 'Reserves and National Guard Information',
  'ui:description': ReservesGuardDescription,
  serviceInformation: {
    reservesNationalGuardService: {
      obligationTermOfServiceDateRange: dateRangeUI(
        'Obligation start date',
        'Obligation end date',
        'End date must be after start date',
      ),
      unitName: {
        'ui:title': 'Unit name',
      },
      unitAddress: {
        'ui:title': 'Unit address',
        'ui:order': [
          'country',
          'addressLine1',
          'addressLine2',
          'addressLine3',
          'city',
          'state',
          'zipCode',
        ],
        country: {
          'ui:title': 'Country',
        },
        addressLine1: {
          'ui:title': 'Street address',
        },
        addressLine2: {
          'ui:title': 'Street address (optional)',
        },
        addressLine3: {
          'ui:title': 'Street address (optional)',
        },
        city: {
          'ui:title': 'City',
          'ui:validations': [validateMilitaryCity],
        },
        state: {
          'ui:title': 'State',
          'ui:required': formData =>
            get(
              formData,
              'serviceInformation.reservesNationalGuardService.unitAddress.country',
              USA,
            ) === USA,
          'ui:options': {
            hideIf: formData =>
              get(
                formData,
                'serviceInformation.reservesNationalGuardService.unitAddress.country',
                USA,
              ) !== USA,
            updateSchema: updateStates,
          },
          'ui:validations': [
            {
              validator: validateMilitaryState,
            },
          ],
        },
        zipCode: {
          'ui:title': 'ZIP code',
          'ui:validations': [validateZIP],
          'ui:required': formData =>
            get(
              formData,
              'serviceInformation.reservesNationalGuardService.unitAddress.country',
              USA,
            ) === USA,
          'ui:errorMessages': {
            pattern:
              'Please enter a valid 5- or 9-digit ZIP code (dashes allowed)',
          },
          'ui:options': {
            widgetClassNames: 'va-input-medium-large',
            hideIf: formData =>
              get(
                formData,
                'serviceInformation.reservesNationalGuardService.unitAddress.country',
                USA,
              ) !== USA,
          },
        },
      },
      unitPhone: phoneUI('Unit phone number'),
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    serviceInformation: {
      type: 'object',
      properties: {
        reservesNationalGuardService: {
          type: 'object',
          properties: {
            obligationTermOfServiceDateRange,
            unitName,
            unitAddress,
            unitPhone,
          },
        },
      },
    },
  },
};
