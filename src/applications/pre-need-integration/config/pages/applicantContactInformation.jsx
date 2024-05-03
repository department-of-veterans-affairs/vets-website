import React from 'react';
import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';
import { merge } from 'lodash';
import phoneUI from '../../components/Phone';
import emailUI from '../../definitions/email';
import * as address from '../../definitions/address';
import {
  MailingAddressStateTitle,
  applicantsMailingAddressHasState,
  applicantContactInfoAddressTitle,
  applicantContactInfoSubheader,
  applicantContactInfoDescription,
  bottomPadding,
} from '../../utils/helpers';

const { claimant } = fullSchemaPreNeed.properties.application.properties;

export const applicantMailingAddressStateTitleWrapper = (
  <MailingAddressStateTitle elementPath="application.claimant.address.country" />
);

export function uiSchema(
  addressTitle = applicantContactInfoAddressTitle,
  contactInfoSubheader = applicantContactInfoSubheader,
  contactInfoDescription = applicantContactInfoDescription,
) {
  return {
    application: {
      claimant: {
        address: merge({}, address.uiSchema(addressTitle), {
          street: {
            'ui:title': 'Street address',
          },
          street2: {
            'ui:title': 'Street address line 2',
          },
          state: {
            'ui:title': applicantMailingAddressStateTitleWrapper,
            'ui:options': {
              hideIf: formData => !applicantsMailingAddressHasState(formData),
            },
          },
        }),
        'view:contactInfoSubheader': {
          'ui:description': contactInfoSubheader,
          'ui:options': {
            displayEmptyObjectOnReview: true,
          },
        },
        phoneNumber: phoneUI('Phone number'),
        email: emailUI(),
        'view:contactInfoDescription': {
          'ui:description': contactInfoDescription,
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
}
export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        claimant: {
          type: 'object',
          required: ['email', 'phoneNumber'],
          properties: {
            address: address.schema(fullSchemaPreNeed, true),
            'view:contactInfoSubheader': {
              type: 'object',
              properties: {},
            },
            phoneNumber: claimant.properties.phoneNumber,
            email: claimant.properties.email,
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
