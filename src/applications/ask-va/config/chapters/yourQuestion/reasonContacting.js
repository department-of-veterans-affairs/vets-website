import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import FormElementTitle from '../../../components/FormElementTitle';
import { CHAPTER_2, reasonOptions } from '../../../constants';

const reasonContactPage = {
  uiSchema: {
    'ui:description': FormElementTitle({ title: CHAPTER_2.PAGE_2.TITLE }),
    contactReason: radioUI({
      title: CHAPTER_2.PAGE_2.QUESTION_1,
      labels: reasonOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['contactReason'],
    properties: {
      contactReason: radioSchema(Object.values(reasonOptions)),
    },
  },
};

export default reasonContactPage;