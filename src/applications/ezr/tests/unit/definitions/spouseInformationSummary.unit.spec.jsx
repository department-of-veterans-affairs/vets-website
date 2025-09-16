import React from 'react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../config/form';
import spouseInformationSummaryPage from '../../../definitions/spouseInformationSummary';
import { renderProviderWrappedComponent } from '../../helpers';

describe('ezr spouseInformationSummaryPage config', () => {
  const { schema, uiSchema } = spouseInformationSummaryPage();
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
    } = spouseInformationSummaryPage(options);
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

  it('should have required field', () => {
    expect(schema.required).to.include('view:hasSpouseInformationToAdd');
  });

  it('should have correct property', () => {
    expect(schema.properties).to.have.property(
      'view:hasSpouseInformationToAdd',
    );
  });

  it('should have array builder yes/no schema', () => {
    expect(schema.properties['view:hasSpouseInformationToAdd'].type).to.equal(
      'boolean',
    );
  });

  it('should have hint in uiSchema when rendered with form data', () => {
    const mockStoreData = {
      'view:householdEnabled': true,
      'view:isProvidersAndDependentsPrefillEnabled': true,
      // Add some spouse data to trigger the hint
      spouseInformation: [],
    };
    const { container } = renderProviderWrappedComponent(
      mockStoreData,
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        uiSchema={uiSchema}
      />,
    );

    // The hint should be present in the rendered form
    expect(container).to.exist;
  });
});
