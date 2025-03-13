import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  dateOfBirthSchema,
  dateOfBirthUI,
  selectSchema,
  serviceNumberSchema,
  serviceNumberUI,
  ssnSchema,
  ssnUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import React from 'react';
import VaSelectField from '~/platform/forms-system/src/js/web-component-fields/VaSelectField';
import {
  branchesOfService,
  CHAPTER_3,
  suffixes,
  yesNoOptions,
} from '../../constants';
import { isBranchOfServiceRequired } from '../helpers';

const ssnServiceInfo = (
  <div className="vads-u-margin-bottom--neg2p5">
    <p className="vads-u-margin-bottom--1">
      <span className="vads-u-font-weight--bold">
        Social Security or service number
      </span>
      <span className="form-required-span">(*Required)</span>
    </p>
    <span className="vads-u-margin-y--0 vads-u-font-size--sm medium-screen:vads-u-font-size--root">
      Please provide one of the following:
    </span>
  </div>
);

export const validateSSandSNGroup = (errors, values, formData) => {
  if (
    !(
      (formData.whoIsYourQuestionAbout === 'Someone else' &&
        formData.relationshipToVeteran ===
          "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)") ||
      (formData.whoIsYourQuestionAbout === 'Someone else' &&
        formData.relationshipToVeteran ===
          "I'm a family member of a Veteran") ||
      formData.whoIsYourQuestionAbout === "It's a general question"
    ) &&
    !Object.keys(values).some(key => values[key])
  ) {
    errors.addError(
      `Please enter your Social Security number or Service number`,
    );
  }
};

export const personalInformationFormSchemas = {
  first: {
    type: 'string',
    pattern: '^[A-Za-z]+$',
    minLength: 1,
    maxLength: 25,
  },
  middle: {
    type: 'string',
    pattern: '^[A-Za-z]+$',
    minLength: 1,
    maxLength: 25,
  },
  last: { type: 'string', pattern: '^[A-Za-z]+$', minLength: 1, maxLength: 25 },
  suffix: selectSchema(suffixes),
  isVeteranDeceased: yesNoSchema,
  socialOrServiceNum: {
    type: 'object',
    properties: {
      ssn: ssnSchema,
      serviceNumber: serviceNumberSchema,
    },
    required: [],
  },
  dateOfBirth: dateOfBirthSchema,
  branchOfService: selectSchema(branchesOfService),
};

export const aboutYourselfGeneralSchema = {
  first: {
    type: 'string',
    pattern: '^[A-Za-z]+$',
    minLength: 1,
    maxLength: 25,
  },
  middle: {
    type: 'string',
    pattern: '^[A-Za-z]+$',
    minLength: 1,
    maxLength: 25,
  },
  last: { type: 'string', pattern: '^[A-Za-z]+$', minLength: 1, maxLength: 25 },
  suffix: selectSchema(suffixes),
};

export const personalInformationUiSchemas = {
  first: {
    'ui:title': 'First name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'given-name',
    'ui:required': () => true,
    'ui:errorMessages': { required: 'Please enter a first name' },
  },
  middle: {
    'ui:title': 'Middle name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'additional-name',
  },
  last: {
    'ui:title': 'Last name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'family-name',
    'ui:required': () => true,
    'ui:errorMessages': { required: 'Please enter a last name' },
  },
  suffix: {
    'ui:title': 'Suffix',
    'ui:webComponentField': VaSelectField,
    'ui:autocomplete': 'honorific-suffix',
    'ui:options': {
      widgetClassNames: 'form-select-medium',
      hideEmptyValueInReview: true,
    },
  },
  isVeteranDeceased: yesNoUI({
    title: CHAPTER_3.VET_DECEASED.TITLE,
    labels: yesNoOptions,
    required: () => true,
    errorMessages: {
      required: 'Please let us know if the Veteran is deceased',
    },
  }),
  socialOrServiceNum: {
    'ui:title': ssnServiceInfo,
    'ui:validations': [validateSSandSNGroup],
    'ui:options': { showFieldLabel: true },
    ssn: ssnUI(),
    serviceNumber: serviceNumberUI('Service number'),
  },
  dateOfBirth: { ...dateOfBirthUI(), 'ui:required': () => true },
  branchOfService: {
    'ui:title': 'Branch of service',
    'ui:webComponentField': VaSelectField,
    'ui:options': {
      hideIf: formData => !isBranchOfServiceRequired(formData),
    },
  },
};

