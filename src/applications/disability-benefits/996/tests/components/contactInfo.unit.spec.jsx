import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import contactInfo from '../../pages/contactInformation';

describe('Higher-Level Review 0996 contact information', () => {
  it('should render an empty contact information block', () => {
    const form = mount(
      <DefinitionTester
        definitions={{}}
        schema={contactInfo.schema}
        data={{}}
        formData={{}}
        uiSchema={contactInfo.uiSchema}
      />,
    );
    expect(form.find('.blue-bar-block').length).to.equal(1);
    form.unmount();
  });
  it('should render a U.S. contact information block', () => {
    const data = {
      phoneNumber: '8005551212',
      emailAddress: 'foo@bar.com',
      addressLine1: '123 Main St',
      city: 'FOOBURG',
      stateOrProvinceCode: 'Confusion',
      zipPostalCode: '123456',
      countryCode: '',
    };
    const form = mount(
      <DefinitionTester
        definitions={{}}
        schema={contactInfo.schema}
        data={{ veteran: data }}
        formData={{}}
        uiSchema={contactInfo.uiSchema}
      />,
    );
    const blocks = form.find('.blue-bar-block p');
    expect(blocks).to.have.lengthOf(3);
    expect(blocks.at(0).text()).to.contain('800-555-1212');
    expect(blocks.at(1).text()).to.contain('foo@bar.com');
    expect(blocks.at(2).text()).to.contain('123 Main St');
    expect(blocks.at(2).text()).to.contain('Fooburg, Confusion 123456');
    form.unmount();
  });
  it('should render the country in a non-U.S. address', () => {
    const data = {
      phoneNumber: '8005551212',
      emailAddress: 'foo@bar.com',
      addressLine1: '123 Main St',
      addressLine2: 'Sector A',
      addressLine3: 'UNIT 1',
      city: 'FOOBURG',
      stateOrProvinceCode: 'Confusion',
      zipPostalCode: '123456',
      countryCode: 'FRA',
    };
    const form = mount(
      <DefinitionTester
        definitions={{}}
        schema={contactInfo.schema}
        data={{ veteran: data }}
        formData={{}}
        uiSchema={contactInfo.uiSchema}
      />,
    );
    const blocks = form.find('.blue-bar-block p');
    expect(blocks).to.have.lengthOf(3);
    expect(blocks.at(0).text()).to.contain('800-555-1212');
    expect(blocks.at(1).text()).to.contain('foo@bar.com');
    expect(blocks.at(2).text()).to.contain('123 Main St');
    expect(blocks.at(2).text()).to.contain('Sector A');
    expect(blocks.at(2).text()).to.contain('Unit 1');
    expect(blocks.at(2).text()).to.contain('Fooburg, Confusion 123456');
    expect(blocks.at(2).text()).to.contain('France');
    form.unmount();
  });
});
