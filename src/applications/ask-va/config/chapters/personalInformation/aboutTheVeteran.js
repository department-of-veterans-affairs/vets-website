import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { CHAPTER_3 } from '../../../constants';
import {
  personalInformationFormSchemas,
  personalInformationUiSchemas,
} from '../../schema-helpers/personalInformationHelper';

const aboutTheVeteranPage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.ABOUT_THE_VET.TITLE),
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
