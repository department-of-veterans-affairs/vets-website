import FormElementTitle from '../../../components/FormElementTitle';
import { radioUI, radioSchema } from '../../schema-helpers/radioHelper';
import { CHAPTER_3, contactOptions } from '../../../constants';

const howToContactPage = {
  uiSchema: {
    'ui:description': FormElementTitle({
      title: CHAPTER_3.CONTACT_PREF.TITLE,
    }),
    contactPreference: radioUI({
      title: CHAPTER_3.CONTACT_PREF.QUESTION_1,
      description: '',
      labels: contactOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['contactPreference'],
    properties: {
      contactPreference: radioSchema(Object.keys(contactOptions)),
    },
  },
};

export default howToContactPage;
