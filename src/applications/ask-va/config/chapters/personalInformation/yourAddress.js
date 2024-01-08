import React from 'react';
import {
  addressPageSchema,
  addressPageUISchema,
} from '../../schema-helpers/addressHelper';
import ProfileLink from '../../../components/ProfileLink';
import { CHAPTER_3 } from '../../../constants';

const title = <h4>{CHAPTER_3.PAGE_14.TITLE}</h4>;

const yourAddressPage = {
  uiSchema: {
    'ui:title': title,
    'ui:description': ProfileLink,
    address: addressPageUISchema,
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      address: {
        type: 'object',
        properties: addressPageSchema,
      },
    },
  },
};

export default yourAddressPage;
