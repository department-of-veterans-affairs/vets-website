import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { CHAPTER_3 } from '../../../constants';
import {
  aboutYourselfRelationshipFamilyMemberSchema,
  personalInformationAboutYourselfUiSchemas,
} from '../../schema-helpers/personalInformationHelper';

const aboutYourselfRelationshipFamilyMemberPage = {
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
        properties: aboutYourselfRelationshipFamilyMemberSchema,
      },
    },
  },
};

export default aboutYourselfRelationshipFamilyMemberPage;
