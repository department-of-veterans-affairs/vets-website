import { validateDate } from 'platform/forms-system/src/js/validation';
import { isChapterFieldRequired } from '../../../helpers';
import { report674 } from '../../../utilities';

export const schema = report674.properties.studentTermDates;

export const uiSchema = {
  currentTermDates: {
    'ui:title': 'Term or course dates',
    officialSchoolStartDate: {
      'ui:title': 'Official start date',
      'ui:widget': 'date',
      'ui:validations': [validateDate],
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:errorMessages': {
        pattern: 'Please enter a valid date',
        required: 'Please enter a date',
      },
    },
    expectedStudentStartDate: {
      'ui:title': 'Date student expects to start',
      'ui:widget': 'date',
      'ui:validations': [validateDate],
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:errorMessages': {
        pattern: 'Please enter a valid date',
        required: 'Please enter a date',
      },
    },
    expectedGraduationDate: {
      'ui:title': 'Date student expects to graduate',
      'ui:widget': 'date',
      'ui:validations': [validateDate],
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:errorMessages': {
        pattern: 'Please enter a valid date',
        required: 'Please enter a date',
      },
    },
  },
  programInformation: {
    studentIsEnrolledFullTime: {
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:widget': 'yesNo',
      'ui:title':
        'Is the student enrolled full-time in high school or college?',
      'ui:errorMessages': { required: 'Please select an option' },
    },
    courseOfStudy: {
      'ui:required': formData =>
        !formData?.programInformation?.studentIsEnrolledFullTime,
      'ui:options': {
        expandUnder: 'studentIsEnrolledFullTime',
        expandUnderCondition: false,
      },
      'ui:title': 'Course of study or educational program',
      'ui:errorMessages': { required: 'Please enter a course or program name' },
    },
    classesPerWeek: {
      'ui:required': formData =>
        !formData?.programInformation?.studentIsEnrolledFullTime,
      'ui:options': {
        expandUnder: 'studentIsEnrolledFullTime',
        expandUnderCondition: false,
      },
      'ui:title': 'Number of classes a week',
      'ui:errorMessages': { required: 'Please enter a number' },
    },
    hoursPerWeek: {
      'ui:required': formData =>
        !formData?.programInformation?.studentIsEnrolledFullTime,
      'ui:options': {
        expandUnder: 'studentIsEnrolledFullTime',
        expandUnderCondition: false,
      },
      'ui:title': 'Hours a week',
      'ui:errorMessages': { required: 'Please enter a number' },
    },
  },
};
