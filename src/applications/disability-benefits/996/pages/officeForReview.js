import {
  OfficeForReviewTitle,
  OfficeForReviewChoiceAlert,
} from '../content/OfficeForReview';

const OfficeForReview = {
  uiSchema: {
    'ui:title': ' ',
    sameOffice: {
      'ui:title': OfficeForReviewTitle,
      'ui:widget': 'yesNo',
    },
    'view:sameOffice': {
      'ui:description': OfficeForReviewChoiceAlert,
      'ui:options': {
        hideIf: formData => formData?.sameOffice !== false,
      },
    },
  },

  schema: {
    type: 'object',
    properties: {
      sameOffice: {
        type: 'boolean',
      },
      'view:sameOffice': {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default OfficeForReview;
