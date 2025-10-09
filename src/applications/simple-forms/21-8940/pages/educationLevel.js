import {
  selectUI,
  selectSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    educationLevel: selectUI({
      title: 'What is the highest level of education you have completed?',
      labelHeaderLevel: '1', // Since this is a minimal form and field serves as page title
      labels: {
        firstGrade: { label: 'First grade', group: 'Grade school' },
        secondGrade: { label: 'Second grade', group: 'Grade school' },
        thirdGrade: { label: 'Third grade', group: 'Grade school' },
        fourthGrade: { label: 'Fourth grade', group: 'Grade school' },
        fifthGrade: { label: 'Fifth grade', group: 'Grade school' },
        sixthGrade: { label: 'Sixth grade', group: 'Middle school' },
        seventhGrade: { label: 'Seventh grade', group: 'Middle school' },
        eighthGrade: { label: 'Eighth grade', group: 'Middle school' },
        ninthGrade: { label: 'Ninth grade', group: 'High school' },
        tenthGrade: { label: 'Tenth grade', group: 'High school' },
        eleventhGrade: { label: 'Eleventh grade', group: 'High school' },
        twelfthGrade: { label: 'Twelfth grade', group: 'High school' },
        freshman: { label: 'Freshman', group: 'College' },
        sophomore: { label: 'Sophomore', group: 'College' },
        junior: { label: 'Junior', group: 'College' },
        senior: { label: 'Senior', group: 'College' },
      },
      errorMessages: {
        required: 'Select your highest level of education completed',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      educationLevel: selectSchema([
        'firstGrade',
        'secondGrade',
        'thirdGrade',
        'fourthGrade',
        'fifthGrade',
        'sixthGrade',
        'seventhGrade',
        'eighthGrade',
        'ninthGrade',
        'tenthGrade',
        'eleventhGrade',
        'twelfthGrade',
        'freshman',
        'sophomore',
        'junior',
        'senior',
      ]),
    },
    required: ['educationLevel'],
  },
};
