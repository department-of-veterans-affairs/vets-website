import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { Provider } from 'react-redux';
import formConfig from '../../../config/form';
import { FinancialSummaryPage } from '../../../definitions/financialSummary';
import mockPrefillWithNonPrefillData from '../../e2e/fixtures/mocks/mock-prefill-with-non-prefill-data.json';
import { LAST_YEAR } from '../../../utils/constants';

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

  const getData = () => ({
    mockStore: {
      getState: () => ({
        form: {
          data: {
            'view:householdEnabled': true,
            'view:isProvidersAndDependentsPrefillEnabled': true,
            nonPrefill: mockPrefillWithNonPrefillData.nonPrefill,
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  it('should render', () => {
    const { mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    // Verify the va-radio element is rendered with the correct label
    expect(
      container.querySelector(
        `va-radio[label="Do you have any income and deductible to add for ${LAST_YEAR}?"]`,
      ),
    ).to.exist;
  });
});
