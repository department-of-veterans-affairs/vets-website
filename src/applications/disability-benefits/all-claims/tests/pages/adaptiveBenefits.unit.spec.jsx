import React from 'react';
import { expect } from 'chai';
import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe('526 adaptive benefits page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.adaptiveBenefits;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
      />,
    );
    expect(form.find('input').length).to.equal(4);
    expect(form.find('AlertBox').length).to.equal(0);
  });

  it('should show the double vehicle allowance alert', () => {
    const form = mount(
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
    expect(form.find('input').length).to.equal(6);
    expect(form.find('AlertBox').length).to.equal(1);
  });
});
