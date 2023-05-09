import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import { merge } from 'lodash';
import get from 'platform/utilities/data/get';
import omit from 'platform/utilities/data/omit';
import environment from 'platform/utilities/environment';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';

import * as address from '../../definitions/address';

import {
  isAuthorizedAgent,
  formatName,
  authorizedAgentDescription,
  nonRequiredFullNameUI,
} from '../../utils/helpers';

const { applicant } = fullSchemaPreNeed.properties.application.properties;

const { fullName } = fullSchemaPreNeed.definitions;

const nonRequiredFullName = omit('required', fullName);

const stateRequired = environment.isProduction()
  ? {
      country: { 'ui:required': isAuthorizedAgent },
      street: { 'ui:required': isAuthorizedAgent },
      city: { 'ui:required': isAuthorizedAgent },
      state: { 'ui:required': isAuthorizedAgent },
      postalCode: { 'ui:required': isAuthorizedAgent },
    }
  : {
      country: { 'ui:required': isAuthorizedAgent },
      street: { 'ui:required': isAuthorizedAgent },
      city: { 'ui:required': isAuthorizedAgent },
      postalCode: { 'ui:required': isAuthorizedAgent },
    };

export const uiSchema = {
  application: {
    applicant: {
      applicantRelationshipToClaimant: {
        'ui:title': 'Who is filling out this application?',
        'ui:widget': 'radio',
        'ui:options': {
          updateSchema: formData => {
            const nameData = get('application.claimant.name', formData);
            const applicantName = nameData ? formatName(nameData) : null;

            return {
              enumNames: [applicantName || 'Myself', 'Someone else'],
            };
          },
          nestedContent: {
            'Authorized Agent/Rep': authorizedAgentDescription,
          },
        },
      },
      'view:applicantInfo': {
        'ui:options': {
          expandUnder: 'applicantRelationshipToClaimant',
          expandUnderCondition: 'Authorized Agent/Rep',
        },
        name: merge({}, nonRequiredFullNameUI, {
          'ui:title': 'Preparer information',
          first: { 'ui:required': isAuthorizedAgent },
          last: { 'ui:required': isAuthorizedAgent },
        }),
        mailingAddress: merge(
          {},
          address.uiSchema('Mailing address'),
          stateRequired,
        ),
        'view:contactInfo': {
          'ui:title': 'Contact information',
          applicantPhoneNumber: merge({}, phoneUI('Primary telephone number'), {
            'ui:required': isAuthorizedAgent,
          }),
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
          required: ['applicantRelationshipToClaimant'],
          properties: {
            applicantRelationshipToClaimant:
              applicant.properties.applicantRelationshipToClaimant,
            'view:applicantInfo': {
              type: 'object',
              properties: {
                name: nonRequiredFullName,
                mailingAddress: address.schema(fullSchemaPreNeed),
                'view:contactInfo': {
                  type: 'object',
                  properties: {
                    applicantPhoneNumber:
                      applicant.properties.applicantPhoneNumber,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
