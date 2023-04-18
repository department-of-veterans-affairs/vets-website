import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import sinon from 'sinon';

import {
  DefinitionTester,
  submitForm,
} from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../../config/form';
import { simulateInputChange } from '../../helpers';

describe('Hca marital status', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.householdInformation.pages.v1MaritalStatus;
  const onSubmit = sinon.spy();

  it('should render maritalStatus page', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(1);
    expect(formDOM.querySelector('#root_maritalStatus')).not.to.be.null;

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit marital status page with no data', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    simulateInputChange(formDOM, '#root_maritalStatus', 'Married');
    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
