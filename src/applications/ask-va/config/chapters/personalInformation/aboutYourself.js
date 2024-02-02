import React from 'react';
import { CHAPTER_3 } from '../../../constants';
import ProfileLink from '../../../components/ProfileLink';
import {
  personalInformationFormSchemas,
  personalInformationUiSchemas,
} from '../../schema-helpers/personalInformationHelper';

const question = <h4>{CHAPTER_3.ABOUT_YOURSELF.TITLE}</h4>;

const aboutYourselfPage = {
  uiSchema: {
    'ui:title': question,
    'ui:description': ProfileLink,
    aboutYourself: personalInformationUiSchemas,
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
