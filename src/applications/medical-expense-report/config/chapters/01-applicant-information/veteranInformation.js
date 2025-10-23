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
import { parse, isValid, startOfDay, subYears } from 'date-fns';
import { isSameOrAfter } from '../../../utils/helpers';

export function isOver65(formData, currentDate) {
  const today = currentDate || new Date();
  const veteranDateOfBirth = parse(
    formData.veteranDateOfBirth,
    'yyyy-MM-dd',
    new Date(),
  );

  if (!isValid(veteranDateOfBirth)) return undefined;

  return isSameOrAfter(
    startOfDay(subYears(today, 65)),
    startOfDay(veteranDateOfBirth),
  );
}

export function setDefaultIsOver65(oldData, newData, currentDate) {
  if (oldData.veteranDateOfBirth !== newData.veteranDateOfBirth) {
    const today = currentDate || new Date();
    return {
      ...newData,
      isOver65: isOver65(newData, today),
    };
  }
  return newData;
}

/** @type {PageSchema} */
export default {
  updateFormData: setDefaultIsOver65,
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        formData?.claimantNotVeteran
          ? 'Veteran information'
          : 'Your information',
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
        hint: 'Enter your VA file number if it doesn’t match your SSN',
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
