import React from 'react';
import merge from 'lodash/merge';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

import InsuranceProviderView from '../../../components/InsuranceProviderView';

import {
  healthInsuranceDescription,
  healthInsuranceCoverageQuestionDescription,
  hasTricareWhatIsMyPolicyNumberDescription,
} from '../../../helpers';

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
        itemName: 'insurance policy',
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
          'ui:description': (
            <div className="vads-u-margin-top--6 vads-u-margin-bottom--2 schemaform-block-title schemaform-block-subtitle">
              {' '}
              Provide either your insurance policy number or group code.{' '}
              <span className="schemaform-required-span vads-u-font-weight--normal">
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
            <div className="schemaform-block-title schemaform-block-subtitle vads-u-margin-bottom--neg2p5">
              <strong>or</strong>
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
