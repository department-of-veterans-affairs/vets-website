import React from 'react';
import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';
import { merge } from 'lodash';
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

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const sponsorMailingAddressStateTitleWrapper = (
  <MailingAddressStateTitle elementPath="application.veteran.address.country" />
);

export const uiSchema = {
  application: {
    veteran: {
      address: merge({}, address.uiSchema('Sponsor’s mailing address'), {
        street: {
          'ui:title': 'Street address',
        },
        street2: {
          'ui:title': 'Street address line 2',
        },
        state: {
          'ui:title': sponsorMailingAddressStateTitleWrapper,
          'ui:options': {
            hideIf: formData => !sponsorMailingAddressHasState(formData),
          },
        },
      }),
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

export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        veteran: {
          type: 'object',
          properties: {
            address: address.schema(fullSchemaPreNeed),
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
