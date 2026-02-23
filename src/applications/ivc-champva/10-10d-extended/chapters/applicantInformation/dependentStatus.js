import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayTitleWithNameUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['applicants--dependent-status-title'];
const INPUT_LABEL = content['applicants--dependent-status-label'];
const HINT_TEXT = content['applicants--dependent-status-hint'];

const SCHEMA_LABELS = {
  enrolled: content['applicants--dependent-status-option--enrolled'],
  intendsToEnroll:
    content['applicants--dependent-status-option--intendsToEnroll'],
  over18HelplessChild:
    content['applicants--dependent-status-option--helplessChild'],
};
const SCHEMA_ENUM = Object.keys(SCHEMA_LABELS);

export default {
  uiSchema: {
    ...arrayTitleWithNameUI(TITLE_TEXT),
    applicantDependentStatus: {
      status: radioUI({
        title: INPUT_LABEL,
        hint: HINT_TEXT,
        labels: SCHEMA_LABELS,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      applicantDependentStatus: {
        type: 'object',
        required: ['status'],
        properties: {
          status: radioSchema(SCHEMA_ENUM),
        },
      },
    },
  },
};