export const personalInformationAboutYourselfUiSchemas = {
  first: {
    'ui:title': 'First name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'given-name',
    'ui:required': () => true,
    'ui:errorMessages': { required: 'Please enter a first name' },
    'ui:options': {
      uswds: true,
    },
  },
  middle: {
    'ui:title': 'Middle name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'additional-name',
    'ui:options': {
      uswds: true,
    },
  },
  last: {
    'ui:title': 'Last name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'family-name',
    'ui:required': () => true,
    'ui:errorMessages': { required: 'Please enter a last name' },
    'ui:options': {
      uswds: true,
    },
  },
  suffix: {
    'ui:title': 'Suffix',
    'ui:webComponentField': VaSelectField,
    'ui:autocomplete': 'honorific-suffix',
    'ui:options': {
      uswds: true,
      widgetClassNames: 'form-select-medium',
      hideEmptyValueInReview: true,
    },
  },
  socialOrServiceNum: {
    'ui:title': ssnServiceInfo,
    'ui:validations': [validateSSandSNGroup],
    'ui:options': {
      showFieldLabel: true,
      hideIf: formData =>
        (formData.whoIsYourQuestionAbout === 'Someone else' &&
          formData.relationshipToVeteran ===
            "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)") ||
        (formData.whoIsYourQuestionAbout === 'Someone else' &&
          formData.relationshipToVeteran ===
            "I'm a family member of a Veteran") ||
        formData.whoIsYourQuestionAbout === "It's a general question",
    },
    ssn: ssnUI(),
    serviceNumber: serviceNumberUI('Service number'),
  },
  dateOfBirth: {
    ...dateOfBirthUI(),
    'ui:required': formData =>
      !(
        (formData.whoIsYourQuestionAbout === 'Someone else' &&
          formData.relationshipToVeteran ===
            "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)") ||
        (formData.whoIsYourQuestionAbout === 'Someone else' &&
          formData.relationshipToVeteran ===
            "I'm a family member of a Veteran") ||
        formData.whoIsYourQuestionAbout === "It's a general question"
      ),
    'ui:options': {
      uswds: true,
      hideIf: formData =>
        (formData.whoIsYourQuestionAbout === 'Someone else' &&
          formData.relationshipToVeteran ===
            "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)") ||
        (formData.whoIsYourQuestionAbout === 'Someone else' &&
          formData.relationshipToVeteran ===
            "I'm a family member of a Veteran") ||
        formData.whoIsYourQuestionAbout === "It's a general question",
    },
  },
  branchOfService: {
    'ui:title': 'Branch of service',
    'ui:webComponentField': VaSelectField,
    'ui:required': formData => isBranchOfServiceRequired(formData),
    'ui:options': {
      uswds: true,
      hideIf: formData => !isBranchOfServiceRequired(formData),
    },
  },
};

export const aboutYourselfGeneralUISchema = {
  first: {
    'ui:title': 'First name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'given-name',
    'ui:required': () => true,
    'ui:errorMessages': { required: 'Please enter a first name' },
    'ui:options': {
      uswds: true,
    },
  },
  middle: {
    'ui:title': 'Middle name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'additional-name',
    'ui:options': {
      uswds: true,
    },
  },
  last: {
    'ui:title': 'Last name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'family-name',
    'ui:required': () => true,
    'ui:errorMessages': { required: 'Please enter a last name' },
    'ui:options': {
      uswds: true,
    },
  },
  suffix: {
    'ui:title': 'Suffix',
    'ui:webComponentField': VaSelectField,
    'ui:autocomplete': 'honorific-suffix',
    'ui:options': {
      uswds: true,
      widgetClassNames: 'form-select-medium',
      hideEmptyValueInReview: true,
    },
  },
};
