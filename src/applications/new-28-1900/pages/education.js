import {
  selectSchema,
  selectUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { YOUR_INFORMATION_PAGES_CONSTANTS } from '../constants';

const educationOptions = [
  { key: 'firstGrade', label: '1st grade' },
  { key: 'secondGrade', label: '2nd grade' },
  { key: 'thirdGrade', label: '3rd grade' },
  { key: 'fourthGrade', label: '4th grade' },
  { key: 'fifthGrade', label: '5th grade' },
  { key: 'sixthGrade', label: '6th grade' },
  { key: 'seventhGrade', label: '7th grade' },
  { key: 'eighthGrade', label: '8th grade' },
  { key: 'ninthGrade', label: '9th grade' },
  { key: 'tenthGrade', label: '10th grade' },
  { key: 'eleventhGrade', label: '11th grade' },
  { key: 'twelfthGrade', label: '12th grade' },
  { key: 'twelfthGradeOrGED', label: '12th grade or GED' },
  { key: 'someOrAllOfCollege', label: 'Some or all of college' },
  { key: 'someOrAllOfGraduateSchool', label: 'Some or all of graduate school' },
];

const labels = Object.fromEntries(
  educationOptions.map(({ key, label }) => [key, label]),
);
const labelsList = educationOptions.map(({ key }) => key);

const selectUIInput = {
  title: '- Select -',
  labels,
  errorMessages: {
    required: 'Please select your years of education.',
  },
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(YOUR_INFORMATION_PAGES_CONSTANTS.educationPageTitle),
    yearsOfEducation: selectUI(selectUIInput),
  },
  schema: {
    type: 'object',
    properties: {
      yearsOfEducation: selectSchema(labelsList),
    },
    required: ['yearsOfEducation'],
  },
};
