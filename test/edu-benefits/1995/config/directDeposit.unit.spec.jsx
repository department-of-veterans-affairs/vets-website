import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/edu-benefits/1995/config/form';

describe('Edu 1995 directDeposit', () => {
  const { schema, uiSchema } = formConfig.chapters.personalInformation.pages.directDeposit;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input').length).to.equal(3);
  });
  it('should render stop message', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_bankAccountChange_2'), {
      target: {
        value: 'stop'
      }
    });

    expect(formDOM.textContent).to.contain('The Department of Treasury requires');
  });
  it('should render bank account fields', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_bankAccountChange_1'), {
      target: {
        value: 'startUpdate'
      }
    });

    expect(formDOM.querySelectorAll('input').length).to.equal(7);
  });
  it('should show error on bad routing number', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_bankAccountChange_1'), {
      target: {
        value: 'startUpdate'
      }
    });
    const routingNumber = formDOM.querySelector('#root_bankAccount_routingNumber');
    ReactTestUtils.Simulate.blur(routingNumber);

    expect(formDOM.querySelector('.usa-input-error #root_bankAccount_routingNumber')).to.be.null;

    ReactTestUtils.Simulate.change(routingNumber, {
      target: {
        value: '01234567'
      }
    });

    expect(formDOM.querySelector('.usa-input-error #root_bankAccount_routingNumber')).not.to.be.null;
  });
});
