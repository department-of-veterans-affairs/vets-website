import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';
import FileUpload from '../../../components/FileUpload';
import FormElementTitle from '../../../components/FormElementTitle';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CategoryEducation, CHAPTER_2 } from '../../../constants';

export const fileSchema = {
  type: 'array',
  minItems: 1,
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
        required: 'Please let us know what your question is about.',
      },
      'ui:options': {
        required: true,
        useFormsPattern: 'single',
      },
    },
    fileUpload: {
      'ui:title': 'Select optional files to upload',
      'ui:webComponentField': FileUpload,
      'ui:options': {
        hideIf: formData => {
          // TODO - update mockData list with appropriate topic titles from design
          const HealthCareCondition =
            formData.selectCategory === 'VA Health Care' &&
            (formData.selectTopic === 'National Recruitment Services (NRS)' ||
              formData.selectTopic ===
                'Medical Care Concerns at a VA Medical Facility');
          const EducationCondition =
            formData.selectCategory === CategoryEducation &&
            formData.selectTopic !== 'Veteran Readiness and Employment';
          return !HealthCareCondition && !EducationCondition;
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      subject: {
        type: 'string',
      },
      question: {
        type: 'string',
      },
      fileUpload: fileSchema,
    },
  },
};

export default yourQuestionPage;
