// @ts-check
import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameSchema,
  ssnUI,
  ssnSchema,
  titleUI,
  vaFileNumberUI,
  vaFileNumberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { parse, isValid, startOfDay, subYears } from 'date-fns';
import { isSameOrAfter } from '../../../utils/helpers';
import { conditionalVeteranNameUI } from './helpers';

// const { vaClaimsHistory } = fullSchemaPensions.properties;

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
    veteranFullName: conditionalVeteranNameUI(title => `Veteran's ${title}`),
    veteranSocialSecurityNumber: ssnUI('Veteran’s Social Security number'),
    vaFileNumber: {
      ...vaFileNumberUI('Veteran’s VA file number'),
      'ui:options': {
        hint: 'Enter your VA file number if it doesn’t match your SSN',
      },
    },
    veteranDateOfBirth: dateOfBirthUI({
      title: 'Veteran’s date of birth',
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
