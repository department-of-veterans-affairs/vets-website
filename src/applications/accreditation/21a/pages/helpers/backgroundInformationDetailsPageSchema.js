import camelCase from 'lodash/camelCase';

import {
  fileInputUI,
  fileInputSchema,
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
  const url = `${environment.API_URL}/accredited_representative_portal/v0/form21a/${path}`;

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
          title: 'Provide any relevant documents',
          hint:
            'You may add .pdf, .doc, .jpg, or .txt documents under 25MB. Please name documents with clear, descriptive names.',
          name: `${path}-file-input`,
          fileUploadUrl: url,
        }),
        /**
         * File upload warnings are modeled as form data that can be modified by
         * the user. When specified as a fully-fledged `ArrayField`, the final
         * review page emits an axe error about the input field to create a new
         * warning. To make warnings function more like readonly UX state and
         * also prevent this axe error while working within the form schema
         * concept that file uploading is built on, setting the field kind to
         * `BasicArrayField` accomplishes both of these things.
         */
        warnings: {
          'ui:field': 'BasicArrayField',
          'ui:title': 'Document upload warnings',
        },
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
        [documentsKey]: fileInputSchema,
        [certificationKey]: checkboxGroupSchema(['certified']),
      },
      required: [explanationKey, certificationKey],
    },
  };
};

export default backgroundInformationDetails;
