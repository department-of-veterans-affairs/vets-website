import {
  OfficeForReviewContent,
  OfficeForReviewLabel,
} from '../content/OfficeForReview';

const sameOfficePage = {
  uiSchema: {
    'ui:options': {
      itemName: 'office of review',
    },
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
      'ui:required': () => true,
      'ui:options': {
        widgetProps: {
          Y: {
            'aria-describedby': 'same-office-notice',
          },
        },
      },
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
