import { createSelector } from 'reselect';
import { merge, omit } from 'lodash';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import _ from 'platform/utilities/data';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import ReviewCardField from '@department-of-veterans-affairs/platform-forms-system/ReviewCardField';
import AddressViewField from '@department-of-veterans-affairs/platform-forms-system/AddressViewField';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

import {
  validateMilitaryCity,
  validateMilitaryState,
  validateZIP,
} from '../validations';

import {
  MILITARY_CITIES,
  MILITARY_STATE_LABELS,
  MILITARY_STATE_VALUES,
  STATE_LABELS,
  STATE_VALUES,
  MAX_FILE_SIZE_BYTES,
  MAX_PDF_FILE_SIZE_BYTES,
  USA,
  NULL_CONDITION_STRING,
} from '../constants';

import {
  capitalizeEachWord,
  disabilityIsSelected,
  isClaimingIncrease,
  isClaimingNew,
  pathWithIndex,
  sippableId,
} from './index';

const createCheckboxSchema = (schema, disabilityName) => {
  const capitalizedDisabilityName =
    typeof disabilityName === 'string'
      ? capitalizeEachWord(disabilityName)
      : NULL_CONDITION_STRING;
  return _.set(
    // As an array like this to prevent periods in the name being interpreted as nested objects
    [sippableId(disabilityName)],
    { title: capitalizedDisabilityName, type: 'boolean' },
    schema,
  );
};

/**
 * Create the checkbox schema for new disabilities if user has selected
 * New claim type
 */
export const makeSchemaForNewDisabilities = createSelector(
  formData => (isClaimingNew(formData) ? formData.newDisabilities : []),
  (newDisabilities = []) => ({
    properties: newDisabilities
      .map(disability => disability.condition)
      .reduce(createCheckboxSchema, {}),
  }),
);

/**
 * Create the checkbox schema for rated disabilities based if user has selected
 * Increase claim type
 */
export const makeSchemaForRatedDisabilities = createSelector(
  formData => (isClaimingIncrease(formData) ? formData.ratedDisabilities : []),
  (ratedDisabilities = []) => ({
    properties: ratedDisabilities
      .filter(disabilityIsSelected)
      .map(disability => disability.name)
      .reduce(createCheckboxSchema, {}),
  }),
);

/**
 * Dynamically creates the checkbox schema for new conditions and/or rated
 * disabilities, based on the claim type user has selected
 */
export const makeSchemaForAllDisabilities = createSelector(
  makeSchemaForNewDisabilities,
  makeSchemaForRatedDisabilities,
  (newDisabilitiesSchema, ratedDisabilitiesSchema) =>
    merge({}, newDisabilitiesSchema, ratedDisabilitiesSchema),
);

/**
 * Returns the uiSchema for addresses that use the non-common address schema as found
 *  in the 526EZ-all-claims schema.
 * @param {string} addressPath - The path to the address in the formData
 * @param {string} [title] - Displayed as the card title in the card's header
 * @param {boolean} reviewCard - Whether to display the information in a ReviewCardField or not
 * @param {boolean} fieldsAreRequired - Whether the typical fields should be required or not
 * @returns {object} - UI schema for an address card's content
 */
