import React from 'react';
import {
  addressPageSchema,
  addressPageUISchema,
} from '../../schema-helpers/addressHelper';
import CountrySelect from '../../../components/FormFields/CountrySelect';
import ProfileLink from '../../../components/ProfileLink';
import { CHAPTER_3 } from '../../../constants';

const title = <h3>{CHAPTER_3.YOUR_ADDRESS.TITLE}</h3>;

const MilitaryBaseInfo = () => (
  <div className="">
    <va-additional-info trigger="Learn more about military base addresses">
      <span>
        The United States is automatically chosen as your country if you live on
        a military base outside of the country.
      </span>
    </va-additional-info>
  </div>
);

const yourAddressPage = {
  uiSchema: {
    'ui:title': title,
    'ui:description': ProfileLink,
    onBaseOutsideUS: {
      'ui:title':
        'I live on a U.S. military base outside of the United States.',
      'ui:options': {
        hideOnReviewIfFalse: true,
        useDlWrap: true,
      },
    },
    'view:livesOnMilitaryBaseInfo': {
      'ui:title': ' ',
      'ui:field': MilitaryBaseInfo,
      'ui:options': {
        hideOnReviewIfFalse: true,
        useDlWrap: true,
      },
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
      'view:livesOnMilitaryBaseInfo': {
        type: 'string',
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
