import React from 'react';
import { merge } from 'lodash';

import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import * as address from '../../definitions/address';

import phoneUI from '../../components/Phone';
import emailUI from '../../definitions/email';

import {
  isAuthorizedAgent,
  preparerAddressHasState,
  MailingAddressStateTitle,
  PreparerPhoneNumberDescription,
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
        mailingAddress: merge({}, address.uiSchema('Your mailing address'), {
          country: {
            'ui:required': isAuthorizedAgent,
            'ui:errorMessages': {
              required: 'Select Country',
            },
          },
          street: {
            'ui:title': 'Street address',
            'ui:required': isAuthorizedAgent,
            'ui:errorMessages': {
              required: 'Enter a street address',
            },
          },
          street2: {
            'ui:title': 'Street address line 2',
          },
          city: {
            'ui:required': isAuthorizedAgent,
            'ui:errorMessages': {
              required: 'Enter a city',
            },
          },
          state: {
            'ui:title': preparerMailingAddressStateTitleWrapper,
            'ui:required': isAuthorizedAgent,
            'ui:options': {
              hideIf: formData => !preparerAddressHasState(formData),
            },
            'ui:errorMessages': {
              enum: 'Select a state or territory',
            },
          },
          postalCode: {
            'ui:required': isAuthorizedAgent,
            'ui:errorMessages': {
              required: 'Enter a postal code',
            },
          },
        }),
      },
      'view:contactInfo': {
        'ui:title': ContactDetailsTitle,
        applicantPhoneNumber: merge({}, phoneUI('Phone number'), {
          'ui:required': isAuthorizedAgent,
        }),
        applicantEmail: merge({}, emailUI(), {
          'ui:required': isAuthorizedAgent,
        }),
        'view:contactInfoDescription': {
          'ui:description': PreparerPhoneNumberDescription,
          'ui:options': {
            displayEmptyObjectOnReview: true,
          },
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
                applicantEmail: applicant.properties.applicantEmail,
                'view:contactInfoDescription': {
                  type: 'object',
                  properties: {},
                },
              },
            },
          },
        },
      },
    },
  },
};
