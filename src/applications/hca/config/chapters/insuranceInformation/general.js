/* eslint-disable no-param-reassign */
import React from 'react';
import merge from 'lodash/merge';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

import InsuranceProviderView from '../../../components/InsuranceProviderView';

import {
  healthInsuranceDescription,
  healthInsuranceCoverageQuestionDescription,
  hasTricareWhatIsMyPolicyNumberDescription,
  NO_POLICY_OR_GROUP_ERROR,
} from '../../../helpers';

import PolicyOrGroupTitleComponent from '../../../components/PolicyOrGroupTitleComponent';

const { provider } = fullSchemaHca.definitions;
const { isCoveredByHealthInsurance } = fullSchemaHca.properties;

export const generalQuestion = {
  uiSchema: {
    'ui:description': healthInsuranceDescription,
    isCoveredByHealthInsurance: {
      'ui:title': 'Do you have health insurance coverage?',
      'ui:description': healthInsuranceCoverageQuestionDescription,
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['isCoveredByHealthInsurance'],
    properties: {
      isCoveredByHealthInsurance,
    },
  },
};

export const generalProvider = {
  uiSchema: {
    'ui:description': healthInsuranceCoverageQuestionDescription,
    providers: {
      'ui:options': {
        itemName: 'Insurance Policy',
        viewField: InsuranceProviderView,
      },
      'ui:errorMessages': {
        minItems: 'You need to at least one provider.',
      },
      items: {
        insuranceName: {
          'ui:title': 'Name of provider',
          'ui:autofocus': true,
        },
        insurancePolicyHolderName: {
          'ui:title': 'Name of policyholder',
        },
        'view:policyOrGroupDesc': {
          'ui:description': <PolicyOrGroupTitleComponent />,
        },
        'view:hasTricare': {
          'ui:description': hasTricareWhatIsMyPolicyNumberDescription,
        },
        insurancePolicyNumber: {
          'ui:title': 'Policy number',
        },
        'view:or': {
          'ui:description': (
            <div
              className="schemaform-block-title schemaform-block-subtitle"
              style={{ marginBottom: '-20px' }}
            >
              <strong>or</strong>
            </div>
          ),
        },
        insuranceGroupCode: {
          'ui:title': 'Group code',
        },
        'ui:validations': [
          (errors, field) => {
            if (!field.insurancePolicyNumber && !field.insuranceGroupCode) {
              errors.insuranceGroupCode.addError('');
              errors.insurancePolicyNumber.addError('');
              field['view:policyOrGroupDesc'][NO_POLICY_OR_GROUP_ERROR] = true;
            } else {
              delete field['view:policyOrGroupDesc'][NO_POLICY_OR_GROUP_ERROR];
            }
          },
        ],
        'ui:order': [
          'insuranceName',
          'insurancePolicyHolderName',
          'view:policyOrGroupDesc',
          'view:hasTricare',
          'insurancePolicyNumber',
          'view:or',
          'insuranceGroupCode',
        ],
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      providers: {
        type: 'array',
        minItems: 1,
        items: merge({}, provider, {
          required: ['insuranceName', 'insurancePolicyHolderName'],
          properties: {
            'view:policyOrGroupDesc': {
              type: 'object',
              properties: {},
            },
            'view:hasTricare': {
              type: 'object',
              properties: {},
            },
            'view:or': {
              type: 'object',
              properties: {},
            },
          },
        }),
      },
    },
  },
};
