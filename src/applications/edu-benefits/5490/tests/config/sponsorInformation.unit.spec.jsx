// Could be renamed to militaryServiceContributions, but for consistency...

import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../../5490/config/form';

describe('Edu 5490 sponsorInformation', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.sponsorInformation.pages.sponsorInformation;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{ relationship: 'child', benefit: 'chapter33' }}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input,select').length).to.equal(12);
  });

  it('should display date options for chapter 33 and spouse relationship', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{ relationship: 'spouse', benefit: 'chapter33' }}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('#root_veteranDateOfDeathMonth').length).to.equal(0);
    expect(form.find('#root_veteranDateOfDeathDay').length).to.equal(0);
    expect(form.find('#root_veteranDateOfDeathYear').length).to.equal(0);
    expect(form.find('input').length).to.equal(13);

    form.unmount();
  });

  it('should display single death date for chapter 33 and child relationship', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{ relationship: 'child', benefit: 'chapter33' }}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('#root_veteranDateOfDeathMonth').length).to.equal(1);
    expect(form.find('#root_veteranDateOfDeathDay').length).to.equal(1);
    expect(form.find('#root_veteranDateOfDeathYear').length).to.equal(1);

    form.unmount();
  });

  it('should display single death date for chapter 35 and child relationship', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{ relationship: 'child', benefit: 'chapter35' }}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('#root_veteranDateOfDeathMonth').length).to.equal(1);
    expect(form.find('#root_veteranDateOfDeathDay').length).to.equal(1);
    expect(form.find('#root_veteranDateOfDeathYear').length).to.equal(1);

    form.unmount();
  });

  it('should display single death date for chapter 35 and spouse relationship', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{ relationship: 'spouse', benefit: 'chapter35' }}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('#root_veteranDateOfDeathMonth').length).to.equal(1);
    expect(form.find('#root_veteranDateOfDeathDay').length).to.equal(1);
    expect(form.find('#root_veteranDateOfDeathYear').length).to.equal(1);

    form.unmount();
  });

  it('should conditionally show spouseInfo options', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{ relationship: 'spouse', benefit: 'chapter33' }}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = findDOMNode(form);
    expect(formDOM.querySelectorAll('input,select').length).to.equal(16);

    // The divorce input should be there now
    expect(formDOM.querySelector('input#root_spouseInfo_divorcePendingYes')).to
      .not.be.null;
    // But remarriage date shouldn't be yet
    expect(
      formDOM.querySelector('input[name=root_spouseInfo_remarriageDateMonth]'),
    ).to.be.null;

    // Select remarried
    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_spouseInfo_remarriedYes'),
      {
        target: {
          checked: true,
        },
      },
    );
    // Remarried date should now appear
    expect(
      formDOM.querySelector('select[name=root_spouseInfo_remarriageDateMonth]'),
    ).to.not.be.null;
  });
});
