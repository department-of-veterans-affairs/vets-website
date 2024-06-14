import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
} from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../../config/form';
import { simulateInputChange } from '../../helpers';

describe('CG VeteranContactInfo config', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranChapter.pages.veteranInfoTwo;
  const { defaultDefinitions: definitions } = formConfig;

  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);
    expect(formDOM.querySelectorAll('input, select').length).to.equal(8);
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);
    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(5);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with valid data', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    simulateInputChange(
      formDOM,
      '#root_veteranAddress_street',
      '1350 I St. NW',
    );
    simulateInputChange(formDOM, '#root_veteranAddress_city', 'Washington');
    simulateInputChange(formDOM, '#root_veteranAddress_state', 'DC');
    simulateInputChange(formDOM, '#root_veteranAddress_postalCode', '20005');
    simulateInputChange(
      formDOM,
      '#root_veteranPrimaryPhoneNumber',
      '8008271000',
    );
    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
