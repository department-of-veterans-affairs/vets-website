import { titleUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { CHAPTER_3 } from '../../../constants';
import {
  personalInformationAboutYourselfUiSchemas,
  personalInformationFormSchemas,
} from '../../schema-helpers/personalInformationHelper';

const aboutYourselfFormSchema = { ...personalInformationFormSchemas };
delete aboutYourselfFormSchema.isVeteranDeceased;

const aboutYourselfPage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.ABOUT_YOURSELF.TITLE),
    aboutYourself: personalInformationAboutYourselfUiSchemas,
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      aboutYourself: {
        type: 'object',
        properties: aboutYourselfFormSchema,
      },
    },
  },
};

export default aboutYourselfPage;
