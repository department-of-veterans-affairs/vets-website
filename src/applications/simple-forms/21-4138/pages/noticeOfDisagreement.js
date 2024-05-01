import { titleUI } from '~/platform/forms-system/src/js/web-component-patterns';
import {
  NOD_OLD_HANDOFF,
  NOD_SUPPLEMENTAL_HANDOFF,
  NOD_HLR_HANDOFF,
  NOD_BA_HANDOFF,
} from '../config/constants';

/** @type {PageSchema} */
export const nodOldHandoffPage = {
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
export const nodSupplementalHandoffPage = {
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
export const nodHLRHandoffPage = {
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
export const nodBAHandoffPage = {
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
