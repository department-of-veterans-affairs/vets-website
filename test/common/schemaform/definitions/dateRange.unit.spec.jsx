import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-addons-test-utils';
import Form from 'react-jsonschema-form';

import { DefinitionTester } from '../../../util/schemaform-utils.jsx';
import { schema, uiSchema } from '../../../../src/js/common/schemaform/definitions/dateRange';

describe('Schemaform definition dateRange', () => {
  it('should render dateRange', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          uiSchema={uiSchema()}/>
    );

    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('label').length).to.equal(8);
    expect(formDOM.querySelectorAll('input').length).to.equal(2);
    expect(formDOM.querySelectorAll('select').length).to.equal(4);
  });
  it('should render invalid dateRange error', () => {
    const dateRangeUISchema = uiSchema();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          uiSchema={dateRangeUISchema}/>
    );

    const formDOM = findDOMNode(form);
    const find = formDOM.querySelector.bind(formDOM);
    ReactTestUtils.Simulate.change(find('#root_fromDay'), {
      target: {
        value: '4'
      }
    });
    ReactTestUtils.Simulate.change(find('#root_fromMonth'), {
      target: {
        value: '4'
      }
    });
    ReactTestUtils.Simulate.change(find('#root_fromYear'), {
      target: {
        value: '2001'
      }
    });
    ReactTestUtils.Simulate.change(find('#root_toDay'), {
      target: {
        value: '4'
      }
    });
    ReactTestUtils.Simulate.change(find('#root_toMonth'), {
      target: {
        value: '4'
      }
    });
    ReactTestUtils.Simulate.change(find('#root_toYear'), {
      target: {
        value: '2000'
      }
    });
    ReactTestUtils.findRenderedComponentWithType(form, Form).onSubmit({
      preventDefault: f => f
    });

    expect(find('.usa-input-error-message').textContent).to.equal(dateRangeUISchema['ui:errorMessages'].dateRange);
  });
  it('should render dateRange title and messages', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          uiSchema={uiSchema('My from date', 'My to date', 'My error')}/>
    );

    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('label')[0].textContent).to.equal('My from date');
    expect(formDOM.querySelectorAll('label')[4].textContent).to.equal('My to date');
  });
});
