import camelCase from 'lodash/camelCase';

import {
  fileInputMultipleUI,
  fileInputMultipleSchema,
  checkboxGroupSchema,
  checkboxGroupUI,
  textareaSchema,
  textareaUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

/** @type {PageSchema} */
const backgroundInformationDetails = ({
  title,
  path,
  depends,
  question,
  explanationDescription,
}) => {
  const key = camelCase(path);
  const explanationKey = `${key}Explanation`;
  const documentsKey = `${key}Documents`;
  const certificationKey = `${key}Certification`;
  const url = `${
    environment.API_URL
  }/accredited_representative_portal/v0/form21a/${path}`;

  return {
    title,
    path,
    depends,
    uiSchema: {
      [explanationKey]: textareaUI({
        title: question,
        description: explanationDescription,
      }),
      [documentsKey]: {
        ...fileInputMultipleUI({
          title: 'Provide any relevant documents',
          required: false,
          maxFileSize: 26214400, // 25MB in bytes
          accept: '.pdf,.docx',
          hint:
            'You may add .pdf or .docx documents under 25MB. Please name documents with clear, descriptive names.',
          name: `${path}-file-input`,
          fileUploadUrl: url,
          skipUpload: false,
        }),
      },
      [certificationKey]: checkboxGroupUI({
        title: 'Certification',
        errorMessages: {
          required:
            'You must certify you have provided all information you wish to provide',
        },
        required: true,
        labels: {
          certified:
            'I certify I have provided all information I wish to provide relevant to this question. I understand it is my responsibility to establish that I am of good character and reputation, qualified to render valuable assistance to claimants, and otherwise competent to advise and assist claimants in the preparation, presentation, and prosecution of their claim(s) before VA, and that failure to provide the requisite information may result in denial of my application.',
        },
      }),
    },
    schema: {
      type: 'object',
      properties: {
        [explanationKey]: textareaSchema,
        [documentsKey]: fileInputMultipleSchema(),
        [certificationKey]: checkboxGroupSchema(['certified']),
      },
      required: [explanationKey, certificationKey],
    },
  };
};

export default backgroundInformationDetails;
