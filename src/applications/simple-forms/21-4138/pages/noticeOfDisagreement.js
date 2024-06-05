import { titleUI } from '~/platform/forms-system/src/js/web-component-patterns';
import {
  NOD_OLD_HANDOFF,
  NOD_SUPPLEMENTAL_HANDOFF,
  NOD_HLR_HANDOFF,
  NOD_BA_HANDOFF,
} from '../config/constants';

/** @type {PageSchema} */
export const newSupplementalClaimPage = {
  uiSchema: {
    ...titleUI({
      title: "There's a better way for you to ask for a decision review",
      headerLevel: 1,
    }),
    'view:noticeOfDisagreementContent': {
      'ui:description': NOD_OLD_HANDOFF,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:noticeOfDisagreementContent': {
        type: 'object',
        properties: {},
      },
    },
  },
};

/** @type {PageSchema} */
export const supplementalClaimPage = {
  uiSchema: {
    ...titleUI({
      title: "There's a better way for you to ask for a decision review",
      headerLevel: 1,
    }),
    'view:noticeOfDisagreementContent': {
      'ui:description': NOD_SUPPLEMENTAL_HANDOFF,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:noticeOfDisagreementContent': {
        type: 'object',
        properties: {},
      },
    },
  },
};

/** @type {PageSchema} */
export const higherLevelReviewPage = {
  uiSchema: {
    ...titleUI({
      title: "There's a better way for you to ask for a decision review",
      headerLevel: 1,
    }),
    'view:noticeOfDisagreementContent': {
      'ui:description': NOD_HLR_HANDOFF,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:noticeOfDisagreementContent': {
        type: 'object',
        properties: {},
      },
    },
  },
};

/** @type {PageSchema} */
export const boardAppealPage = {
  uiSchema: {
    ...titleUI({
      title: "There's a better way for you to ask for a decision review",
      headerLevel: 1,
    }),
    'view:noticeOfDisagreementContent': {
      'ui:description': NOD_BA_HANDOFF,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:noticeOfDisagreementContent': {
        type: 'object',
        properties: {},
      },
    },
  },
};
