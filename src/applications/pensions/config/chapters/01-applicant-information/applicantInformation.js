import moment from 'moment';
import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import applicantDescription from 'platform/forms/components/ApplicantDescription';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import UnauthenticatedWarningAlert from '../../../containers/UnauthenticatedWarningAlert';

const { vaClaimsHistory } = fullSchemaPensions.properties;

export function isOver65(formData, currentDate) {
  const today = currentDate || moment();
  const veteranDateOfBirth = moment(
    formData.veteranDateOfBirth,
    'YYYY-MM-DD',
    true,
  );

  if (!veteranDateOfBirth.isValid()) return undefined;

  return today
    .startOf('day')
    .subtract(65, 'years')
    .isSameOrAfter(veteranDateOfBirth);
}

export function setDefaultIsOver65(oldData, newData, currentDate) {
  if (oldData.veteranDateOfBirth !== newData.veteranDateOfBirth) {
    const today = currentDate || moment();
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
    veteranFullName: fullNameUI(),
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
    veteranDateOfBirth: dateOfBirthUI(),
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
