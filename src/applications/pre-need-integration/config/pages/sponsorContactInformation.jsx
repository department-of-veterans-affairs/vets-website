import React from 'react';
import { useSelector } from 'react-redux';
import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';
import { merge } from 'lodash';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import phoneUI from '../../components/Phone';
import emailUI from '../../definitions/email';
import * as address from '../../definitions/address';
import {
  MailingAddressStateTitle,
  sponsorMailingAddressHasState,
  sponsorContactInfoSubheader,
  sponsorContactInfoDescription,
  bottomPadding,
} from '../../utils/helpers';
import { SponsorContactDetailsTitle } from '../../components/PreparerHelpers';

// Import veteran properties from schema
const { veteran } = fullSchemaPreNeed.properties.application.properties;

export function DynamicStateSelectFieldSponsor(props) {
  const formData = useSelector(state => state.form.data || {});

  const dynamicLabel = MailingAddressStateTitle({
    elementPath: 'application.veteran.address.country',
    formData,
  });

  const modifiedProps = {
    ...props,
    label: dynamicLabel,
  };

  return <VaSelectField {...modifiedProps} />;
}

// Validation function
export const isRequired = formData => {
  return (
    formData?.application?.veteran?.address.street !== undefined ||
    formData?.application?.veteran?.address.street2 !== undefined ||
    formData?.application?.veteran?.address.city !== undefined ||
    formData?.application?.veteran?.address.state !== undefined ||
    formData?.application?.veteran?.address.postalCode !== undefined
  );
};

// UI Schema
export const uiSchema = {
  application: {
    veteran: {
      address: merge(
        {},
        address.uiSchema(
          SponsorContactDetailsTitle,
          'You can choose to enter your sponsor’s mailing address. This is optional. We’ll confirm this address with the U.S. Postal Service.',
          false,
          isRequired,
          false,
          ['street', 'city', 'postalCode'],
        ),
        {
          country: {
            'ui:webComponentField': VaSelectField,
            'ui:options': {
              classNames: 'selectNonImposter',
            },
          },
          street: {
            'ui:title': 'Street address',
          },
          street2: {
            'ui:title': 'Street address line 2',
          },
          state: {
            'ui:webComponentField': DynamicStateSelectFieldSponsor,
            'ui:options': {
              hideIf: formData => !sponsorMailingAddressHasState(formData),
              classNames: 'selectNonImposter',
            },
          },
        },
      ),
      'view:contactInfoSubheader': {
        'ui:description': sponsorContactInfoSubheader,
        'ui:options': {
          displayEmptyObjectOnReview: true,
        },
      },
      phoneNumber: phoneUI('Phone number'),
      email: emailUI(),
      'view:contactInfoDescription': {
        'ui:description': sponsorContactInfoDescription,
        'ui:options': {
          displayEmptyObjectOnReview: true,
        },
      },
      'view:bottomPadding': {
        'ui:description': bottomPadding,
        'ui:options': {
          displayEmptyObjectOnReview: true,
        },
      },
    },
  },
};

// Schema
export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        veteran: {
          type: 'object',
          properties: {
            address: address.schema(fullSchemaPreNeed, isRequired),
            'view:contactInfoSubheader': {
              type: 'object',
              properties: {},
            },
            phoneNumber: veteran.properties.phoneNumber,
            email: veteran.properties.email,
            'view:contactInfoDescription': {
              type: 'object',
              properties: {},
            },
            'view:bottomPadding': {
              type: 'object',
              properties: {},
            },
          },
        },
      },
    },
  },
};
