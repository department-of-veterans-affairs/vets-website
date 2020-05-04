import { TASK_KEYS } from '../../../constants';
import { isChapterFieldRequired } from '../../../helpers';
import { report674 } from '../../../utilities';

export const schema = report674.properties.studentNetworthInformation;

export const uiSchema = {
  studentDoesHaveNetworth: {
    'ui:required': formData =>
      isChapterFieldRequired(formData, TASK_KEYS.report674),
    'ui:title': 'Does the student have savings, investments, property, etc?',
    'ui:widget': 'yesNo',
  },
  studentNetworthInformation: {
    'ui:options': {
      expandUnder: 'studentDoesHaveNetworth',
      expandUnderCondition: true,
    },
    savings: {
      'ui:title': 'Student’s savings',
      'ui:required': formData => formData.studentDoesHaveNetworth,
      'ui:errorMessages': {
        required: 'Please enter a value',
        pattern: 'Please enter a number',
      },
    },
    securities: {
      'ui:title': 'Student’s securities, bonds, etc.',
      'ui:required': formData => formData.studentDoesHaveNetworth,
      'ui:errorMessages': {
        required: 'Please enter a value',
        pattern: 'Please enter a number',
      },
    },
    realEstate: {
      'ui:title': 'Value of student’s real estate',
      'ui:required': formData => formData.studentDoesHaveNetworth,
      'ui:errorMessages': {
        required: 'Please enter a value',
        pattern: 'Please enter a number',
      },
    },
    otherAssets: {
      'ui:title': 'All of student’s other assets',
      'ui:required': formData => formData.studentDoesHaveNetworth,
      'ui:errorMessages': {
        required: 'Please enter a value',
        pattern: 'Please enter a number',
      },
    },
    remarks: {
      'ui:title': 'Remarks about student’s networth',
      'ui:widget': 'textarea',
    },
  },
};
