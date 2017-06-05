import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester, submitForm } from '../../util/schemaform-utils';
import formConfig from '../../../src/js/hca/config/form';

describe('Hca annual income', () => {
  const { schema, uiSchema } = formConfig.chapters.householdInformation.pages.annualIncome;
  const marriedWithChildren = {
    maritalStatus: 'Married',
    children: [
      {
        childFullName: {
          first: 'John',
          last: 'Doe'
        },
        childRelation: 'Son'
      },
      {
        childFullName: {
          first: 'Jane',
          last: 'Doe'
        },
        childRelation: 'Daughter'
      }
    ],
  };

  it('should render without spouse information', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}/>
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length)
      .to.equal(3);
  });

  it('should render with spouse information', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{ maritalStatus: 'Married' }}/>
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length)
    .to.equal(6);
  });

  it('should render with children information', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={marriedWithChildren}/>
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length)
    .to.equal(12); // Change me!
  });

  it('should not submit an empty form', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
          data={marriedWithChildren}/>
    );
    const formDOM = findDOMNode(form);

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(12);
    expect(onSubmit.called).to.be.false;
  });
});
