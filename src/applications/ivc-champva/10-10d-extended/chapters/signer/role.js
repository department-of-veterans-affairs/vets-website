import {
  descriptionUI,
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import SignInAlert from '../../components/FormAlerts/SignInAlert';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['eligibility--role-title'];
const INPUT_LABEL = content['eligibility--role-label'];

const SCHEMA_LABELS = {
  applicant: content['eligibility--role-option--applicant'],
  sponsor: content['eligibility--role-option--sponsor'],
  other: content['eligibility--role-option--other'],
};
const SCHEMA_ENUM = Object.keys(SCHEMA_LABELS);

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT),
    ...descriptionUI(SignInAlert),
    certifierRole: radioUI({
      title: INPUT_LABEL,
      labels: SCHEMA_LABELS,
    }),
  },
  schema: {
    type: 'object',
    required: ['certifierRole'],
    properties: {
      certifierRole: radioSchema(SCHEMA_ENUM),
    },
  },
};
