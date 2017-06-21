import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester, submitForm } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/burials/config/form.js';

describe('Burials veteran burial information', () => {
  const { schema, uiSchema } = formConfig.chapters.veteranInformation.pages.burialInformation;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select, textarea').length).to.equal(10);
  });

  it('should show errors when required fields are empty', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);
    submitForm(form);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error')).length).to.equal(3);
    expect(onSubmit.called).not.to.be.true;
  });

  it('should show other text field', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_locationOfDeath_location_3'), {
      target: {
        value: 'other'
      }
    });

    expect(formDOM.querySelectorAll('input, select, textarea').length).to.equal(11);
    submitForm(form);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error')).length).to.equal(3);
  });

  it('should submit when all required fields are filled in', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_burialDateMonth'), {
      target: {
        value: '12'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_burialDateDay'), {
      target: {
        value: '12'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_burialDateYear'), {
      target: {
        value: '2001'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_deathDateMonth'), {
      target: {
        value: '12'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_deathDateDay'), {
      target: {
        value: '11'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_deathDateYear'), {
      target: {
        value: '2001'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_locationOfDeath_location_3'), {
      target: {
        value: 'other'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_locationOfDeath_other'), {
      target: {
        value: 'House'
      }
    });

    submitForm(form);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error')).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
