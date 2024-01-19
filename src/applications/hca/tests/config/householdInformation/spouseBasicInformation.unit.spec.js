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

describe('hca SpouseBasicInformation config', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.householdInformation.pages.SpouseBasicInformation;
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
    expect(formDOM.querySelectorAll('input, select').length).to.equal(11);
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

    simulateInputChange(formDOM, '#root_spouseFullName_first', 'Mary');
    simulateInputChange(formDOM, '#root_spouseFullName_last', 'Smith');
    simulateInputChange(
      formDOM,
      '#root_spouseSocialSecurityNumber',
      '232422344',
    );
    simulateInputChange(formDOM, '#root_spouseDateOfBirthMonth', '10');
    simulateInputChange(formDOM, '#root_spouseDateOfBirthDay', '15');
    simulateInputChange(formDOM, '#root_spouseDateOfBirthYear', '1991');
    simulateInputChange(formDOM, '#root_dateOfMarriageMonth', '05');
    simulateInputChange(formDOM, '#root_dateOfMarriageDay', '29');
    simulateInputChange(formDOM, '#root_dateOfMarriageYear', '2015');
    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
