import _ from 'lodash/fp';

import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester, submitForm } from '../../util/schemaform-utils.jsx';
import applicantInformation from '../../../src/js/edu-benefits/pages/applicantInformation.js';

import fullSchema1990e from 'vets-json-schema/dist/22-1990E-schema.json';
import fullSchema5490 from 'vets-json-schema/dist/22-5490-schema.json';

function fillInformation(find) {
  ReactTestUtils.Simulate.change(find('#root_relativeFullName_first'), {
    target: {
      value: 'Test'
    }
  });
  ReactTestUtils.Simulate.change(find('#root_relativeFullName_last'), {
    target: {
      value: 'Test'
    }
  });
  ReactTestUtils.Simulate.change(find('#root_relativeSocialSecurityNumber'), {
    target: {
      value: '987654321'
    }
  });
  ReactTestUtils.Simulate.change(find('#root_relativeDateOfBirthMonth'), {
    target: {
      value: '1'
    }
  });
  ReactTestUtils.Simulate.change(find('#root_relativeDateOfBirthDay'), {
    target: {
      value: '1'
    }
  });
  ReactTestUtils.Simulate.change(find('#root_relativeDateOfBirthYear'), {
    target: {
      value: '1980'
    }
  });
  ReactTestUtils.Simulate.change(find('#root_relationship_0'), {
    target: {
      checked: true
    }
  });
}

describe('Basic applicantInformation', () => {
  const applicantSchema = {
    definitions: _.pick(['fullName', 'ssn', 'date', 'gender', 'relationship'],
                        fullSchema1990e.definitions)
  };
  const { schema, uiSchema } = applicantInformation(applicantSchema);
  it('should conditionally require SSN', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);
    const find = formDOM.querySelector.bind(formDOM);

    // Error appears when no SSN is provided
    fillInformation(find);
    ReactTestUtils.Simulate.change(find('#root_relativeSocialSecurityNumber'), {
      target: {
        value: null
      }
    });
    submitForm(form);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).not.to.be.empty;

    // Error disappears when no-SSN is checked
    const noSSNBox = ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input')
                                   .find(input => input.id === 'root_view:noSSN');
    ReactTestUtils.Simulate.change(noSSNBox,
      {
        target: {
          checked: true
        }
      });
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.be.empty;
  });
});

describe('Edu 1990e applicantInformation', () => {
  const { schema, uiSchema } = applicantInformation(fullSchema1990e);
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(13);
  });
  it('should show errors when required fields are empty', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);
    submitForm(form);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).not.to.be.empty;
    expect(onSubmit.called).not.to.be.true;
  });
  it('should show no errors when all required fields are filled', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);
    const find = formDOM.querySelector.bind(formDOM);

    fillInformation(find);

    submitForm(form);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.be.empty;
    expect(onSubmit.called).to.be.true;
  });
});

describe('Edu 5490 applicantInformation', () => {
  // Make sure these match the fields listed in the 5490
  const { schema, uiSchema } = applicantInformation(fullSchema5490, [
    'relativeFullName',
    'relativeSocialSecurityNumber',
    'relativeDateOfBirth',
    'gender'
  ]);
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(13);
  });
  it('should show errors when required fields are empty', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);
    submitForm(form);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).not.to.be.empty;
    expect(onSubmit.called).not.to.be.true;
  });
  it('should show no errors when all required fields are filled', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);
    const find = formDOM.querySelector.bind(formDOM);

    fillInformation(find);

    submitForm(form);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.be.empty;
    expect(onSubmit.called).to.be.true;
  });
});
