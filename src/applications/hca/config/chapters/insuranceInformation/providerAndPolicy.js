import React from 'react';
import merge from 'lodash/merge';
// import get from 'platform/utilities/data/get';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

import InsuranceProviderView from '../../../components/InsuranceProviderView';

const { provider } = fullSchemaHca.definitions;

const insuranceInfo = (
  <AdditionalInfo triggerText="Why we ask for this information">
    <p>
      We ask this information for billing purposes only. Your health insurance
      coverage doesn’t affect the VA health care benefits you can get.
    </p>
    <p>
      Giving us your health insurance information helps you for these reasons:
    </p>
    <ul>
      <li>
        We must bill your private health insurance provider for any care,
        supplies, or medicines we provide to treat your non-service-connected
        conditions. If you have a VA copayment, we may be able to use the
        payments from your provider to cover some or all of your copayment.
      </li>
      <li>
        Your private insurance provider may apply your VA health care charges
        toward your annual deductible. Your annual deductible is the amount of
        money you pay toward your care each year before your insurance starts to
        pay for care.
      </li>
    </ul>
  </AdditionalInfo>
);

const triCareInfo = (
  <>
    <p>
      <AdditionalInfo triggerText="I have TRICARE. What’s my policy number?">
        <p>
          You can use your Department of Defense benefits number (DBN) or your
          Social Security number as your policy number.
        </p>
        <p>
          Your DBN is an 11-digit number. You’ll find this number on the back of
          your military ID card.
        </p>
      </AdditionalInfo>
    </p>
    <p>Policy Number</p>
  </>
);

export default {
  uiSchema: {
    providers: {
      'ui:options': {
        viewField: InsuranceProviderView,
      },
      'ui:description': insuranceInfo,
      'ui:errorMessages': {
        minItems: 'You need to at least one provider.',
      },
      items: {
        insuranceName: {
          'ui:title': <span>Name of insurance provider</span>,
        },
        insurancePolicyHolderName: {
          'ui:title': (
            <span>
              Name of policyholder (the person whose name the policy is in)
            </span>
          ),
        },
        insurancePolicyNumber: {
          'ui:title': (
            <>
              <span>
                Provide either your insurance policy number or group code
              </span>
              <span className="schemaform-required-span">(*Required)</span>
            </>
          ),
          'ui:description': triCareInfo,
          'ui:errorMessages': {
            pattern: 'Please provide a valid policy number.',
          },
        },
        insuranceGroupCode: {
          'ui:title': (
            <>
              <p style={{ fontWeight: 'bold' }}>or</p>
              <p>Group Code</p>
            </>
          ),
          'ui:errorMessages': {
            pattern: 'Please provide a valid group code.',
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['isCoveredByHealthInsurance'],
    properties: {
      providers: {
        type: 'array',
        minItems: 1,
        items: merge({}, provider, {
          required: [
            'insuranceName',
            'insurancePolicyHolderName',
            // 'insurancePolicyNumber',
            // 'insuranceGroupCode',
          ],
        }),
      },
    },
  },
};
