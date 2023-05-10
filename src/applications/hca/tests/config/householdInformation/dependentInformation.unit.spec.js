import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
} from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { fillDate } from '@department-of-veterans-affairs/platform-testing/helpers';
import formConfig from '../../../config/form';
import { simulateInputChange } from '../../helpers';

describe('hca DependentInformation config', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.householdInformation.pages.v1DependentInformation;
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
    expect(formDOM.querySelectorAll('input').length).to.equal(2);
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

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should reveal dependent information', () => {
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
    expect(formDOM.querySelectorAll('input, select').length).to.equal(2);

    const reportDependents = Array.from(formDOM.querySelectorAll('input')).find(
      input => input.id === 'root_view:reportDependentsYes',
    );
    ReactTestUtils.Simulate.change(reportDependents, {
      target: {
        value: 'Y',
      },
    });
    expect(formDOM.querySelectorAll('input, select').length).to.equal(21);

    submitForm(form);

    // TODO: Figure out why we can submit without filling in any required fields
    //  I'm guessing it's related to the above TODO and with the fact that
    //  updateSchemaAndData() probably isn't called when it should be.
    // expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(7);
    // expect(onSubmit.called).to.be.false;

    // TODO: It looks like expand under does not trigger, which it should with Y value.
  });

  it('should add another', () => {
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

    // Open up the information
    const reportDependents = Array.from(formDOM.querySelectorAll('input')).find(
      input => input.id === 'root_view:reportDependentsYes',
    );
    ReactTestUtils.Simulate.change(reportDependents, {
      target: {
        value: 'Y',
      },
    });

    // And fill out the required fields

    simulateInputChange(formDOM, '#root_dependents_0_fullName_first', 'John');
    simulateInputChange(formDOM, '#root_dependents_0_fullName_last', 'Doe');
    simulateInputChange(formDOM, '#root_dependents_0_dependentRelation', 'Son');
    simulateInputChange(
      formDOM,
      '#root_dependents_0_socialSecurityNumber',
      '123123123',
    );
    simulateInputChange(
      formDOM,
      '#root_dependents_0_cohabitedLastYearYes',
      'Y',
    );
    simulateInputChange(formDOM, '#root_dependents_0_disabledBefore18Yes', 'Y');

    fillDate(formDOM, 'root_dependents_0_dateOfBirth', '2012-12-12');
    fillDate(formDOM, 'root_dependents_0_becameDependent', '2012-12-12');

    simulateInputChange(
      formDOM,
      '#root_dependents_0_dependentEducationExpenses',
      '1234',
    );

    submitForm(form);
    expect(onSubmit.called).to.be.true;

    ReactTestUtils.Simulate.click(
      formDOM.querySelector('.va-growable-add-btn'),
    );

    expect(
      formDOM.querySelector('.va-growable-background').textContent,
    ).to.contain('John Doe');
  });
});
