import _ from 'lodash/fp';

import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester, submitForm } from '../../util/schemaform-utils.jsx';
import formConfig, { schoolSelectionOptionsFor as optionsFor } from '../../../src/js/edu-benefits/pages/schoolSelection.js';

import fullSchema1990e from 'vets-json-schema/dist/22-1990E-schema.json';
import fullSchema1990n from 'vets-json-schema/dist/22-1990N-schema.json';
import fullSchema5490 from 'vets-json-schema/dist/22-5490-schema.json';

const schemas = {
  '1990n': fullSchema1990n,
  '1990e': fullSchema1990e,
  '5490': fullSchema5490 // eslint-disable-line
};

// Describe the tests for each form
Object.keys(optionsFor).forEach((formName) => {
  describe(`Edu ${formName} schoolSelection`, () => {
    const { schema, uiSchema } = formConfig(schemas[formName], optionsFor[formName]);

    // They should all render
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

      // Should have a better test than this...
      // Perhaps adding up all the elements based on optionsFor[formName].fields
      expect(inputs.length).to.not.equal(0);
    });


    // Either test for required inputs or not, depending on the required option
    const requiredInputs = !_.isEmpty(optionsFor[formName].required);

    it(`should have${requiredInputs ? '' : ' no'} required inputs`, () => {
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

      if (requiredInputs) {
        expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.not.be.empty;
        expect(onSubmit.called).to.not.be.true;
      } else {
        expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.be.empty;
        expect(onSubmit.called).to.be.true;
      }
    });

    // TODO: Test filling in the required data
  });
});
