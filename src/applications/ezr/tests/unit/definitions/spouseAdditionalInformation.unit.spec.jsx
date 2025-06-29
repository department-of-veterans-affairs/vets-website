import React from 'react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../config/form';
import spouseAdditionalInformationPage from '../../../definitions/spouseAdditionalInformation';
import { renderProviderWrappedComponent } from '../../helpers';

describe('ezr spouseAdditionalInformationPage config', () => {
  const { schema, uiSchema } = spouseAdditionalInformationPage();
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

  it('should have required fields', () => {
    expect(schema.required).to.include('sameAddress');
    expect(schema.required).to.include('cohabitedLastYear');
  });

  it('should have correct properties', () => {
    expect(schema.properties).to.have.property('cohabitedLastYear');
    expect(schema.properties).to.have.property('sameAddress');
  });

  it('should have yes/no schema for both fields', () => {
    expect(schema.properties.cohabitedLastYear.type).to.equal('boolean');
    expect(schema.properties.sameAddress.type).to.equal('boolean');
  });
});
