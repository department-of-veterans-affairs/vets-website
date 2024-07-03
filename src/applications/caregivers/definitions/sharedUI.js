import { merge } from 'lodash';
import get from 'platform/utilities/data/get';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
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
import { validateSsnIsUnique, requireAddressFields } from '../utils/validation';
import { replaceStrValues } from '../utils/helpers';
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
        updateSchema: (formData, _schema, uiSchema, _index, path) => {
          const USA = { value: 'USA', label: 'United States' };
          const addressPath = path.slice(0, -1);
          const countryUI = uiSchema;
          const addressFormData = get(addressPath, formData) ?? {};
          countryUI['ui:options'].inert = true;
          addressFormData.country = USA.value;
          return {
            enum: [USA.value],
            enumNames: [USA.label],
            default: USA.value,
          };
        },
      },
    },
    street: {
      'ui:title': replaceStrValues(content['vet-address-street-label'], label),
      'ui:options': { hint },
    },
    county: {
      'ui:title': content['vet-address-county-label'],
      'ui:description': countyDescription,
      'ui:webComponentField': VaTextInputField,
      'ui:reviewField': CustomReviewField,
      'ui:required': () => requireCounty,
    },
  });
};

export const addressWithAutofillUI = () => ({
  'ui:field': AddressWithAutofill,
  'ui:validations': [requireAddressFields],
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
