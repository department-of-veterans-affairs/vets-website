import React from 'react';
import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import {
  testSubmitsWithoutErrors,
  FakeProvider,
  testComponentFieldsMarkedAsRequired,
  testNumberOfWebComponentFields,
  testNumberOfFieldsByType,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import netWorthEstimation, {
  hideIfUnder25000,
} from '../../../../config/chapters/05-financial-information/netWorthEstimation';
import getFixtureData, {
  FixtureDataType,
} from '../../../fixtures/vets-json-api/getFixtureData';

const { schema, uiSchema } = netWorthEstimation;

describe('Financial information net worth estimation pension page', () => {
  const pageTitle = 'net worth estimation';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    formConfig,
    schema,
    uiSchema,
    [`va-text-input[label="Estimate the total value of your assets"]`],
    pageTitle,
  );

  testSubmitsWithoutErrors(formConfig, schema, uiSchema, pageTitle);

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-text-input': 1,
    },
    pageTitle,
  );

  it.skip('should show warning', async () => {
    const { container } = render(
      <FakeProvider>
        <DefinitionTester
          schema={schema}
          data={getFixtureData(FixtureDataType.OVERFLOW)}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
        />
      </FakeProvider>,
    );
    expect($$('va-alert', container).length).to.equal(0);

    const webComponent = container.querySelector(
      'va-text-input[name="root_netWorthEstimation"]',
    );
    webComponent.value = 25001;
    webComponent.dispatchEvent(
      new CustomEvent('input', { bubbles: true, composed: true }),
    );
    await waitFor(() => {
      expect($$('va-alert', container).length).to.equal(1);
    });
  });

  describe('hideIfUnder25000', () => {
    it('should return true if under 25000', () => {
      expect(hideIfUnder25000({ netWorthEstimation: 24999 })).to.be.true;
    });
    it('should return false if over 25000', () => {
      expect(hideIfUnder25000({ netWorthEstimation: 26000 })).to.be.false;
    });
    it('should return true if undefined', () => {
      expect(hideIfUnder25000({})).to.be.true;
    });
    it('should return true if null', () => {
      expect(hideIfUnder25000({ netWorthEstimation: null })).to.be.true;
    });
  });
});
