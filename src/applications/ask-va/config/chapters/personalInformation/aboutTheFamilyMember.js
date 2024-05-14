import FormElementTitle from '../../../components/FormElementTitle';
import { CHAPTER_3 } from '../../../constants';
import ProfileLink from '../../../components/ProfileLink';
import {
  personalInformationFormSchemas,
  personalInformationUiSchemas,
} from '../../schema-helpers/personalInformationHelper';

const question = FormElementTitle({
  title: CHAPTER_3.ABOUT_YOUR_FAM_MEM.TITLE,
});

const aboutVetUiSchema = { ...personalInformationUiSchemas };
delete aboutVetUiSchema.genderIdentity;

const aboutVetFormSchema = { ...personalInformationFormSchemas };
delete aboutVetFormSchema.genderIdentity;

const aboutTheFamilyMemberPage = {
  uiSchema: {
    'ui:title': question,
    'ui:description': ProfileLink,
    aboutTheFamilyMember: aboutVetUiSchema,
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      aboutTheFamilyMember: {
        type: 'object',
        properties: aboutVetFormSchema,
      },
    },
  },
};

export default aboutTheFamilyMemberPage;
