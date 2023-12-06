import React from 'react';
import { merge } from 'lodash';

import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import * as address from '../../definitions/address';

import preparerPhoneUI from '../../components/PreparerPhone';

import {
  isAuthorizedAgent,
  preparerAddressHasState,
  MailingAddressStateTitle,
} from '../../utils/helpers';
import { ContactDetailsTitle } from '../../components/PreparerHelpers';

const { applicant } = fullSchemaPreNeed.properties.application.properties;

const preparerMailingAddressStateTitleWrapper = (
  <MailingAddressStateTitle elementPath="application.applicant.view:applicantInfo.mailingAddress.country" />
);

export const uiSchema = {
  application: {
    applicant: {
      'view:applicantInfo': {
        mailingAddress: merge(
          {},
          address.uiSchema("Preparer's mailing address"),
          {
            country: { 'ui:required': isAuthorizedAgent },
            street: {
              'ui:title': 'Street address',
              'ui:required': isAuthorizedAgent,
            },
            street2: {
              'ui:title': 'Street address line 2',
            },
            city: { 'ui:required': isAuthorizedAgent },
            state: {
              'ui:title': preparerMailingAddressStateTitleWrapper,
              'ui:required': isAuthorizedAgent,
              'ui:options': {
                hideIf: formData => !preparerAddressHasState(formData),
              },
            },
            postalCode: { 'ui:required': isAuthorizedAgent },
          },
        ),
      },
      'view:contactInfo': {
        'ui:title': ContactDetailsTitle,
        applicantPhoneNumber: merge({}, preparerPhoneUI('Phone number'), {
          'ui:required': isAuthorizedAgent,
        }),
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
        applicant: {
          type: 'object',
          properties: {
            'view:applicantInfo': {
              type: 'object',
              properties: {
                mailingAddress: address.schema(fullSchemaPreNeed),
              },
            },
            'view:contactInfo': {
              type: 'object',
              properties: {
                applicantPhoneNumber: applicant.properties.applicantPhoneNumber,
              },
            },
          },
        },
      },
    },
  },
};
