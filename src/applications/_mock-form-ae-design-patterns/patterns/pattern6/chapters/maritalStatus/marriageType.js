import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

export default {
  title: 'Type of marriage',
  path: 'marital-status/type',
  depends: formData => formData?.maritalStatus === 'MARRIED',
  uiSchema: {
    ...titleUI('Why type of marriage do you have?'),
    marriageType: {
      'ui:title': ' ',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          CIVIL_CEREMONY: 'Civil Ceremony',
          RELIGIOUS_CEREMONY: 'Religious Ceremony',
          PROXY: 'Proxy',
          COMMON_LAW: 'Common Law',
          OTHER: 'Other',
        },
      },
    },
    otherMarriageType: {
      'ui:title': 'Please describe your marriage type',
      'ui:options': {
        expandUnder: 'marriageType',
        expandUnderCondition: 'OTHER',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['marriageType'],
    properties: {
      marriageType: {
        type: 'string',
        enum: [
          'CIVIL_CEREMONY',
          'RELIGIOUS_CEREMONY',
          'PROXY',
          'COMMON_LAW',
          'OTHER',
        ],
      },
      otherMarriageType: { type: 'string' },
    },
  },
};
