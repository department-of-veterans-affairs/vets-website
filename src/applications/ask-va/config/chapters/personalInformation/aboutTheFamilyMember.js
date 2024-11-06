import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameSchema,
  fullNameUI,
  ssnSchema,
  ssnUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CHAPTER_3 } from '../../../constants';
import {
  personalInformationFormSchemas,
  personalInformationUiSchemas,
} from '../../schema-helpers/personalInformationHelper';

const aboutVetUiSchema = {
  ...personalInformationUiSchemas,
  socialNum: {
    ...ssnUI(),
    'ui:required': () => true,
    'ui:options': {
      hideIf: () => false,
    },
  },
};
delete aboutVetUiSchema.genderIdentity;
delete aboutVetUiSchema.socialOrServiceNum;
delete aboutVetUiSchema.isVeteranDeceased;

const aboutVetFormSchema = { ...personalInformationFormSchemas, ssnSchema };
delete aboutVetFormSchema.genderIdentity;
delete aboutVetFormSchema.socialOrServiceNum;
delete aboutVetFormSchema.isVeteranDeceased;

const aboutTheFamilyMemberPage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.ABOUT_YOUR_FAM_MEM.TITLE),
    aboutTheFamilyMember: {
      fullName: fullNameUI(),
      socialOrServiceNum: { ssn: ssnUI() },
      dateOfBirth: dateOfBirthUI(),
    },
  },
  schema: {
    type: 'object',
    properties: {
      aboutTheFamilyMember: {
        type: 'object',
        required: ['dateOfBirth'],
        properties: {
          fullName: fullNameSchema,
          socialOrServiceNum: {
            type: 'object',
            required: ['ssn'],
            properties: {
              ssn: ssnSchema,
            },
          },
          dateOfBirth: dateOfBirthSchema,
        },
      },
    },
  },
};

export default aboutTheFamilyMemberPage;
