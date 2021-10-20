import React from 'react';
import merge from 'lodash/merge';
import get from 'platform/utilities/data/get';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

import InsuranceProviderView from '../../../components/InsuranceProviderView';

const { provider } = fullSchemaHca.definitions;
const { isCoveredByHealthInsurance } = fullSchemaHca.properties;

const insuranceInfo = (
  <>
    <p>Do you have health insurance coverage?</p>
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
          money you pay toward your care each year before your insurance starts
          to pay for care.
        </li>
      </ul>
    </AdditionalInfo>
  </>
);

export default {
  uiSchema: {
    isCoveredByHealthInsurance: {
      'ui:title':
        'Health insurance includes any coverage that you get through a spouse or significant other. Health insurance also includes Medicare, private insurance, or insurance from your employer.',
      'ui:widget': 'yesNo',
      'ui:description': insuranceInfo,
    },
    // providers: {
    //   'ui:options': {
    //     itemName: 'Insurance Policy',
    //     expandUnder: 'isCoveredByHealthInsurance',
    //     viewField: InsuranceProviderView,
    //   },
    //   'ui:errorMessages': {
    //     minItems: 'You need to at least one provider.',
    //   },
    //   items: {
    //     insuranceName: {
    //       'ui:title': 'Name of provider',
    //     },
    //     insurancePolicyHolderName: {
    //       'ui:title': 'Name of policyholder',
    //     },
    //     insurancePolicyNumber: {
    //       'ui:title':
    //         'Policy number (either this or the group code is required)',
    //       'ui:required': (formData, index) =>
    //         !get(`providers[${index}].insuranceGroupCode`, formData),
    //       'ui:errorMessages': {
    //         pattern: 'Please provide a valid policy number.',
    //       },
    //     },
    //     insuranceGroupCode: {
    //       'ui:title': 'Group code (either this or policy number is required)',
    //       'ui:required': (formData, index) =>
    //         !get(`providers[${index}].insurancePolicyNumber`, formData),
    //       'ui:errorMessages': {
    //         pattern: 'Please provide a valid group code.',
    //       },
    //     },
    //   },
    // },
  },
  schema: {
    type: 'object',
    required: ['isCoveredByHealthInsurance'],
    properties: {
      isCoveredByHealthInsurance,
      // providers: {
      //   type: 'array',
      //   minItems: 1,
      //   items: merge({}, provider, {
      //     required: [
      //       'insuranceName',
      //       'insurancePolicyHolderName',
      //       'insurancePolicyNumber',
      //       'insuranceGroupCode',
      //     ],
      //   }),
      // },
    },
  },
};
