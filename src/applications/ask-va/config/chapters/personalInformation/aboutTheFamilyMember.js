import { ssnUI } from 'platform/forms-system/src/js/web-component-patterns';
import React from 'react';
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

const aboutVetFormSchema = { ...personalInformationFormSchemas };
delete aboutVetFormSchema.genderIdentity;
delete aboutVetFormSchema.socialOrServiceNum;
delete aboutVetFormSchema.isVeteranDeceased;

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
