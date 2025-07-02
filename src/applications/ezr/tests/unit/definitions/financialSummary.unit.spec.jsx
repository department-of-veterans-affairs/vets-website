import React from 'react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../config/form';
import { FinancialSummaryPage } from '../../../definitions/financialSummary';
import mockPrefillWithNonPrefillData from '../../e2e/fixtures/mocks/mock-prefill-with-non-prefill-data.json';
import { LAST_YEAR } from '../../../utils/constants';
import { renderProviderWrappedComponent } from '../../helpers';

describe('ezr FinancialSummaryPage config', () => {
  const { schema, uiSchema } = FinancialSummaryPage({
    arrayPath: 'financialInformation',
    required: false,
    maxItems: 1,
    hideMaxItemsAlert: true,
    text: {
      getItemName: `Your annual income from ${LAST_YEAR}`,
    },
  });
  const definitions = {
    ...formConfig.defaultDefinitions,
  };

  it('should render', () => {
    const mockStoreData = {
      'view:householdEnabled': true,
      'view:isProvidersAndDependentsPrefillEnabled': true,
      nonPrefill: mockPrefillWithNonPrefillData.formData.nonPrefill,
    };
    const { container } = renderProviderWrappedComponent(
      mockStoreData,
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        uiSchema={uiSchema}
      />,
    );

    expect(container).to.exist;
    expect(
      container.querySelector(
        `va-radio[label="Do you have any income and deductible to add for ${LAST_YEAR}?"]`,
      ),
    ).to.exist;
  });
});
