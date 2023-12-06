import React from 'react';
import { CHAPTER_4 } from '../../../constants';
import ProfileLink from '../../../components/ProfileLink';
import {
  personalInformationFormSchemas,
  personalInformationUiSchemas,
} from '../../schema-helpers/personalInformationHelper';

const question = <h4>{CHAPTER_4.PAGE_1.TITLE}</h4>;

const aboutTheVeteranPage = {
  uiSchema: {
    'ui:title': question,
    'ui:description': ProfileLink,
    aboutTheVeteran: personalInformationUiSchemas,
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      aboutTheVeteran: {
        type: 'object',
        properties: personalInformationFormSchemas,
      },
    },
  },
};

export default aboutTheVeteranPage;
