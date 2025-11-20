import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Pre-need sponsor military name information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.militaryName.pages.sponsorMilitaryNameInformation;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        formData={{}}
      />,
    );
    // There are 3 va-text-inputs and 1 va-select
    expect(form.find('va-text-input').length).to.equal(3);
    expect(form.find('va-select').length).to.equal(1);
    form.unmount();
  });

  it('should submit with required fields filled in', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
        formData={{}}
      />,
    );
    // Fill in first and last name
    const firstName = form
      .find('va-text-input')
      .at(0)
      .getDOMNode();
    firstName.value = 'Jane';
    firstName.dispatchEvent(new Event('input', { bubbles: true }));

    const lastName = form
      .find('va-text-input')
      .at(2)
      .getDOMNode();
    lastName.value = 'Smith';
    lastName.dispatchEvent(new Event('input', { bubbles: true }));

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit with all info filled in', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
        formData={{}}
      />,
    );

    // Fill in all name fields
    const firstName = form
      .find('va-text-input')
      .at(0)
      .getDOMNode();
    firstName.value = 'Jane';
    firstName.dispatchEvent(new Event('input', { bubbles: true }));

    const middleName = form
      .find('va-text-input')
      .at(1)
      .getDOMNode();
    middleName.value = 'M';
    middleName.dispatchEvent(new Event('input', { bubbles: true }));

    const lastName = form
      .find('va-text-input')
      .at(2)
      .getDOMNode();
    lastName.value = 'Smith';
    lastName.dispatchEvent(new Event('input', { bubbles: true }));

    // Select suffix
    const suffixSelect = form
      .find('va-select')
      .at(0)
      .getDOMNode();
    suffixSelect.value = 'Jr.';
    suffixSelect.dispatchEvent(new Event('change', { bubbles: true }));

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
