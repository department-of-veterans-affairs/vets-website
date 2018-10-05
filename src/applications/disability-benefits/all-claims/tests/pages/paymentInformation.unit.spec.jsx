import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils';
import {
  mockApiRequest,
  resetFetch,
} from '../../../../../platform/testing/unit/helpers';

import formConfig from '../../config/form.js';

const {
  schema,
  uiSchema,
} = formConfig.chapters.additionalInformation.pages.paymentInformation;

const originalFetch = global.fetch;

describe('526 -- fetchPaymentInformation', () => {
  // Set up the api response before each test; running once before all the tests was
  //  causing fetch() to return undefined for some reason.
  beforeEach(() => {
    mockApiRequest({
      data: {
        attributes: {
          responses: [
            {
              paymentAccount: {
                accountType: 'checking',
                accountNumber: '1234567890',
                financialInstitutionRoutingNumber: '0987654321',
                financialInstitutionName: 'Some bank',
              },
            },
          ],
        },
      },
    });
  });

  // Reset the spy after every test
  afterEach(() => resetFetch());

  // Tear down the fetch mock when we're done with all the tests
  after(() => {
    global.fetch = originalFetch;
  });

  it('should fetch payment information from the api', () => {
    mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );
    // expect(global.fetch.calledWith('/ppiu/payment_information')).to.be.true;
    expect(global.fetch.called).to.be.true;
  });

  it('should display masked payment information', done => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );
    setTimeout(() => {
      const text = form.text();
      // 'ending with' because of the srSubstitute
      expect(text).to.include('●●●●●●ending with7890');
      expect(text).to.include('●●●●●●ending with4321');
      expect(text).to.include('Some bank');
      expect(text).to.include('Checking Account');
      done();
    });
  });
});
