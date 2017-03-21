import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester, submitForm } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/edu-benefits/pages/schoolSelection.js';

import fullSchema1990e from 'vets-json-schema/dist/transfer-benefits-schema.json';
import fullSchema5490 from 'vets-json-schema/dist/dependents-benefits-schema.json';

describe('Edu 1990e schoolSelection', () => {
  const { schema, uiSchema } = formConfig(fullSchema1990e, {
    fields: [
      'educationProgram',
      'educationObjective',
      'nonVaAssistance',
      'civilianBenefitsAssistance'
    ]
  });

  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);

    const inputs = Array.from(formDOM.querySelectorAll('input, select, textarea'));

    expect(inputs.length).to.equal(7);
  });

  it('should have no required inputs by default', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);
    submitForm(form);

    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.be.empty;
    expect(onSubmit.called).to.be.true;
  });

  it('should require educationType if specified', () => {
    const { schema: schemaIfEducationType, uiSchema: uiSchemaIfEducationType } = formConfig(fullSchema1990e, {
      fields: [
        'educationProgram',
        'educationObjective',
        'nonVaAssistance',
        'civilianBenefitsAssistance'
      ],
      required: ['educationType']
    });

    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schemaIfEducationType}
          onSubmit={onSubmit}
          data={{}}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchemaIfEducationType}/>
    );
    const formDOM = findDOMNode(form);
    const find = formDOM.querySelector.bind(formDOM);

    submitForm(form);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.have.lengthOf(1);
    expect(onSubmit.called).to.be.false;

    ReactTestUtils.Simulate.change(find('#root_educationProgram_educationType'), {
      target: {
        value: 'college'
      }
    });

    submitForm(form);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.be.empty;
    expect(onSubmit.called).to.be.true;
  });
});

describe('Edu 5490 schoolSelection', () => {
  const { schema, uiSchema } = formConfig(fullSchema5490, {
    fields: [
      'educationProgram',
      'educationObjective',
      'educationStartDate',
      'restorativeTraining',
      'vocationalTraining',
      'trainingState',
      'educationalCounseling'
    ],
    required: ['educationType']
  });

  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);

    const inputs = Array.from(formDOM.querySelectorAll('input, select, textarea'));

    expect(inputs.length).to.equal(13);
  });

  it('should have required inputs', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);
    submitForm(form);

    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.not.be.empty;
    expect(onSubmit.called).to.not.be.true;
  });
});
