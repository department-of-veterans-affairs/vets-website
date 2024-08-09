import camelCase from 'lodash/camelCase';

import {
  fileInputUI,
  fileInputSchema,
  radioSchema,
  radioUI,
  textareaSchema,
  textareaUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const certificationOptions = {
  CERTIFIED:
    'I certify that I have uploaded all information relevant to this question.',
  DECLINED:
    'I decline to upload additional documentation relevant to this question.',
};

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
        ...fileInputUI({
          errorMessages: {
            required: `Upload a completed VA Form 21A`, // error
          },
          title: 'Provide any relevant documents',
          hint:
            'You may add .pdf, .doc, .jpg, or .txt documents under 25MB. Please name documents with clear, descriptive names.',
          name: `${path}-file-input`,
          fileUploadUrl: url,
        }),
      },
      [certificationKey]: radioUI({
        title: 'Certification',
        labels: certificationOptions,
      }),
    },
    schema: {
      type: 'object',
      properties: {
        [explanationKey]: textareaSchema,
        [documentsKey]: fileInputSchema,
        [certificationKey]: radioSchema(Object.keys(certificationOptions)),
      },
      required: [explanationKey, certificationKey],
    },
  };
};

export default backgroundInformationDetails;
