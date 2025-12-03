import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  PensionHeader,
  PensionFooter,
} from '../../../components/PensionContent';

export const uiSchema = {
  'view:veteran-pension-header': {
    'ui:description': PensionHeader,
  },
  'view:checkVeteranPension': yesNoUI({
    title: 'Do you receive VA pension benefits?',
    hideOnReview: true,
  }),
  'view:veteran-pension-footer': {
    'ui:description': PensionFooter,
  },
};

export const schema = {
  type: 'object',
  required: ['view:checkVeteranPension'],
  properties: {
    'view:veteran-pension-header': {
      type: 'object',
      properties: {},
    },
    'view:checkVeteranPension': yesNoSchema,
    'view:veteran-pension-footer': {
      type: 'object',
      properties: {},
    },
  },
};
