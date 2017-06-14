import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester, submitForm } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/burials/config/form.js';

describe('Burials claimant information', () => {
  const { schema, uiSchema } = formConfig.chapters.claimantContactInformation.pages.claimantContactInformation;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select, textarea').length).to.equal(8);
  });
  it('should show errors when required fields are empty', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);
    submitForm(form);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error')).length).to.equal(6);
    expect(onSubmit.called).not.to.be.true;
  });
  it('should submit when all required fields are filled in', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_claimantAddress_street'), {
      target: {
        value: '101 Elm st'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_claimantAddress_city'), {
      target: {
        value: 'Northampton'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_claimantAddress_state'), {
      target: {
        value: 'MA'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_claimantAddress_postalCode'), {
      target: {
        value: '01060'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_claimantEmail'), {
      target: {
        value: 'Jane.Smith@gmail.com'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_claimantPhone'), {
      target: {
        value: '4444444444'
      }
    });

    submitForm(form);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error')).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
