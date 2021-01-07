import {
  OfficeForReviewContent,
  OfficeForReviewLabel,
} from '../content/OfficeForReview';

const sameOfficePage = {
  uiSchema: {
    'view:sameOfficeInfo': {
      'ui:title': ' ',
      'ui:description': OfficeForReviewContent,
      'ui:options': {
        forceDivWrapper: true,
      },
    },
    sameOffice: {
      'ui:title': OfficeForReviewLabel,
      'ui:widget': 'yesNo',
    },
  },

  schema: {
    type: 'object',
    properties: {
      'view:sameOfficeInfo': {
        type: 'object',
        properties: {},
      },
      sameOffice: {
        type: 'boolean',
      },
    },
  },
};

export default sameOfficePage;
