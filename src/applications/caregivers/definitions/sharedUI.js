import { merge } from 'lodash';
import {
  textUI,
  radioUI,
  selectUI,
  dateOfBirthUI,
  addressUI as platformAddressUI,
  fullNameUI as fullNameWithSuffixUI,
  phoneUI as platformPhoneUI,
  emailUI as platformEmailUI,
  ssnUI as platformSsnUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { genderLabels } from 'platform/static-data/labels';
import {
  validateSsnIsUnique,
  validateAddressFields,
  validateCountyInput,
} from '../utils/validation';
import { setAddressCountry, replaceStrValues } from '../utils/helpers';
import AddressWithAutofill from '../components/FormFields/AddressWithAutofill';
import CustomReviewField from '../components/FormReview/CustomReviewField';
import content from '../locales/en/content.json';

export const addressUI = props => {
  const {
    label,
    hint = null,
    requireCounty = false,
    countyDescription = null,
  } = props;
  return merge({}, platformAddressUI({ omit: ['isMilitary', 'street3'] }), {
    country: {
      'ui:options': {
        hideOnReview: true,
        updateSchema: setAddressCountry,
      },
    },
    street: {
      'ui:title': replaceStrValues(content['vet-address-street-label'], label),
      'ui:options': { hint },
    },
    county: textUI({
      title: content['vet-address-county-label'],
      hint: content['form-address-county-hint'],
      description: countyDescription,
      reviewField: CustomReviewField,
      required: () => requireCounty,
      validations: [validateCountyInput],
      errorMessages: {
        required: content['validation-address--county-required'],
      },
    }),
  });
};

export const addressWithAutofillUI = () => ({
  'ui:field': AddressWithAutofill,
  'ui:validations': [validateAddressFields],
  'ui:options': {
    hideTextLabel: true,
  },
});

export const dobUI = label =>
  dateOfBirthUI(replaceStrValues(content['form-dob-label'], label));

export const emailUI = label =>
  platformEmailUI(replaceStrValues(content['form-email-label'], label));

export const fullNameUI = ({ label, labelAlt }) =>
  merge({}, fullNameWithSuffixUI(title => `${label} ${title}`), {
    first: {
      'ui:options': {
        hint: replaceStrValues(content['form-name-hint'], labelAlt || label),
      },
    },
  });

export const genderUI = label =>
  radioUI({
    title: replaceStrValues(content['form-birth-sex-label'], label),
    labels: genderLabels,
    hint: replaceStrValues(content['form-birth-sex-hint'], label),
  });

export const phoneUI = label =>
  platformPhoneUI({
    title: replaceStrValues(content['form-phone-label'], label),
    hint: content['form-phone-hint'],
  });

export const ssnUI = ({ label, type }) => {
  const uiToMerge = platformSsnUI(
    replaceStrValues(content[`form-${type}-label`], label),
  );
  return merge({}, uiToMerge, {
    'ui:errorMessages': {
      pattern: content[`validation-${type}-general`],
      required: content[`validation-${type}-general`],
    },
    'ui:validations': [...uiToMerge['ui:validations'], validateSsnIsUnique],
  });
};

export const vetRelationshipUI = label =>
  selectUI({
    title: replaceStrValues(content['form-vet-relationship-label'], label),
  });
