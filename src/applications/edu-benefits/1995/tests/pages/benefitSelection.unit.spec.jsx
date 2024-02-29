import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Edu 1995 benefitSelection', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.benefitSelection.pages.benefitSelection;
  it('renders the correct amount of options for the benefit selection radio button', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(8);
    form.unmount();
  });

  it('should have no required inputs', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmit}
        data={{}}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);
    submitForm(form);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.be
      .empty;

    submitForm(form);

    expect(onSubmit.called).to.be.true;
  });
});

describe('Delete Environment Variables Edu 1995 benefitSelection', () => {
  beforeEach(() => {
    global.window.buildType = true;
  });
  afterEach(() => {
    global.window.buildType = false;
  });
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.benefitSelection.pages.benefitSelection;
  it('renders the correct amount of options for the benefit selection radio button', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(8);
    form.unmount();
  });
});
