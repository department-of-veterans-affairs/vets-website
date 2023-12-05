import React from 'react';
import * as address from '@department-of-veterans-affairs/platform-forms-system/address';
import { CHAPTER_4 } from '../../../constants';

import fullSchema from '../../0873-schema.json';

const title = <h4>{CHAPTER_4.PAGE_2.TITLE}</h4>;

const veteransAddressPage = {
  uiSchema: {
    'ui:description': title,
    address: address.uiSchema(''),
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      address: address.schema(fullSchema, true),
    },
  },
};

export default veteransAddressPage;
