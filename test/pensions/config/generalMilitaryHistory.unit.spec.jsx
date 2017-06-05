import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester, submitForm } from '../../util/schemaform-utils.jsx';
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
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input,select').length).to.equal(9);
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

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(3);
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

    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(9);

    ReactTestUtils.Simulate.change(formDOM.querySelector('input[type="radio"]'), {
      target: {
        value: 'Y'
      }
    });

    expect(formDOM.querySelectorAll('input, select').length).to.equal(13);

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(4);
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

    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(9);

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
  it('should required combat after 9/11 question', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input,select').length).to.equal(9);

    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_activeServiceDateRange_toMonth'), {
      target: {
        value: '9'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_activeServiceDateRange_toDay'), {
      target: {
        value: '11'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_activeServiceDateRange_toYear'), {
      target: {
        value: '2001'
      }
    });

    expect(formDOM.querySelectorAll('input,select').length).to.equal(9);

    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_activeServiceDateRange_toMonth'), {
      target: {
        value: '9'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_activeServiceDateRange_toDay'), {
      target: {
        value: '12'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_activeServiceDateRange_toYear'), {
      target: {
        value: '2001'
      }
    });

    expect(formDOM.querySelectorAll('input,select').length).to.equal(11);

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(3);
    expect(onSubmit.called).to.be.false;
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

    const formDOM = findDOMNode(form);

    ReactTestUtils.Simulate.change(Array.from(formDOM.querySelectorAll('input[type="radio"]'))[1], {
      target: {
        value: 'N'
      }
    });

    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_activeServiceDateRange_toMonth'), {
      target: {
        value: '1'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_activeServiceDateRange_toDay'), {
      target: {
        value: '1'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_activeServiceDateRange_toYear'), {
      target: {
        value: '2003'
      }
    });

    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_activeServiceDateRange_fromMonth'), {
      target: {
        value: '1'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_activeServiceDateRange_fromDay'), {
      target: {
        value: '1'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_activeServiceDateRange_fromYear'), {
      target: {
        value: '2002'
      }
    });
    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_combatSince911Yes'), {
      target: {
        value: 'Y'
      }
    });

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
