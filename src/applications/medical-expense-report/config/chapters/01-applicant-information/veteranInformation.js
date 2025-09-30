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

// TODO: Update vets-json-scheme with our version of fullSchemaPensions.
// import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { parse, isValid, startOfDay, subYears } from 'date-fns';
import { isSameOrAfter } from '../../../utils/helpers';
import { prefixedFullNameUI } from '../../definitions';
// import { benefitsIntakeFullNameUI } from './helpers';

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
  title: 'Veteran information',
  path: 'applicant/information',
  updateFormData: setDefaultIsOver65,
  uiSchema: {
    ...titleUI(
      formData =>
        formData.claimantNotVeteran
          ? 'Claimant information'
          : 'Veteran information',
    ),
    veteranFullName: {
      ...prefixedFullNameUI({ label: 'Veteran' }),
      'ui:options': {
        hideIf: formData => formData.claimantNotVeteran === false,
      },
    },
    veteranSocialSecurityNumber: ssnUI('Veteran’s Social Security number'),
    // TODO: Uncomment if we want to use vaClaimsHistory
    // vaClaimsHistory: yesNoUI({
    //   title: 'Have you ever filed a claim with VA?',
    //   classNames: 'vads-u-margin-bottom--2',
    // }),
    vaFileNumber: {
      ...vaFileNumberUI(),
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
    required: [
      'veteranFullName',
      'veteranSocialSecurityNumber',
      'veteranDateOfBirth',
    ],
    properties: {
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
      veteranFullName: fullNameSchema,
      veteranSocialSecurityNumber: ssnSchema,
      // TODO: Uncomment if we want to use vaClaimsHistory
      // vaClaimsHistory,
      /* Do $ref definitions work here? Would it make sense to pull the definition from the vets-json-schema file */
      vaFileNumber: vaFileNumberSchema,
      veteranDateOfBirth: dateOfBirthSchema,
    },
  },
};
