import {
  fileInputUI,
  fileInputSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

// TODO:: move to content file or leave here?
const fileUploadUrl = `${environment.API_URL}/v0/upload_supporting_evidence`;

// // TODO: Move to content file
const title = 'Select a file to upload';

export const uiSchema = {
  title: 'Manual Upload Page',
  form0781Upload: fileInputUI({
    name: 'placeholder-name',
    title,
    fileUploadUrl,
    // I shouldn't need this but it looks like I do?
    // 'ui:options': {},
    // maxFileSize: 25000000,
    // formNumber,
  }),
};

export const schema = {
  type: 'object',
  properties: {
    form0781Upload: fileInputSchema,
  },
  required: ['form0781Upload'],
};
