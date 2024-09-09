import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { CHAPTER_3 } from '../../../constants';
import {
  aboutYourselfGeneralSchema,
  aboutYourselfGeneralUISchema,
} from '../../schema-helpers/personalInformationHelper';

const aboutYourselfGeneralPage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.ABOUT_YOURSELF.TITLE),
    aboutYourself: aboutYourselfGeneralUISchema,
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      aboutYourself: {
        type: 'object',
        properties: aboutYourselfGeneralSchema,
      },
    },
  },
};

export default aboutYourselfGeneralPage;
