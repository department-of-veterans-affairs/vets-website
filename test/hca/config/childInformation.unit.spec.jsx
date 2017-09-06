import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester, submitForm } from '../../util/schemaform-utils';
import { fillDate } from '../../util/unit-helpers';
import formConfig from '../../../src/js/hca/config/form';


describe('Hca child information', () => {
  const { schema, uiSchema } = formConfig.chapters.householdInformation.pages.childInformation;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input').length)
      .to.equal(2);
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

  it('should reveal child information', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(2);

    const reportChildren = Array.from(formDOM.querySelectorAll('input'))
      .find((input) => input.id === 'root_view:reportChildrenYes');
    ReactTestUtils.Simulate.change(reportChildren, {
      target: {
        value: 'Y'
      }
    });
    expect(formDOM.querySelectorAll('input, select').length).to.equal(21);

    submitForm(form);

    // TODO: Figure out why we can submit without filling in any required fields
    //  I'm guessing it's related to the above TODO and with the fact that
    //  updateSchemaAndData() probably isn't called when it should be.
    // expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(7);
    // expect(onSubmit.called).to.be.false;
  });

  it('should add another', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    // Open up the information
    const reportChildren = Array.from(formDOM.querySelectorAll('input'))
      .find((input) => input.id === 'root_view:reportChildrenYes');
    ReactTestUtils.Simulate.change(reportChildren, {
      target: {
        value: 'Y'
      }
    });

    // And fill out the required fields
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_children_0_childFullName_first'), {
      target: {
        value: 'John'
      }
    });

    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_children_0_childFullName_last'), {
      target: {
        value: 'Doe'
      }
    });

    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_children_0_childRelation'), {
      target: {
        value: 'Son'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_children_0_childSocialSecurityNumber'), {
      target: {
        value: '123123123'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_children_0_childCohabitedLastYearYes'), {
      target: {
        value: 'Y'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_children_0_childDisabledBefore18Yes'), {
      target: {
        value: 'Y'
      }
    });

    fillDate(formDOM, 'root_children_0_childDateOfBirth', '2012-12-12');
    fillDate(formDOM, 'root_children_0_childBecameDependent', '2012-12-12');

    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_children_0_childEducationExpenses'), {
      target: {
        value: '1234'
      }
    });

    submitForm(form);
    expect(onSubmit.called).to.be.true;

    ReactTestUtils.Simulate.click(formDOM.querySelector('.va-growable-add-btn'));

    expect(formDOM.querySelector('.va-growable-background').textContent)
      .to.contain('John Doe');
  });
});
