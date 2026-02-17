import {
  dateOfBirthSchema,
  currentOrPastDateUI,
  fullNameSchema,
  fullNameUI,
  titleUI,
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  VaTextInputField,
  VaSelectField,
} from 'platform/forms-system/src/js/web-component-fields';
import { setDefaultIsOver65 } from './helpers';

const updatedFullNameSchema = fullNameSchema;
updatedFullNameSchema.properties.first.maxLength = 40;
updatedFullNameSchema.properties.last.maxLength = 50;

/** @type {PageSchema} */
export default {
  updateFormData: setDefaultIsOver65,
  uiSchema: {
    ...titleUI(({ formData }) =>
      formData?.claimantNotVeteran
        ? 'Veteran’s information'
        : 'Your identification information',
    ),
    veteranFullName: {
      ...fullNameUI(),
      first: {
        'ui:title': 'First or given name',
        'ui:webComponentField': VaTextInputField,
        'ui:required': formData => formData.claimantNotVeteran === true,
        'ui:errorMessages': {
          required: 'Enter a first or given name',
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
        'ui:title': 'Last or family name',
        'ui:webComponentField': VaTextInputField,
        'ui:required': formData => formData.claimantNotVeteran === true,
        'ui:errorMessages': {
          required: 'Enter a last or family name',
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
    veteranSocialSecurityNumber: ssnOrVaFileNumberUI(),
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
      veteranFullName: { ...updatedFullNameSchema, required: [] },
      veteranSocialSecurityNumber: ssnOrVaFileNumberSchema,
      veteranDateOfBirth: dateOfBirthSchema,
    },
  },
};
