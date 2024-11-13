import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

const definitions = formConfig.defaultDefinitions;

describe('Edu 10282 applicantDescription', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.personalInformation.pages.veteranDesc;
  it('renders the correct amount of inputs', () => {
    const form = mount(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('va-radio-option').length).to.equal(8);
    form.unmount();
  });

  it('should show errors when required field is empty', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmit}
        data={{}}
        uiSchema={uiSchema}
        definitions={definitions}
      />,
    );
    const formDOM = findDOMNode(form);
    submitForm(form);
    expect(
      Array.from(formDOM.querySelectorAll('.usa-error-message')).length,
    ).to.equal(1);

    expect(onSubmit.called).to.be.false;
  });
});
