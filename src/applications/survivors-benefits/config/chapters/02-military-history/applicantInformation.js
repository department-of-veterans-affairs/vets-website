import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameSchema,
  ssnUI,
  ssnSchema,
  serviceNumberUI,
  serviceNumberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import applicantDescription from 'platform/forms/components/ApplicantDescription';
// TODO: Update vets-json-scheme with our version of fullSchemaPensions.
// import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { parse, isValid, startOfDay, subYears } from 'date-fns';
import UnauthenticatedWarningAlert from '../../../components/UnauthenticatedWarningAlert';
import { isSameOrAfter } from '../../../utils/helpers';
import { benefitsIntakeFullNameUI } from './helpers';

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
  title: 'Applicant information',
  path: 'applicant/information',
  updateFormData: setDefaultIsOver65,
  uiSchema: {
    ...titleUI('Veteran name'),
    'ui:description': applicantDescription,
    'view:warningAlert': {
      'ui:description': UnauthenticatedWarningAlert,
    },
    veteranFullName: benefitsIntakeFullNameUI(),
    veteranSocialSecurityNumber: ssnUI(),
    veteranServiceNumber: serviceNumberUI('Service number'),
    veteranDateOfBirth: dateOfBirthUI({
      monthSelect: false,
    }),
  },
  schema: {
    type: 'object',
    required: [
      'veteranFullName',
      'veteranSocialSecurityNumber',
      'veteranDateOfBirth',
      'veteranServiceNumber',
    ],
    properties: {
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
      veteranFullName: fullNameSchema,
      veteranSocialSecurityNumber: ssnSchema,
      veteranServiceNumber: serviceNumberSchema,
      /* Do $ref definitions work here? Would it make sense to pull the definition from the vets-json-schema file */
      veteranDateOfBirth: dateOfBirthSchema,
    },
  },
};
