import { TASK_KEYS } from '../../../constants';
import { isChapterFieldRequired } from '../../../helpers';
import { StudentNameHeader } from '../helpers';

export const schema = {
  type: 'object',
  properties: {
    studentDoesHaveNetworth: {
      type: 'boolean',
    },
    networthInformation: {
      type: 'object',
      properties: {
        savings: {
          type: 'string',
          pattern: '^\\d{6}',
        },
        securities: {
          type: 'string',
          pattern: '^\\d{6}',
        },
        realEstate: {
          type: 'string',
          pattern: '^\\d{6}',
        },
        otherAssets: {
          type: 'string',
          pattern: '^\\d{6}',
        },
        remarks: {
          type: 'string',
          maxLength: 500,
          pattern: '^(?!\\s)(?!.*?\\s{2,})[^<>%$#@!^&*]+$',
        },
      },
    },
  },
};

export const uiSchema = {
  'ui:title': StudentNameHeader,
  studentDoesHaveNetworth: {
    'ui:required': formData =>
      isChapterFieldRequired(formData, TASK_KEYS.report674),
    'ui:title': 'Does the student have savings, investments, property, etc?',
    'ui:widget': 'yesNo',
  },
  networthInformation: {
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
      'ui:title': 'Value of student’s real estate.',
      'ui:required': formData => formData.studentDoesHaveNetworth,
      'ui:errorMessages': {
        required: 'Please enter a value',
        pattern: 'Please enter a number',
      },
    },
    otherAssets: {
      'ui:title': 'All of student’s assets.',
      'ui:required': formData => formData.studentDoesHaveNetworth,
      'ui:errorMessages': {
        required: 'Please enter a value',
        pattern: 'Please enter a number',
      },
    },
    remarks: {
      'ui:title': 'All of student’s assets.',
      'ui:widget': 'textrea',
    },
  },
};
