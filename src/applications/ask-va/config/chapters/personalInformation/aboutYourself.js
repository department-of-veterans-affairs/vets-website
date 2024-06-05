import React from 'react';
import ProfileLink from '../../../components/ProfileLink';
import { CHAPTER_3 } from '../../../constants';
import {
  personalInformationAboutYourselfUiSchemas,
  personalInformationFormSchemas,
} from '../../schema-helpers/personalInformationHelper';

const question = <h3>{CHAPTER_3.ABOUT_YOURSELF.TITLE}</h3>;

const aboutYourselfFormSchema = { ...personalInformationFormSchemas };
delete aboutYourselfFormSchema.pronouns;

const aboutYourselfPage = {
  uiSchema: {
    'ui:title': question,
    'ui:description': ProfileLink,
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
