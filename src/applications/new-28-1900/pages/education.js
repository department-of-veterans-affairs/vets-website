import {
  selectSchema,
  selectUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { YOUR_INFORMATION_CHAPTER_CONSTANTS } from '../constants';

const educationOptions = [
  { key: '10', label: 'Some high school' },
  { key: '12', label: 'High school / GED' },
  { key: '14', label: 'Some college' },
  { key: '15', label: 'Associate degree' },
  { key: '17', label: "Bachelor's degree" },
  { key: '19', label: "Master's degree or higher" },
];

const labels = Object.fromEntries(
  educationOptions.map(({ key, label }) => [key, label]),
);
const labelsList = educationOptions.map(({ key }) => key);

const selectUIInput = {
  title: "What's the highest level of school you've completed?",
  labels,
  errorMessages: {
    required: 'Select the highest level of school you’ve completed.',
  },
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(YOUR_INFORMATION_CHAPTER_CONSTANTS.educationPageTitle),
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
