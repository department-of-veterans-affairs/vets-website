import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
} from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../config/form';

describe('Hca spouse information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.householdInformation.pages.spouseInformation;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    expect(
      formDOM.querySelector('#root_spouseFullName_middle').maxLength,
    ).to.equal(30);
    expect(formDOM.querySelectorAll('input, select').length).to.equal(15);
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(6);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with valid data', () => {
    const onSubmit = sinon.spy();
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

    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_spouseFullName_first'),
      {
        target: {
          value: 'Mary',
        },
      },
    );

    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_spouseFullName_last'),
      {
        target: {
          value: 'Smith',
        },
      },
    );

    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_spouseSocialSecurityNumber'),
      {
        target: {
          value: '899663459',
        },
      },
    );

    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_spouseDateOfBirthMonth'),
      {
        target: {
          value: '10',
        },
      },
    );

    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_spouseDateOfBirthDay'),
      {
        target: {
          value: '15',
        },
      },
    );

    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_spouseDateOfBirthYear'),
      {
        target: {
          value: '1991',
        },
      },
    );

    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_dateOfMarriageMonth'),
      {
        target: {
          value: '05',
        },
      },
    );

    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_dateOfMarriageDay'),
      {
        target: {
          value: '29',
        },
      },
    );

    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_dateOfMarriageYear'),
      {
        target: {
          value: '2015',
        },
      },
    );

    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_sameAddressYes'),
      {
        target: {
          value: 'N',
        },
      },
    );

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;

    // TODO: It looks like expand under does not trigger, which it should with Y value.
  });

  it('should expand hidden fields', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    // Expand spouse address and phone number
    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_sameAddressNo'),
      {
        target: {
          value: 'N',
        },
      },
    );

    expect(formDOM.querySelectorAll('input, select').length).to.equal(23);

    // Expand spouse financial support
    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_cohabitedLastYearNo'),
      {
        target: {
          value: 'N',
        },
      },
    );
    expect(formDOM.querySelectorAll('input, select').length).to.equal(25);
  });
});
