import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester, getFormDOM } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/pensions/config/form';

describe('Pensions general military history', () => {
  const { schema, uiSchema } = formConfig.chapters.militaryHistory.pages.general;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input,select').length).to.equal(10);
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

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(4);
    expect(onSubmit.called).to.be.false;
  });

  it('should reveal name fields', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(10);

    ReactTestUtils.Simulate.change(formDOM.querySelector('input[type="radio"]'), {
      target: {
        value: 'Y'
      }
    });

    expect(formDOM.querySelectorAll('input, select').length).to.equal(14);

    formDOM.submitForm();

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(5);
    expect(onSubmit.called).to.be.false;
  });

  it('should add another name', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(10);

    ReactTestUtils.Simulate.change(formDOM.querySelector('input[type="radio"]'), {
      target: {
        value: 'Y'
      }
    });

    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_previousNames_0_first'), {
      target: {
        value: 'Jane'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_previousNames_0_last'), {
      target: {
        value: 'Doe'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_previousNames_0_suffix'), {
      target: {
        value: 'Jr.'
      }
    });
    ReactTestUtils.Simulate.click(formDOM.querySelector('.va-growable-add-btn'));

    expect(formDOM.querySelector('.va-growable-background').textContent)
      .to.contain('Jane Doe, Jr.');
  });
  it('should require combat after 9/11 question', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input,select').length).to.equal(10);

    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_servicePeriods_0_activeServiceDateRange_toMonth'), {
      target: {
        value: '9'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_servicePeriods_0_activeServiceDateRange_toDay'), {
      target: {
        value: '11'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_servicePeriods_0_activeServiceDateRange_toYear'), {
      target: {
        value: '2001'
      }
    });

    expect(formDOM.querySelectorAll('input,select').length).to.equal(10);

    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_servicePeriods_0_activeServiceDateRange_toMonth'), {
      target: {
        value: '9'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_servicePeriods_0_activeServiceDateRange_toDay'), {
      target: {
        value: '12'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_servicePeriods_0_activeServiceDateRange_toYear'), {
      target: {
        value: '2001'
      }
    });

    expect(formDOM.querySelectorAll('input,select').length).to.equal(12);

    formDOM.submitForm();

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(4);
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

    expect(formDOM.querySelectorAll('input, select').length).to.equal(10);

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

    formDOM.fillData('#root_view\\:serveUnderOtherNamesNo', 'N');

    formDOM.fillData('#root_servicePeriods_0_serviceBranch', 'Army');
    formDOM.fillData('#root_servicePeriods_0_activeServiceDateRange_toMonth', '1');
    formDOM.fillData('#root_servicePeriods_0_activeServiceDateRange_toDay', '1');
    formDOM.fillData('#root_servicePeriods_0_activeServiceDateRange_toYear', '2003');
    formDOM.fillData('#root_servicePeriods_0_activeServiceDateRange_fromMonth', '1');
    formDOM.fillData('#root_servicePeriods_0_activeServiceDateRange_fromDay', '1');
    formDOM.fillData('#root_servicePeriods_0_activeServiceDateRange_fromYear', '2002');
    formDOM.fillData('#root_combatSince911Yes', 'Y');

    formDOM.submitForm();

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
