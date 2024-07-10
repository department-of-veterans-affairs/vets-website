import React from 'react';
// import FormElementTitle from '../../../components/FormElementTitle';
import { ssnUI } from 'platform/forms-system/src/js/web-component-patterns';
import { CHAPTER_3 } from '../../../constants';
import {
  personalInformationFormSchemas,
  personalInformationUiSchemas,
} from '../../schema-helpers/personalInformationHelper';

// const question = FormElementTitle({
//   title: CHAPTER_3.ABOUT_YOUR_FAM_MEM.TITLE,
// });

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

const aboutVetFormSchema = { ...personalInformationFormSchemas };
delete aboutVetFormSchema.genderIdentity;
delete aboutVetFormSchema.socialOrServiceNum;

const aboutTheFamilyMemberPage = {
  uiSchema: {
    'ui:title': <h3>{CHAPTER_3.ABOUT_YOUR_FAM_MEM.TITLE}</h3>,
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
