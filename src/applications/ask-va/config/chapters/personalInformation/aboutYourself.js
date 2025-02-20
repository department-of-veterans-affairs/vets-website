import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { CHAPTER_3 } from '../../../constants';
import {
  personalInformationAboutYourselfUiSchemas,
  personalInformationFormSchemas,
} from '../../schema-helpers/personalInformationHelper';

const {
  // eslint-disable-next-line no-unused-vars
  isVeteranDeceased, // omit
  ...aboutYourselfFormSchema
} = personalInformationFormSchemas;

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
