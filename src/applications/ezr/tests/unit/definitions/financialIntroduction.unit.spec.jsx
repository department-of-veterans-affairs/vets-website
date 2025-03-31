import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { Provider } from 'react-redux';
import formConfig from '../../../config/form';
import { FinancialIntroductionPage } from '../../../definitions/financialIntroduction';
import { setMockStoreData } from '../../helpers';

describe('ezr FinancialIntroductionPage config', () => {
  const { schema, uiSchema } = FinancialIntroductionPage;
  const definitions = {
    ...formConfig.defaultDefinitions,
  };

  it('should render', () => {
    const { mockStore } = setMockStoreData({
      'view:householdEnabled': true,
      'view:isProvidersAndDependentsPrefillEnabled': true,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect(container).to.exist;
  });
});
