import { form0781HeadingTag, titleWithTag } from '../../content/form0781';
import {
  howToScanFileInfo,
  manualUploadPageDescription,
  manualUploadPageTitle,
  manualUploadRequirementsText,
  manualUploadRequirementsTextTitle,
} from '../../content/form0781/manualUploadPage';
import {
  ancillaryFormUploadUi,
  getAttachmentsSchema,
} from '../../utils/schemas';

const PTSD_781_ATTACHMENT_ID = 'L228';

export const uiSchema = {
  'ui:title': titleWithTag(manualUploadPageTitle, form0781HeadingTag),
  'ui:description': manualUploadPageDescription,
  'view:howToScanAFile': {
    'ui:description': howToScanFileInfo,
  },
  form781Upload: {
    ...ancillaryFormUploadUi(
      manualUploadRequirementsTextTitle,
      'PTSD 781 form',
      {
        attachmentId: PTSD_781_ATTACHMENT_ID,
        customClasses: 'upload-completed-form',
        isDisabled: true,
        attachmentName: true,
      },
    ),
    'ui:description': manualUploadRequirementsText,
  },
};

export const schema = {
  type: 'object',
  required: ['form781Upload'],
  properties: {
    'view:howToScanAFile': {
      type: 'object',
      properties: {},
    },
    form781Upload: getAttachmentsSchema(PTSD_781_ATTACHMENT_ID),
  },
};
