import React from 'react';
import {
  addressPageSchema,
  addressPageUISchema,
} from '../../schema-helpers/addressHelper';
import CountrySelect from '../../../components/FormFields/CountrySelect';
import ProfileLink from '../../../components/ProfileLink';
import { CHAPTER_3 } from '../../../constants';

const title = <h3>{CHAPTER_3.YOUR_ADDRESS.TITLE}</h3>;

const yourAddressPage = {
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
    address: addressPageUISchema,
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      onBaseOutsideUS: {
        type: 'boolean',
        default: false,
      },
      country: {
        type: 'string',
      },
      address: {
        type: 'object',
        properties: addressPageSchema,
      },
    },
  },
};

export default yourAddressPage;
