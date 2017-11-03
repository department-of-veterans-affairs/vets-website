import React from 'react';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import moment from 'moment';

import { DefinitionTester, getFormDOM, submitForm } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/edu-benefits/1990/config/form.js';

const definitions = formConfig.defaultDefinitions;
describe('Edu 1990 applicantInformation', () => {
  const { schema, uiSchema } = formConfig.chapters.applicantInformation.pages.applicantInformation;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(11);
  });

  it('should conditionally require SSN or file number', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        formData={{}}
        schema={schema}
        definitions={definitions}
        data={{}}
        uiSchema={uiSchema}/>
    );
    submitForm(form);

    // Use Array find() for nodes with 'view:' in the id, and check for ok (truthiness) instead of null since
    // not found nodes will return undefined instead of null

    // VA file number input is not visible; error is shown for empty SSN input
    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input');
    expect(inputs.find(input => input.id === 'root_veteranSocialSecurityNumber')).to.be.ok;
    expect(inputs.find(input => input.id === 'root_vaFileNumber')).not.to.be.ok;

    const errors = ReactTestUtils.scryRenderedDOMComponentsWithClass(form, 'usa-input-error-message');
    expect(errors.find(input => input.id.includes('root_veteranSocialSecurityNumber'))).to.be.ok;

    // Check no-SSN box
    const noSSNBox = ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input')
      .find(input => input.id === 'root_view:noSSN');
    ReactTestUtils.Simulate.change(noSSNBox,
      {
        target: {
          checked: true
        }
      });

    // No error is shown for empty SSN input; error is shown for empty file number input
    const newErrors = ReactTestUtils.scryRenderedDOMComponentsWithClass(form, 'usa-input-error-message');
    expect(newErrors.find(input => input.id.includes('root_veteranSocialSecurityNumber'))).not.to.be.ok;
    expect(newErrors.find(input => input.id.includes('root_vaFileNumber'))).to.be.ok;
  });
  it('should not submit form without information', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);
    formDOM.submitForm();

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(4);
  });

  it('should only allow ages >= 17 years', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);

    // 17th birthday is tomorrow
    const dob = moment().subtract(17, 'years').add(1, 'day');
    formDOM.fillDate('root_veteranDateOfBirth', dob.format('YYYY-MM-DD'));
    formDOM.submitForm();
    expect(formDOM.querySelectorAll('.usa-input-error #root_veteranDateOfBirthMonth').length).to.equal(1);

    // 17th birthday is today
    // Happy birthday!
    formDOM.fillDate('root_veteranDateOfBirth', dob.subtract(1, 'day').format('YYYY-MM-DD'));
    formDOM.submitForm();
    expect(formDOM.querySelectorAll('.usa-input-error #root_veteranDateOfBirthMonth').length).to.equal(0);
  });
});
