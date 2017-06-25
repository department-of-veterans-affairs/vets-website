import React from 'react';
import moment from 'moment';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester, submitForm } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/pensions/config/form';

describe('Pensions employment history', () => {
  const { depends, schema, uiSchema } = formConfig.chapters.workHistory.pages.employmentHistory;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input,select').length).to.equal(16);
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

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(10);
    expect(onSubmit.called).to.be.false;
  });

  it('should add another job', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);

    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_jobs_0_employer'), {
      target: {
        value: 'Smith'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_jobs_0_address_street'), {
      target: {
        value: '101 Elm st'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_jobs_0_address_city'), {
      target: {
        value: 'Northampton'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_jobs_0_address_state'), {
      target: {
        value: 'MA'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_jobs_0_address_postalCode'), {
      target: {
        value: '01060'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_jobs_0_jobTitle'), {
      target: {
        value: 'Professor'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_jobs_0_dateRange_fromMonth'), {
      target: {
        value: '1'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_jobs_0_dateRange_fromDay'), {
      target: {
        value: '1'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_jobs_0_dateRange_fromYear'), {
      target: {
        value: '2002'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_jobs_0_dateRange_toMonth'), {
      target: {
        value: '1'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_jobs_0_dateRange_toDay'), {
      target: {
        value: '1'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_jobs_0_dateRange_toYear'), {
      target: {
        value: '2003'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_jobs_0_daysMissed'), {
      target: {
        value: '3'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_jobs_0_annualEarnings'), {
      target: {
        value: '300'
      }
    });

    submitForm(form);

    expect(onSubmit.called).to.be.true;

    ReactTestUtils.Simulate.click(formDOM.querySelector('.va-growable-add-btn'));

    expect(formDOM.querySelector('.va-growable-background').textContent)
      .to.contain('Smith');
  });
  it('depends should return true if under 65', () => {
    const result = depends(
      {
        veteranDateOfBirth: moment().startOf('day').subtract(64, 'years').format('YYYY-MM-DD')
      }
    );

    expect(result).to.be.true;
  });
  it('depends should return false if 65', () => {
    const result = depends(
      {
        veteranDateOfBirth: moment().startOf('day').subtract(65, 'years').format('YYYY-MM-DD')
      }
    );

    expect(result).to.be.false;
  });
});
