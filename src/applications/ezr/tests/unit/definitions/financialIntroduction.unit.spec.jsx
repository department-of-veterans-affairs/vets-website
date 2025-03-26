import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { Provider } from 'react-redux';
import formConfig from '../../../config/form';
import { FinancialIntroductionPage } from '../../../definitions/financialIntroduction';

describe('ezr FinancialIntroductionPage config', () => {
  const { schema, uiSchema } = FinancialIntroductionPage;
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
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  it('should render', () => {
    const { mockStore } = getData();
    const { getByTestId } = render(
      <Provider store={mockStore}>
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    // Verify the FinancialInformationIntroduction component is rendered
    expect(getByTestId('financial-information-introduction')).to.exist;
  });
});
