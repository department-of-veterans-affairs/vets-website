import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester, submitForm } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/edu-benefits/1990e/config/form';

describe('Edu 1990e educationHistory', () => {
  const { schema, uiSchema } = formConfig.chapters.educationHistory.pages.educationHistory;
  const definitions = formConfig.defaultDefinitions;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}
          definitions={definitions}/>
    );
    const fields = ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input');
    expect(fields.length).to.equal(8);
  });
  it('should have no required inputs', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          uiSchema={uiSchema}
          definitions={definitions}/>
    );
    const formDOM = findDOMNode(form);
    submitForm(form);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.be.empty;
    expect(onSubmit.called).to.be.true;
  });
  it('should add another training', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          uiSchema={uiSchema}
          definitions={definitions}/>
    );
    const formDOM = findDOMNode(form);
    const find = formDOM.querySelector.bind(formDOM);
    ReactTestUtils.Simulate.change(find('#root_postHighSchoolTrainings_0_name'), {
      target: {
        value: 'College name'
      }
    });
    ReactTestUtils.Simulate.click(formDOM.querySelector('.va-growable-add-btn'));
    const firstTraining = Array.from(formDOM.querySelectorAll('.va-growable-background'))[0];
    expect(firstTraining.textContent).to.contain('College name');
    expect(firstTraining.querySelector('button').textContent).to.equal('Edit');
  });
});
