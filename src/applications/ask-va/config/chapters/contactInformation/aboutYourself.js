import React from 'react';
import { CHAPTER_4 } from '../../../constants';
import ProfileLink from '../../../components/ProfileLink';
import {
  personalInformationFormSchemas,
  personalInformationUiSchemas,
} from '../../schema-helpers/personalInformationHelper';

const question = <h4>{CHAPTER_4.PAGE_3.TITLE}</h4>;

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
