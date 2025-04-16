import {
  numberSchema,
  numberUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { YOUR_INFORMATION_CHAPTER_CONSTANTS } from '../constants';

export default {
  uiSchema: {
    ...titleUI(
      YOUR_INFORMATION_CHAPTER_CONSTANTS.yearsOfCollegeOrGraduateStudiesPageTitle,
    ),
    yearsOfCollegeOrGraduateStudies: numberUI({
      title: 'How many years of college did you complete?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      yearsOfCollegeOrGraduateStudies: numberSchema,
    },
    required: ['yearsOfCollegeOrGraduateStudies'],
  },
};
