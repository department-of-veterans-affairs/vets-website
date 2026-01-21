import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameSchema,
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import applicantDescription from 'platform/forms/components/ApplicantDescription';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { parse, isValid, startOfDay, subYears } from 'date-fns';
import UnauthenticatedWarningAlert from '../../../containers/UnauthenticatedWarningAlert';
import { isSameOrAfter } from '../../../helpers';
import { benefitsIntakeFullNameUI } from './helpers';

const { vaClaimsHistory } = fullSchemaPensions.properties;

/**
 * Determines if the applicant is over 65 years old
 * @param {object} formData - Full form data
 * @param {Date} currentDate - Date object for comparison
 * @returns {boolean|undefined} True if over 65, false if not, undefined if DOB invalid
 */
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

/**
 * Sets the default value for the isOver65 property based on the veteran's date of birth
 * @param {object} oldData - Previous form data
 * @param {object} newData - Updated form data
 * @param {Date} currentDate - Date object for comparison
 * @returns {object} Updated form data with isOver65 property set
 */
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
  title: 'Applicant information',
  path: 'applicant/information',
  updateFormData: setDefaultIsOver65,
  uiSchema: {
    'ui:description': applicantDescription,
    'view:warningAlert': {
      'ui:description': UnauthenticatedWarningAlert,
    },
    veteranFullName: benefitsIntakeFullNameUI(),
    veteranSocialSecurityNumber: ssnUI(),
    vaClaimsHistory: yesNoUI({
      title: 'Have you ever filed a claim with VA?',
      classNames: 'vads-u-margin-bottom--2',
    }),
    vaFileNumber: {
      ...vaFileNumberUI(),
      'ui:options': {
        hint: 'Enter your VA file number if it doesn’t match your SSN',
      },
    },
    veteranDateOfBirth: dateOfBirthUI({ dataDogHidden: true }),
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
      vaClaimsHistory,
      /* Do $ref definitions work here? Would it make sense to pull the definition from the vets-json-schema file */
      vaFileNumber: vaFileNumberSchema,
      veteranDateOfBirth: dateOfBirthSchema,
    },
  },
};
