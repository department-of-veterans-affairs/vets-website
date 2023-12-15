import FormElementTitle from '../../../components/FormElementTitle';
import { radioUI, radioSchema } from '../../schema-helpers/radioHelper';
import { CHAPTER_3, yesNoOptions } from '../../../constants';

const askingQuestionForOptions = {
  GENERAL_QUESTION: 'A general question',
  ME_THE_VETERAN: 'About me, the Veteran',
  VETERAN_DEPENDENT: 'For the dependent of a Veteran',
  ON_BEHALF_OF_THE_VETERAN: 'On behalf of the Veteran',
};

const whoHasAQuestionPage = {
  uiSchema: {
    'ui:description': FormElementTitle({
      title: CHAPTER_3.PAGE_2.PAGE_DESCRIPTION,
    }),
    isVAEmployee: radioUI({
      title: CHAPTER_3.PAGE_2.QUESTION_1,
      description: '',
      labels: yesNoOptions,
    }),
    askingQuestionFor: radioUI({
      title: CHAPTER_3.PAGE_2.QUESTION_2,
      description: '',
      labels: askingQuestionForOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['isVAEmployee', 'askingQuestionFor'],
    properties: {
      isVAEmployee: radioSchema(Object.keys(yesNoOptions)),
      askingQuestionFor: radioSchema(Object.keys(askingQuestionForOptions)),
    },
  },
};

export default whoHasAQuestionPage;
