import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester, submitForm } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/hca/config/form';

describe('Hca serviceInformation', () => {
  const { schema, uiSchema } = formConfig.chapters.militaryService.pages.serviceInformation;
  const definitions = formConfig.defaultDefinitions;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        uiSchema={uiSchema}
        definitions={definitions}/>
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input').length).to.equal(2);
    expect(formDOM.querySelectorAll('select').length).to.equal(6);
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

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(4);
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

    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_lastServiceBranch'), {
      target: {
        value: 'army'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_lastEntryDateMonth'), {
      target: {
        value: 1
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_lastEntryDateDay'), {
      target: {
        value: 1
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_lastEntryDateYear'), {
      target: {
        value: '2010'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_lastDischargeDateMonth'), {
      target: {
        value: 1
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_lastDischargeDateDay'), {
      target: {
        value: 1
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_lastDischargeDateYear'), {
      target: {
        value: '2011'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_dischargeType'), {
      target: {
        value: 'honorable'
      }
    });

    submitForm(form);
    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
