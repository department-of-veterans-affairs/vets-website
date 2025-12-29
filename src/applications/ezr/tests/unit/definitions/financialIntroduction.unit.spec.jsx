import React from 'react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../config/form';
import FinancialIntroductionPage from '../../../definitions/financialIntroduction';
import { renderProviderWrappedComponent } from '../../helpers';

describe('ezr FinancialIntroductionPage config', () => {
  const { schema, uiSchema } = FinancialIntroductionPage;
  const definitions = {
    ...formConfig.defaultDefinitions,
  };

  it('should render', () => {
    const mockStoreData = {
      'view:householdEnabled': true,
      'view:isProvidersAndDependentsPrefillEnabled': true,
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
  });
});
