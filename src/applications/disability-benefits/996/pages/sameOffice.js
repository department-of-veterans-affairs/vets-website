import {
  OfficeForReviewTitle,
  OfficeForReviewDescription,
  OfficeForReviewAlert,
} from '../content/OfficeForReview';

import SameOfficeReviewField from '../content/SameOfficeReviewField';

const sameOfficePage = {
  uiSchema: {
    sameOffice: {
      'ui:title': OfficeForReviewTitle,
      'ui:description': OfficeForReviewDescription,
      // including a description here would add it _above_ the checkbox
      'ui:widget': 'checkbox',
      'ui:reviewField': SameOfficeReviewField,
      'ui:options': {
        hideLabelText: true,
      },
    },
    sameOfficeAlert: {
      'ui:title': '', // prevent alert from being added to a legend
      'ui:description': OfficeForReviewAlert,
      'ui:options': {
        forceDivWrapper: true,
        hideIf: formData => formData?.sameOffice !== true,
      },
    },
  },

  schema: {
    type: 'object',
    properties: {
      sameOffice: {
        type: 'boolean',
      },
      sameOfficeAlert: {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default sameOfficePage;
