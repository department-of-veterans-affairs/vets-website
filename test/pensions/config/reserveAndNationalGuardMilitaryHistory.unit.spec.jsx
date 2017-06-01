import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester, submitForm } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/pensions/config/form';

describe('Pensions Reserve and National Guard', () => {
  const { schema, uiSchema } = formConfig.chapters.militaryHistory.pages.reserveAndNationalGuard;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input,select').length).to.equal(2);
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should reveal unit fields', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);

    ReactTestUtils.Simulate.change(formDOM.querySelector('input[type="radio"]'), {
      target: {
        value: 'Y'
      }
    });

    expect(formDOM.querySelectorAll('input, select').length).to.equal(11);
  });

  it('should submit with valid data for non-active duty', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);

    ReactTestUtils.Simulate.change(Array.from(formDOM.querySelectorAll('input[type="radio"]'))[1], {
      target: {
        value: 'N'
      }
    });

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should submit with valid data for active duty', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);

    ReactTestUtils.Simulate.change(Array.from(formDOM.querySelectorAll('input[type="radio"]'))[1], {
      target: {
        value: 'Y'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_nationalGuard_dateMonth'), {
      target: {
        value: '9'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_nationalGuard_dateDay'), {
      target: {
        value: '11'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_nationalGuard_dateYear'), {
      target: {
        value: '2001'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_nationalGuard_name'), {
      target: {
        value: 'Unit name'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_nationalGuard_phone'), {
      target: {
        value: '1231231231'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_nationalGuard_addressCountry'), {
      target: {
        value: 'USA'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_nationalGuard_addressState'), {
      target: {
        value: 'NY'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_nationalGuard_addressPostalCode'), {
      target: {
        value: '1231231231'
      }
    });

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
