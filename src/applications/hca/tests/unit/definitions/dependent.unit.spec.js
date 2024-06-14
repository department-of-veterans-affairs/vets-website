import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
} from '@department-of-veterans-affairs/platform-testing/schemaform-utils';

import formConfig from '../../../config/form';
import { simulateInputChange } from '../../helpers';
import {
  dependentSchema,
  dependentUISchema,
} from '../../../definitions/dependent';

describe('hca Dependent config', () => {
  const { defaultDefinitions: definitions } = formConfig;

  describe('BasicInformation config', () => {
    const { basic: schema } = dependentSchema;
    const { basic: uiSchema } = dependentUISchema;

    it('should render', () => {
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          uiSchema={uiSchema}
        />,
      );
      const formDOM = findDOMNode(form);
      expect(formDOM.querySelectorAll('input, select').length).to.equal(12);
    });

    it('should not submit empty form', () => {
      const onSubmit = sinon.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />,
      );
      const formDOM = findDOMNode(form);
      submitForm(form);

      expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(6);
      expect(onSubmit.called).to.be.false;
    });

    it('should submit with valid data', () => {
      const onSubmit = sinon.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />,
      );
      const formDOM = findDOMNode(form);

      simulateInputChange(formDOM, '#root_fullName_first', 'Jane');
      simulateInputChange(formDOM, '#root_fullName_last', 'Smith');
      simulateInputChange(formDOM, '#root_dependentRelation', 'Daughter');
      simulateInputChange(formDOM, '#root_socialSecurityNumber', '234243444');
      simulateInputChange(formDOM, '#root_dateOfBirthMonth', '1');
      simulateInputChange(formDOM, '#root_dateOfBirthDay', '1');
      simulateInputChange(formDOM, '#root_dateOfBirthYear', '2000');
      simulateInputChange(formDOM, '#root_becameDependentMonth', '1');
      simulateInputChange(formDOM, '#root_becameDependentDay', '1');
      simulateInputChange(formDOM, '#root_becameDependentYear', '2000');
      submitForm(form);

      expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
  });

  describe('EducationalExpenses config', () => {
    const { education: schema } = dependentSchema;
    const { education: uiSchema } = dependentUISchema;

    it('should render', () => {
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          uiSchema={uiSchema}
        />,
      );
      const formDOM = findDOMNode(form);
      expect(formDOM.querySelectorAll('input, select').length).to.equal(3);
    });

    it('should not submit empty form', () => {
      const onSubmit = sinon.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />,
      );
      const formDOM = findDOMNode(form);
      submitForm(form);

      expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });

    it('should submit with valid data', () => {
      const onSubmit = sinon.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />,
      );
      const formDOM = findDOMNode(form);

      simulateInputChange(formDOM, '#root_attendedSchoolLastYearYes', 'Y');
      simulateInputChange(formDOM, '#root_dependentEducationExpenses', '1000');
      submitForm(form);

      expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
  });

  describe('AdditionalInformation config', () => {
    const { additional: schema } = dependentSchema;
    const { additional: uiSchema } = dependentUISchema;

    it('should render', () => {
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          uiSchema={uiSchema}
        />,
      );
      const formDOM = findDOMNode(form);
      expect(formDOM.querySelectorAll('input, select').length).to.equal(6);
    });

    it('should not submit empty form', () => {
      const onSubmit = sinon.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />,
      );
      const formDOM = findDOMNode(form);
      submitForm(form);

      expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(3);
      expect(onSubmit.called).to.be.false;
    });

    it('should submit with valid data', () => {
      const onSubmit = sinon.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />,
      );
      const formDOM = findDOMNode(form);

      simulateInputChange(formDOM, '#root_disabledBefore18No', 'N');
      simulateInputChange(formDOM, '#root_cohabitedLastYearNo', 'N');
      simulateInputChange(formDOM, '#root_view\\3A dependentIncomeYes', 'Y');
      submitForm(form);

      expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
  });

  describe('FinancialSupport config', () => {
    const { support: schema } = dependentSchema;
    const { support: uiSchema } = dependentUISchema;

    it('should render', () => {
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          uiSchema={uiSchema}
        />,
      );
      const formDOM = findDOMNode(form);
      expect(formDOM.querySelectorAll('input, select').length).to.equal(2);
    });

    it('should submit empty form', () => {
      const onSubmit = sinon.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />,
      );
      const formDOM = findDOMNode(form);
      submitForm(form);

      expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });

    it('should submit with valid data', () => {
      const onSubmit = sinon.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />,
      );
      const formDOM = findDOMNode(form);

      simulateInputChange(formDOM, '#root_receivedSupportLastYearNo', 'N');
      submitForm(form);

      expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
  });

  describe('AnnualIncome config', () => {
    const { income: schema } = dependentSchema;
    const { income: uiSchema } = dependentUISchema;

    it('should render', () => {
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          uiSchema={uiSchema}
        />,
      );
      const formDOM = findDOMNode(form);
      expect(formDOM.querySelectorAll('input, select').length).to.equal(3);
    });

    it('should submit empty form', () => {
      const onSubmit = sinon.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />,
      );
      const formDOM = findDOMNode(form);
      submitForm(form);

      expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(3);
      expect(onSubmit.called).to.be.false;
    });

    it('should submit with valid data', () => {
      const onSubmit = sinon.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />,
      );
      const formDOM = findDOMNode(form);

      simulateInputChange(
        formDOM,
        '#root_view\\3A grossIncome_grossIncome',
        '22500',
      );
      simulateInputChange(
        formDOM,
        '#root_view\\3A netIncome_netIncome',
        '17100',
      );
      simulateInputChange(
        formDOM,
        '#root_view\\3A otherIncome_otherIncome',
        '0',
      );
      submitForm(form);

      expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
  });
});
