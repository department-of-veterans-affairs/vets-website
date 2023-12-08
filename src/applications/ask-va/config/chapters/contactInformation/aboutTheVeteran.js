import FormElementTitle from '../../../components/FormElementTitle';
import { CHAPTER_4 } from '../../../constants';
import ProfileLink from '../../../components/ProfileLink';
import {
  personalInformationFormSchemas,
  personalInformationUiSchemas,
} from '../../schema-helpers/personalInformationHelper';

const question = FormElementTitle({ title: CHAPTER_4.PAGE_1.TITLE });

const aboutTheVeteranPage = {
  uiSchema: {
    'ui:title': question,
    'ui:description': ProfileLink,
    aboutTheVeteran: personalInformationUiSchemas,
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      aboutTheVeteran: {
        type: 'object',
        properties: personalInformationFormSchemas,
      },
    },
  },
};

export default aboutTheVeteranPage;
