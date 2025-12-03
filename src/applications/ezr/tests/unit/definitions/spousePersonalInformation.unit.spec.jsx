import React from 'react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../config/form';
import spousePersonalInformationPage from '../../../definitions/spousePersonalInformation';
import { renderProviderWrappedComponent } from '../../helpers';

describe('ezr spousePersonalInformationPage config', () => {
  const { schema, uiSchema } = spousePersonalInformationPage();
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

  it('should render with custom options', () => {
    const options = { nounSingular: 'spouse' };
    const {
      schema: customSchema,
      uiSchema: customUiSchema,
    } = spousePersonalInformationPage(options);
    const mockStoreData = {
      'view:householdEnabled': true,
      'view:isProvidersAndDependentsPrefillEnabled': true,
    };
    const { container } = renderProviderWrappedComponent(
      mockStoreData,
      <DefinitionTester
        schema={customSchema}
        definitions={definitions}
        uiSchema={customUiSchema}
      />,
    );

    expect(container).to.exist;
  });

  it('should have required fields', () => {
    expect(schema.required).to.include('spouseSocialSecurityNumber');
    expect(schema.required).to.include('spouseDateOfBirth');
    expect(schema.required).to.include('dateOfMarriage');
  });

  it('should have correct properties', () => {
    expect(schema.properties).to.have.property('spouseFullName');
    expect(schema.properties).to.have.property('spouseSocialSecurityNumber');
    expect(schema.properties).to.have.property('spouseDateOfBirth');
    expect(schema.properties).to.have.property('dateOfMarriage');
  });
});
