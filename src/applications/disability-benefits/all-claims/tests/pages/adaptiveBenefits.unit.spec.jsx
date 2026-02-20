import React from 'react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { render } from '@testing-library/react';
import formConfig from '../../config/form';

describe('526 adaptive benefits page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.adaptiveBenefits;

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
      />,
    );
    // Should have 2 va-radio components (modifyingHome and modifyingCar)
    expect(container.querySelectorAll('va-radio').length).to.equal(2);
    // Should have 4 va-radio-option elements (2 yes/no pairs)
    expect(container.querySelectorAll('va-radio-option').length).to.equal(4);
    expect(container.querySelector('va-alert')).to.not.exist;
  });

  it('should show the double vehicle allowance alert', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:modifyingCar': true,
          'view:needsCarHelp': {
            'view:alreadyClaimedVehicleAllowance': true,
          },
        }}
      />,
    );
    // Should have 3 va-radio components (modifyingHome, modifyingCar, and alreadyClaimedVehicleAllowance)
    expect(container.querySelectorAll('va-radio').length).to.equal(3);
    // Should have 6 va-radio-option elements (3 yes/no pairs)
    expect(container.querySelectorAll('va-radio-option').length).to.equal(6);
    expect(container.querySelector('va-alert')).to.exist;
  });
});
