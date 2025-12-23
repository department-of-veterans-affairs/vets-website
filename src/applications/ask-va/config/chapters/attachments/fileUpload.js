import FileUpload from '../../../components/FileUpload';
import FormElementTitle from '../../../components/FormElementTitle';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_2 } from '../../../constants';

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

const fileUploadPage = {
  uiSchema: {
    'ui:description': FormElementTitle({ title: CHAPTER_2.PAGE_4.TITLE }),
    'ui:objectViewField': PageFieldSummary,
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
      fileUpload: fileSchema,
    },
  },
};

export default fileUploadPage;
