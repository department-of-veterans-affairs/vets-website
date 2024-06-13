import merge from 'lodash/merge';
import omit from 'lodash/omit';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { validateDate } from 'platform/forms-system/src/js/validation';
import { isChapterFieldRequired } from '../../../helpers';
import { report674 } from '../../../utilities';

const studentAddressMarriageTuition = omit(
  report674.properties.studentAddressMarriageTuition,
  [
    'properties.address',
    'properties.marriageDate',
    'properties.tuitionIsPaidByGovAgency',
    'properties.wasMarried',
  ],
);

merge(report674.properties.studentTermDates.properties.currentTermDates, {
  type: 'object',
  properties: {
    ...studentAddressMarriageTuition.properties,
    isSchoolAccredited: {
      type: 'boolean',
    },
  },
});

export const schema = omit(report674.properties.studentTermDates, [
  'properties.programInformation.properties.classesPerWeek',
  'properties.programInformation.properties.hoursPerWeek',
  'properties.programInformation.properties.courseOfStudy',
]);

export const uiSchema = {
  currentTermDates: {
    'ui:title': 'Term or course dates',
    'ui:order': [
      'agencyName',
      'datePaymentsBegan',
      'isSchoolAccredited',
      'officialSchoolStartDate',
      'expectedStudentStartDate',
      'expectedGraduationDate',
    ],
    agencyName: {
      'ui:title': 'Agency name',
      'ui:required': formData =>
        formData?.studentAddressMarriageTuition?.tuitionIsPaidByGovAgency,
      'ui:errorMessages': {
        required:
          'Enter the goverment agency paying tuition or education allowance',
      },
      'ui:options': {
        hideIf: form =>
          !form?.studentAddressMarriageTuition?.tuitionIsPaidByGovAgency,
      },
    },
    datePaymentsBegan: {
      'ui:title': 'Date payments began',
      ...currentOrPastDateUI('Date payments began'),
      ...{
        'ui:required': formData =>
          formData?.studentAddressMarriageTuition?.tuitionIsPaidByGovAgency,
      },
      'ui:options': {
        hideIf: form =>
          !form?.studentAddressMarriageTuition?.tuitionIsPaidByGovAgency,
      },
    },
    isSchoolAccredited: {
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:widget': 'yesNo',
      'ui:title': 'Is the school accredited?',
      'ui:errorMessages': { required: 'Select an option' },
    },
    officialSchoolStartDate: {
      'ui:title': 'Official start date',
      'ui:widget': 'date',
      'ui:validations': [validateDate],
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:errorMessages': {
        pattern: 'Enter a valid date',
        required: 'Enter a date',
      },
    },
    expectedStudentStartDate: {
      'ui:title': 'Date student expects to start',
      'ui:widget': 'date',
      'ui:validations': [validateDate],
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:errorMessages': {
        pattern: 'Enter a valid date',
        required: 'Enter a date',
      },
    },
    expectedGraduationDate: {
      'ui:title': 'Date student expects to graduate',
      'ui:widget': 'date',
      'ui:validations': [validateDate],
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:errorMessages': {
        pattern: 'Enter a valid date',
        required: 'Enter a date',
      },
    },
  },
  programInformation: {
    studentIsEnrolledFullTime: {
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:widget': 'yesNo',
      'ui:title':
        'Is the student enrolled full-time in high school or college?',
      'ui:description':
        'Complete this section if the student is enrolled in an education/training program other than high school or college, or if the student will attend high school or college less than full-time.',
      'ui:errorMessages': { required: 'Select an option' },
    },
  },
};
