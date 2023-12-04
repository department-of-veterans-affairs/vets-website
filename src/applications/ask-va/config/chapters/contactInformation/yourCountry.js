import React from 'react';
import * as address from '@department-of-veterans-affairs/platform-forms-system/address';
import ProfileLink from '../../../components/ProfileLink';
import { CHAPTER_4 } from '../../../constants';

import fullSchema from '../../0873-schema.json';

const title = <h4>{CHAPTER_4.PAGE_5.TITLE}</h4>;

const countryUI = address.uiSchema('').country;
const countrySchema = address.schema(fullSchema, true).properties.country;

const yourCountryPage = {
  uiSchema: {
    'ui:title': title,
    'ui:description': ProfileLink,
    onBaseOutsideUS: {
      'ui:title': CHAPTER_4.PAGE_5.QUESTION_1,
    },
    country: countryUI,
  },
  schema: {
    type: 'object',
    required: ['country'],
    properties: {
      onBaseOutsideUS: {
        type: 'boolean',
        default: false,
      },
      country: countrySchema,
    },
  },
};

export default yourCountryPage;
