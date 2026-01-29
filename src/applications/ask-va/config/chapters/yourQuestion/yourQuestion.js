import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';
import FileUpload from '../../../components/FileUpload';
import FormElementTitle from '../../../components/FormElementTitle';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CategoryEducation, CHAPTER_2 } from '../../../constants';

export const fileSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      fileName: {
        type: 'string',
      },
      fileSize: {
        type: 'integer',
      },
      fileType: {
        type: 'string',
      },
      base64: {
        type: 'string',
      },
      fileID: {
        type: 'string',
      },
    },
  },
};

const yourQuestionPage = {
  uiSchema: {
    'ui:description': FormElementTitle({ title: CHAPTER_2.PAGE_3.TITLE }),
    'ui:objectViewField': PageFieldSummary,
    subject: {
      'ui:title': 'Subject',
      'ui:errorMessages': {
        required: 'Enter a subject for your question.',
        pattern: 'Enter a valid subject.',
      },
      'ui:required': formData =>
        formData.selectCategory === CategoryEducation ||
        formData.selectTopic === CategoryEducation,
      'ui:options': {
        hideIf: formData =>
          !(
            formData.selectCategory === CategoryEducation ||
            formData.selectTopic === CategoryEducation
          ),
      },
    },
    question: {
      'ui:title': CHAPTER_2.PAGE_3.QUESTION_1,
      'ui:webComponentField': VaTextareaField,
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Let us know what your question is about.',
        pattern: 'Enter a valid question.',
      },
      'ui:options': {
        required: true,
        charcount: true,
        useFormsPattern: 'single',
      },
    },
    fileUpload: {
      'ui:title': 'Select optional files to upload',
      'ui:webComponentField': FileUpload,
      'ui:options': {
        hideIf: formData => formData.allowAttachments === false,
      },
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      subject: {
        type: 'string',
        pattern: /\S/, // At least one non-whitespace character
        minLength: 1,
        maxLength: 140,
      },
      question: {
        type: 'string',
        pattern: /\S/, // At least one non-whitespace character
        minLength: 1,
        maxLength: 10000,
      },
      fileUpload: fileSchema,
    },
  },
};

export default yourQuestionPage;
