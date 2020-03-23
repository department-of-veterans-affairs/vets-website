import { TASK_KEYS } from '../../../constants';
import { genericSchemas } from '../../../generic-schema';
import { isChapterFieldRequired } from '../../../helpers';
import { StudentNameHeader } from '../helpers';

const { currencyInput } = genericSchemas;

export const schema = {
  type: 'object',
  properties: {
    studentDoesHaveNetworth: {
      type: 'boolean',
    },
    networthInformation: {
      type: 'object',
      properties: {
        savings: currencyInput,
        securities: currencyInput,
        realEstate: currencyInput,
        otherAssets: currencyInput,
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
