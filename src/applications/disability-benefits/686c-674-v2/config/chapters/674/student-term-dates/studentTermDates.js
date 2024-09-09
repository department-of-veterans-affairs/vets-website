import { validateDate } from 'platform/forms-system/src/js/validation';
import {
  isChapterFieldRequired,
  classesPerWeekUiSchema,
  hoursPerWeekUiSchema,
} from '../../../helpers';
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
    courseOfStudy: {
      'ui:required': formData =>
        !formData?.programInformation?.studentIsEnrolledFullTime,
      'ui:options': {
        expandUnder: 'studentIsEnrolledFullTime',
        expandUnderCondition: false,
      },
      'ui:title': 'Subject or educational/training program',
      'ui:errorMessages': { required: 'Enter a course or program name' },
    },
    classesPerWeek: {
      ...classesPerWeekUiSchema,
      'ui:required': formData =>
        !formData?.programInformation?.studentIsEnrolledFullTime,
      'ui:options': {
        expandUnder: 'studentIsEnrolledFullTime',
        expandUnderCondition: false,
        widgetClassNames: 'form-select-medium',
      },
    },
    hoursPerWeek: {
      ...hoursPerWeekUiSchema,
      'ui:required': formData =>
        !formData?.programInformation?.studentIsEnrolledFullTime,
      'ui:options': {
        expandUnder: 'studentIsEnrolledFullTime',
        expandUnderCondition: false,
        widgetClassNames: 'form-select-medium',
      },
    },
  },
};
