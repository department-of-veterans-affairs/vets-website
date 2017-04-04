import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester, submitForm } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/edu-benefits/5490/config/form';

describe('Edu 5490 applicantService', () => {
  const { schema, uiSchema } = formConfig.chapters.applicantInformation.pages.applicantService;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const fields = Array.from(findDOMNode(form).querySelectorAll('input, select'));

    expect(fields.length).to.equal(2);
  });

  it('should expand', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    const applicantServedYes = Array.from(formDOM.querySelectorAll('input'))
      .find(input => input.id.startsWith('root_view:applicantServedYes'));

    ReactTestUtils.Simulate.change(applicantServedYes, {
      target: {
        checked: true
      }
    });

    const fields = Array.from(findDOMNode(form).querySelectorAll('input, select'));

    expect(fields.length).to.equal(10);
  });

  it('should not have required fields errors after choosing no', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);
    const applicantServedNo = Array.from(formDOM.querySelectorAll('input'))
      .find(input => input.id.startsWith('root_view:applicantServedNo'));

    ReactTestUtils.Simulate.change(applicantServedNo, {
      target: {
        checked: true
      }
    });
    submitForm(form);

    expect(formDOM.querySelector('.usa-input-error')).to.be.null;
  });

  it('should have required field errors when expanded', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    const applicantServedYes = Array.from(formDOM.querySelectorAll('input'))
      .find(input => input.id.startsWith('root_view:applicantServedYes'));

    ReactTestUtils.Simulate.change(applicantServedYes, {
      target: {
        checked: true
      }
    });

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(2);
  });

  it('should add another', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    const applicantServedYes = Array.from(formDOM.querySelectorAll('input'))
      .find(input => input.id.startsWith('root_view:applicantServedYes'));

    ReactTestUtils.Simulate.change(applicantServedYes, {
      target: {
        checked: true
      }
    });

    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_toursOfDuty_0_serviceBranch'), {
      target: {
        value: 'Army'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_toursOfDuty_0_dateRange_fromMonth'), {
      target: {
        value: '1'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_toursOfDuty_0_dateRange_fromDay'), {
      target: {
        value: '1'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_toursOfDuty_0_dateRange_fromYear'), {
      target: {
        value: '2000'
      }
    });
    ReactTestUtils.Simulate.click(formDOM.querySelector('.va-growable-add-btn'));

    expect(formDOM.querySelector('.va-growable-background').textContent)
      .to.contain('Army');
  });
});
