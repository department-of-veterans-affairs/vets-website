import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';
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
      />,
    );

    expect(form.find('input').length).to.equal(3);
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
      />,
    );

    fillData(form, 'input#root_application_veteran_serviceName_last', 'Smith');
    fillData(form, 'input#root_application_veteran_serviceName_first', 'Jane');
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
      />,
    );

    fillData(form, 'input#root_application_veteran_serviceName_last', 'Smith');
    fillData(form, 'input#root_application_veteran_serviceName_first', 'Jane');
    fillData(form, 'input#root_application_veteran_serviceName_middle', 'M');
    // Set value directly on the va-select web component and dispatch change event
    const suffixSelect = form
      .getDOMNode()
      .querySelector('#root_application_veteran_serviceName_suffix');
    if (suffixSelect) {
      suffixSelect.value = 'Jr.';
      suffixSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