export const addressUISchema = (
  addressPath,
  title,
  reviewCard,
  fieldsAreRequired = true,
) => {
  const updateStates = (formData, currentSchema, uiSchema, index) => {
    // Could use path (updateSchema callback param after index), but it points to `state`,
    //  so using `addressPath` is easier
    const currentCity = _.get(
      `${pathWithIndex(addressPath, index)}.city`,
      formData,
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

  return {
    'ui:order': [
      'country',
      'addressLine1',
      'addressLine2',
      'addressLine3',
      'city',
      'state',
      'zipCode',
    ],
    'ui:title': title,
    'ui:field': reviewCard && ReviewCardField,
    'ui:options': {
      viewComponent: AddressViewField,
    },
    country: {
      'ui:title': 'Country',
      'ui:autocomplete': 'country',
    },
    addressLine1: {
      'ui:title': 'Street address',
      'ui:autocomplete': 'address-line1',
      'ui:errorMessages': {
        pattern: 'Please enter a valid street address',
        required: 'Please enter a street address',
      },
    },
    addressLine2: {
      'ui:title': 'Street address line 2',
      'ui:autocomplete': 'address-line2',
      'ui:errorMessages': {
        pattern: 'Please enter a valid street address',
      },
    },
    addressLine3: {
      'ui:title': 'Street address line 3',
      'ui:autocomplete': 'address-line3',
      'ui:errorMessages': {
        pattern: 'Please enter a valid street address',
      },
    },
    city: {
      'ui:title': 'City',
      'ui:autocomplete': 'address-level2',
      'ui:validations': [
        {
          options: { addressPath },
          // pathWithIndex is called in validateMilitaryCity
          validator: validateMilitaryCity,
        },
      ],
      'ui:errorMessages': {
        pattern: 'Please enter a valid city',
        required: 'Please enter a city',
      },
    },
    state: {
      'ui:title': 'State',
      'ui:autocomplete': 'address-level1',
      'ui:required': (formData, index) =>
        fieldsAreRequired &&
        _.get(`${pathWithIndex(addressPath, index)}.country`, formData, '') ===
          USA,
      'ui:options': {
        hideIf: (formData, index) =>
          _.get(
            `${pathWithIndex(addressPath, index)}.country`,
            formData,
            '',
          ) !== USA,
        updateSchema: updateStates,
      },
      'ui:validations': [
        {
          options: { addressPath },
          // pathWithIndex is called in validateMilitaryState
          validator: validateMilitaryState,
        },
      ],
      'ui:errorMessages': {
        pattern: 'Please enter a valid state',
        required: 'Please enter a state',
      },
    },
    zipCode: {
      'ui:title': 'Postal code',
      'ui:autocomplete': 'postal-code',
      'ui:validations': [validateZIP],
      'ui:required': (formData, index) =>
        fieldsAreRequired &&
        _.get(`${pathWithIndex(addressPath, index)}.country`, formData, '') ===
          USA,
      'ui:errorMessages': {
        required: 'Please enter a postal code',
        pattern:
          'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
      },
      'ui:options': {
        widgetClassNames: 'va-input-medium-large',
        hideIf: (formData, index) =>
          _.get(
            `${pathWithIndex(addressPath, index)}.country`,
            formData,
            '',
          ) !== USA,
      },
    },
  };
};

const ptsdAddressOmitions = [
  'addressLine1',
  'addressLine2',
  'addressLine3',
  'postalCode',
  'zipCode',
];

/**
 * @param {string} addressPath - The path to the address in the formData
 */
export function incidentLocationUISchema(addressPath) {
  const addressUIConfig = omit(
    addressUISchema(addressPath, null, false, false),
    ptsdAddressOmitions,
  );
  return {
    ...addressUIConfig,
    state: {
      ...addressUIConfig.state,
      'ui:title': 'State/Province',
    },
    additionalDetails: {
      'ui:title':
        'Additional details (This could include an address, landmark, military installation, or other location.)',
      'ui:widget': 'textarea',
    },
    'ui:order': ['country', 'state', 'city', 'additionalDetails'],
  };
}

export const ancillaryFormUploadUi = (
  label,
  itemDescription,
  {
    attachmentId = '',
    widgetType = 'select',
    customClasses = '',
    isDisabled = false,
    buttonText = '',
    addAnotherLabel = 'Add Another',
  } = {},
) => {
  // a11y focus management. Move focus to select after upload
  // see va.gov-team/issues/19688
  const findAndFocusLastSelect = () => {
    // focus on last document type select since all new uploads are appended
    const lastSelect = [...document.querySelectorAll('select')].slice(-1);
    if (lastSelect.length) {
      focusElement(lastSelect[0]);
    }
  };
  return fileUploadUI(label, {
    itemDescription,
    hideLabelText: !label,
    fileUploadUrl: `${environment.API_URL}/v0/upload_supporting_evidence`,
    buttonText,
    addAnotherLabel,
    fileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'txt'],
    // not sure what to do here... we need to differentiate pdf vs everything
    // else; the check is in the actions.js > uploadFile function
    maxSize: MAX_FILE_SIZE_BYTES,
    maxPdfSize: MAX_PDF_FILE_SIZE_BYTES,
    minSize: 1,
    createPayload: (file, _formId, password) => {
      const payload = new FormData();
      payload.append('supporting_evidence_attachment[file_data]', file);
      if (password) {
        payload.append('supporting_evidence_attachment[password]', password);
      }
      return payload;
    },
    parseResponse: (response, file) => {
      setTimeout(() => {
        findAndFocusLastSelect();
      });
      return {
        name: file.name,
        confirmationCode: response.data.attributes.guid,
        attachmentId,
      };
    },
    attachmentSchema: ({ fileId }) => ({
      'ui:title': 'File type',
      'ui:disabled': isDisabled,
      'ui:widget': widgetType,
      'ui:options': {
        widgetProps: {
          'aria-describedby': fileId,
        },
      },
    }),
    classNames: customClasses,
    attachmentName: false,
  });
};

export const getAttachmentsSchema = defaultAttachmentId => {
  const { attachments } = fullSchema.properties;
  return _.set(
    'items.properties.attachmentId.default',
    defaultAttachmentId,
    attachments,
  );
};
