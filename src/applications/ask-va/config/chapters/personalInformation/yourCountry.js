import React from 'react';
import CountrySelect from '../../../components/FormFields/CountrySelect';
import ProfileLink from '../../../components/ProfileLink';
import { CHAPTER_3 } from '../../../constants';

const title = <h4>{CHAPTER_3.YOUR_COUNTRY.TITLE}</h4>;

const yourCountryPage = {
  uiSchema: {
    'ui:title': title,
    'ui:description': ProfileLink,
    onBaseOutsideUS: {
      'ui:title': CHAPTER_3.YOUR_COUNTRY.QUESTION_1,
    },
    country: {
      'ui:title': 'Country',
      'ui:widget': CountrySelect,
      'ui:required': form => !form.onBaseOutsideUS,
    },
  },
  schema: {
    type: 'object',
    required: ['country'],
    properties: {
      onBaseOutsideUS: {
        type: 'boolean',
        default: false,
      },
      country: {
        type: 'string',
      },
    },
  },
};

export default yourCountryPage;
