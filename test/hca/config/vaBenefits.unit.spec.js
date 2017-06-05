import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester, submitForm } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/hca/config/form';

describe('Hca vaBenefits', () => {
  const { schema, uiSchema } = formConfig.chapters.vaBenefits.pages.vaBenefits;
  const definitions = formConfig.defaultDefinitions;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={definitions}/>
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input').length).to.equal(6);
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={definitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(3);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with valid data', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={definitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_compensableVaServiceConnectedYes'), {
      target: {
        value: 'Y'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_isVaServiceConnectedYes'), {
      target: {
        value: 'Y'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_receivesVaPensionYes'), {
      target: {
        value: 'Y'
      }
    });

    submitForm(form);
    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
