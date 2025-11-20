import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import DischargePapersDescription from '../../../components/FormDescriptions/DischargePapersDescription';
import { createPayload, parseResponse } from '../../../utils/helpers';
import { attachmentsSchema } from '../../../definitions/attachments';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(content['service-info--attachments-title']),
    ...descriptionUI(DischargePapersDescription),
    attachments: fileUploadUI('', {
      buttonText: content['button-upload'],
      addAnotherLabel: content['service-info--attachments-add-another-label'],
      fileUploadUrl: `${environment.API_URL}/v0/hca_attachments`,
      fileTypes: [
        'doc',
        'docx',
        'heic',
        'heif',
        'jpeg',
        'jpg',
        'pdf',
        'png',
        'rtf',
      ],
      maxSize: 1024 * 1024 * 10,
      hideLabelText: true,
      createPayload,
      parseResponse,
      attachmentSchema: {
        'ui:title': content['service-info--attachments-type-label'],
      },
      attachmentName: {
        'ui:title': content['service-info--attachments-name-label'],
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      attachments: attachmentsSchema,
    },
  },
};
