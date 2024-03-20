import React from 'react';
import ProfileLink from '../../../components/ProfileLink';
import { CHAPTER_3 } from '../../../constants';
import {
  personalInformationAboutYourselfUiSchemas,
  personalInformationFormSchemas,
} from '../../schema-helpers/personalInformationHelper';

const question = <h4>{CHAPTER_3.ABOUT_YOURSELF.TITLE}</h4>;

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
        properties: personalInformationFormSchemas,
      },
    },
  },
};

export default aboutYourselfPage;
