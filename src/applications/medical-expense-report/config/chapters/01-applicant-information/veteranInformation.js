import {
  dateOfBirthSchema,
  currentOrPastDateUI,
  fullNameSchema,
  fullNameUI,
  ssnUI,
  ssnSchema,
  titleUI,
  vaFileNumberUI,
  vaFileNumberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  VaTextInputField,
  VaSelectField,
} from 'platform/forms-system/src/js/web-component-fields';
import { setDefaultIsOver65 } from './helpers';

/** @type {PageSchema} */
export default {
  updateFormData: setDefaultIsOver65,
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        formData?.claimantNotVeteran
          ? 'Veteran’s information'
          : 'Your identification information',
    ),
    veteranFullName: {
      ...fullNameUI(),
      first: {
        'ui:title': 'First name',
        'ui:webComponentField': VaTextInputField,
        'ui:required': formData => formData.claimantNotVeteran === true,
        'ui:errorMessages': {
          required: 'Please enter a first name',
        },
        'ui:options': {
          hideIf: formData => formData.claimantNotVeteran === false,
        },
      },
      middle: {
        'ui:title': 'Middle name',
        'ui:webComponentField': VaTextInputField,
        'ui:options': {
          hideIf: formData => formData.claimantNotVeteran === false,
        },
      },
      last: {
        'ui:title': 'Last name',
        'ui:webComponentField': VaTextInputField,
        'ui:required': formData => formData.claimantNotVeteran === true,
        'ui:errorMessages': {
          required: 'Please enter a last name',
        },
        'ui:options': {
          hideIf: formData => formData.claimantNotVeteran === false,
        },
      },
      suffix: {
        'ui:title': 'Suffix',
        'ui:webComponentField': VaSelectField,
        'ui:options': {
          hideIf: formData => formData.claimantNotVeteran === false,
        },
      },
    },
    veteranSocialSecurityNumber: ssnUI(),
    vaFileNumber: {
      ...vaFileNumberUI('VA file number'),
      'ui:options': {
        hint:
          'You must enter either a VA file number or Social Security number.',
      },
    },
    veteranDateOfBirth: currentOrPastDateUI({
      title: 'Date of birth',
      monthSelect: false,
    }),
  },
  schema: {
    type: 'object',
    required: ['veteranSocialSecurityNumber', 'veteranDateOfBirth'],
    properties: {
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
      veteranFullName: { ...fullNameSchema, required: [] },
      veteranSocialSecurityNumber: ssnSchema,
      vaFileNumber: vaFileNumberSchema,
      veteranDateOfBirth: dateOfBirthSchema,
    },
  },
};
