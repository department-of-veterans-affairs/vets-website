import FormElementTitle from '../../../components/FormElementTitle';
import { CHAPTER_3 } from '../../../constants';
import ProfileLink from '../../../components/ProfileLink';
import {
  personalInformationFormSchemas,
  personalInformationUiSchemas,
} from '../../schema-helpers/personalInformationHelper';

const question = FormElementTitle({ title: CHAPTER_3.ABOUT_THE_VET.TITLE });

const aboutVetUiSchema = { ...personalInformationUiSchemas };
delete aboutVetUiSchema.genderIdentity;
delete aboutVetUiSchema.pronouns;

const aboutVetFormSchema = { ...personalInformationFormSchemas };
delete aboutVetFormSchema.genderIdentity;
delete aboutVetFormSchema.pronouns;

const aboutTheVeteranPage = {
  uiSchema: {
    'ui:title': question,
    'ui:description': ProfileLink,
    aboutTheVeteran: aboutVetUiSchema,
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      aboutTheVeteran: {
        type: 'object',
        properties: aboutVetFormSchema,
      },
    },
  },
};

export default aboutTheVeteranPage;
