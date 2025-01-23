import React from 'react';
import merge from 'lodash/merge';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

import InsuranceProviderView from '../../../components/InsuranceProviderView';

import {
  healthInsuranceCoverageQuestionDescription,
  hasTricareWhatIsMyPolicyNumberDescription,
  healthInsuranceDescription,
} from '../../../helpers';

const { provider } = fullSchemaHca.definitions;
const { isCoveredByHealthInsurance } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:description': healthInsuranceDescription,
    isCoveredByHealthInsurance: {
      'ui:title': 'Do you have health insurance coverage?',
      'ui:description': healthInsuranceCoverageQuestionDescription,
      'ui:widget': 'yesNo',
    },
    providers: {
      'ui:options': {
        expandUnder: 'isCoveredByHealthInsurance',
        itemName: 'insurance policy',
        hideTitle: true,
        viewField: InsuranceProviderView,
      },
      'ui:errorMessages': {
        minItems: 'You need to at least one provider.',
      },
      items: {
        insuranceName: {
          'ui:title': 'Name of insurance provider',
        },
        insurancePolicyHolderName: {
          'ui:title':
            'Name of policyholder (the person whose name the policy is in)',
        },
        'view:policyOrGroupDesc': {
          'ui:description': (
            <div className="vads-u-margin-top--6 vads-u-margin-bottom--2 schemaform-block-title schemaform-block-subtitle vads-u-color--primary-darker">
              {' '}
              Provide either your insurance policy number or group code.{' '}
              <span className="schemaform-required-span vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
                (*Required)
              </span>
            </div>
          ),
        },
        'view:hasTricare': {
          'ui:description': hasTricareWhatIsMyPolicyNumberDescription,
        },
        insurancePolicyNumber: {
          'ui:title': (
            <div>
              <p className="vads-u-margin-bottom--1">Policy number</p>
              <p className="vads-u-color--gray vads-u-margin-top--0 vads-u-margin-bottom--0">
                Either this or the group code is required
              </p>
            </div>
          ),
        },
        'view:or': {
          'ui:description': (
            <div className="schemaform-block-title schemaform-block-subtitle vads-u-margin-bottom--neg2p5 vads-u-color--primary-darker">
              or
            </div>
          ),
        },
        insuranceGroupCode: {
          'ui:title': (
            <div>
              <p className="vads-u-margin-bottom--1">Group code</p>
              <p className="vads-u-color--gray vads-u-margin-top--0 vads-u-margin-bottom--0">
                Either this or the policy number is required
              </p>
            </div>
          ),
        },
        'ui:validations': [
          (errors, field) => {
            if (!field.insurancePolicyNumber && !field.insuranceGroupCode) {
              errors.insuranceGroupCode.addError(
                'Group code (either this or the policy number is required)',
              );
              errors.insurancePolicyNumber.addError(
                'Policy number (either this or the group code is required)',
              );
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
    required: ['isCoveredByHealthInsurance'],
    properties: {
      isCoveredByHealthInsurance,
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
