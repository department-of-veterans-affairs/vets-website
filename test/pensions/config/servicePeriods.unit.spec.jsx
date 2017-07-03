import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester, getFormDOM } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/pensions/config/form';

describe('Pensions service periods', () => {
  const { schema, uiSchema } = formConfig.chapters.militaryHistory.pages.servicePeriods;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input,select').length).to.equal(7);
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

    const formDOM = getFormDOM(form);

    formDOM.submitForm();

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(3);
    expect(onSubmit.called).to.be.false;
  });

  it('should add another service period', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(7);

    formDOM.fillData('#root_servicePeriods_0_serviceBranch', 'Army');
    formDOM.fillData('#root_servicePeriods_0_activeServiceDateRange_toMonth', '1');
    formDOM.fillData('#root_servicePeriods_0_activeServiceDateRange_toDay', '1');
    formDOM.fillData('#root_servicePeriods_0_activeServiceDateRange_toYear', '2003');
    formDOM.fillData('#root_servicePeriods_0_activeServiceDateRange_fromMonth', '1');
    formDOM.fillData('#root_servicePeriods_0_activeServiceDateRange_fromDay', '1');
    formDOM.fillData('#root_servicePeriods_0_activeServiceDateRange_fromYear', '2002');

    ReactTestUtils.Simulate.click(formDOM.querySelector('.va-growable-add-btn'));

    expect(formDOM.querySelector('.va-growable-background').textContent)
      .to.contain('Army');
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

    const formDOM = getFormDOM(form);

    formDOM.fillData('#root_servicePeriods_0_serviceBranch', 'Army');
    formDOM.fillData('#root_servicePeriods_0_activeServiceDateRange_toMonth', '1');
    formDOM.fillData('#root_servicePeriods_0_activeServiceDateRange_toDay', '1');
    formDOM.fillData('#root_servicePeriods_0_activeServiceDateRange_toYear', '2003');
    formDOM.fillData('#root_servicePeriods_0_activeServiceDateRange_fromMonth', '1');
    formDOM.fillData('#root_servicePeriods_0_activeServiceDateRange_fromDay', '1');
    formDOM.fillData('#root_servicePeriods_0_activeServiceDateRange_fromYear', '2002');

    formDOM.submitForm();

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
