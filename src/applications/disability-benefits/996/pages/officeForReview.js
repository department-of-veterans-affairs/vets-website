import { OfficeForReviewTitle } from '../content/OfficeForReview';

const OfficeForReview = {
  uiSchema: {
    'ui:title': ' ',
    sameOffice: {
      'ui:title': OfficeForReviewTitle,
      'ui:widget': 'yesNo',
    },
  },

  schema: {
    type: 'object',
    properties: {
      sameOffice: {
        type: 'boolean',
      },
    },
  },
};

export default OfficeForReview;
