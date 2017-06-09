import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester, submitForm } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/pensions/config/form';

function fillData(formDOM, id, value) {
  ReactTestUtils.Simulate.change(formDOM.querySelector(id), {
    target: {
      value
    }
  });
}

describe('Pensions marriage history', () => {
  const marriageHistory = formConfig.chapters.householdInformation.pages.marriageHistory;
  const uiSchema = marriageHistory.uiSchema.marriages.items;
  const schema = marriageHistory.schema.properties.marriages.items;

  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input,select').length).to.equal(19);
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

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(8);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with valid data', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);

    fillData(formDOM, '#root_spouseFullName_first', 'test');
    fillData(formDOM, '#root_spouseFullName_last', 'test');
    fillData(formDOM, '#root_dateOfMarriageMonth', '3');
    fillData(formDOM, '#root_dateOfMarriageDay', '3');
    fillData(formDOM, '#root_dateOfMarriageYear', '2001');
    fillData(formDOM, '#root_locationOfMarriage', 'The Pacific');
    fillData(formDOM, '#root_marriageType_4', 'Other');
    fillData(formDOM, '#root_otherMarriageType', 'Something');
    fillData(formDOM, '#root_view\\:pastMarriage_reasonForSeparation_1', 'Divorced');
    fillData(formDOM, '#root_view\\:pastMarriage_dateOfSeparationMonth', '3');
    fillData(formDOM, '#root_view\\:pastMarriage_dateOfSeparationDay', '3');
    fillData(formDOM, '#root_view\\:pastMarriage_dateOfSeparationYear', '2001');
    fillData(formDOM, '#root_view\\:pastMarriage_locationOfSeparation', 'The Atlantic');

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
