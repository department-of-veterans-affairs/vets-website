import {
  form0781HeadingTag,
  mentalHealthSupportAlert,
  titleWithTag,
} from '../../content/form0781';
import {
  howToScanFileInfo,
  manualUploadPageDescription,
  manualUploadPageTitle,
  uploadComponentPlaceholder,
} from '../../content/form0781/manualUploadPage';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': titleWithTag(manualUploadPageTitle, form0781HeadingTag),
    'ui:description': manualUploadPageDescription,
    'view:howToScanAFile': {
      'ui:description': howToScanFileInfo,
    },
    'view:uploadComponentPlaceholder': {
      'ui:description': uploadComponentPlaceholder,
    },
    'view:mentalHealthSupportAlert': {
      'ui:description': mentalHealthSupportAlert,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:howToScanAFile': {
        type: 'object',
        properties: {},
      },
      'view:uploadComponentPlaceholder': {
        type: 'object',
        properties: {},
      },
      'view:mentalHealthSupportAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
