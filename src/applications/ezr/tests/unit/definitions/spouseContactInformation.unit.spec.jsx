import React from 'react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../config/form';
import spouseContactInformationPage from '../../../definitions/spouseContactInformation';
import { renderProviderWrappedComponent } from '../../helpers';

describe('ezr spouseContactInformationPage config', () => {
  const { schema, uiSchema } = spouseContactInformationPage();
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
    expect(schema.required).to.include('spouseAddress');
    expect(schema.required).to.include('spousePhone');
  });

  it('should have correct properties', () => {
    expect(schema.properties).to.have.property('spouseAddress');
    expect(schema.properties).to.have.property('spousePhone');
  });

  it('should have address schema without military field', () => {
    expect(schema.properties.spouseAddress.properties).to.not.have.property(
      'isMilitary',
    );
  });

  it('should have phone field with error messages', () => {
    expect(uiSchema.spousePhone['ui:errorMessages']).to.exist;
    expect(uiSchema.spousePhone['ui:errorMessages'].required).to.exist;
    expect(uiSchema.spousePhone['ui:errorMessages'].pattern).to.exist;
  });
});
