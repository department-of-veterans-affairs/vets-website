import {
  ssnSchema,
  ssnUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording, privWrapper } from '../../../shared/utilities';

const TITLE_TEXT = 'identification information';

const PAGE_TITLE = ({ formData }) =>
  privWrapper(
    `${nameWording(formData, undefined, undefined, true)} ${TITLE_TEXT}`,
  );

export default {
  uiSchema: {
    ...titleUI(PAGE_TITLE),
    applicantSsn: ssnUI(),
  },
  schema: {
    type: 'object',
    required: ['applicantSsn'],
    properties: {
      applicantSsn: ssnSchema,
    },
  },
};
