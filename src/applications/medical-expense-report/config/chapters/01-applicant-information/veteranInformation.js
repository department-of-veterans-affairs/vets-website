// @ts-check
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
    ...titleUI('Veteran information'),
    veteranFullName: {
      ...fullNameUI(),
      first: {
        'ui:title': 'First name',
        'ui:required': formData => formData.claimantNotVeteran === true,
        'ui:errorMessages': {
          required: 'Enter a first name',
        },
        'ui:options': {
          hideIf: formData => formData.claimantNotVeteran === false,
        },
      },
      middle: {
        'ui:title': 'Middle name',
        'ui:options': {
          hideIf: formData => formData.claimantNotVeteran === false,
        },
      },
      last: {
        'ui:title': 'Last name',
        'ui:required': formData => formData.claimantNotVeteran === true,
        'ui:errorMessages': {
          required: 'Enter a last name',
        },
        'ui:options': {
          hideIf: formData => formData.claimantNotVeteran === false,
        },
      },
      suffix: {
        'ui:title': 'Suffix',
        'ui:options': {
          hideIf: formData => formData.claimantNotVeteran === false,
        },
      },
    },
    veteranSocialSecurityNumber: {
      ...ssnUI('Social Security number'),
      'ui:errorMessages': {
        pattern:
          'Please enter a valid 9 digit Social Security number (dashes allowed)',
        required: 'Enter a Social Security number',
      },
    },
    vaFileNumber: {
      ...vaFileNumberUI('VA file number'),
      'ui:options': {
        hint: 'Enter your VA file number if it doesn’t match your SSN',
      },
    },
    veteranDateOfBirth: currentOrPastDateUI({
      title: 'Date of birth',
      monthSelect: false,
      errorMessages: {
        required: 'Enter a date of birth',
      },
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
