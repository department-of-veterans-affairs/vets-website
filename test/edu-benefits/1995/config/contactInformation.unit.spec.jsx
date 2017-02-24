import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-addons-test-utils';
import Form from 'react-jsonschema-form';

import { DefinitionTester } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/edu-benefits/1995/config/form';

describe('Edu 1995 contactInformation', () => {
  const { schema, uiSchema } = formConfig.chapters.personalInformation.pages.contactInformation;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );

    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input').concat(
      ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'select')
    );

    expect(inputs.filter(input => input.id.startsWith('root_preferredContactMethod')).length)
      .to.equal(3);
    expect(inputs.filter(input => input.id.startsWith('root_veteranAddress')).length)
      .to.equal(6);
    expect(inputs.filter(input => input.id.startsWith('root_view:otherContactInfo')).length)
      .to.equal(4);
  });
  it('should not render confirm email on review page', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{
            'view:otherContactInfo': {
              'view:confirmEmail': 'test@test.com'
            }
          }}
          reviewMode
          uiSchema={uiSchema}/>
    );

    expect(findDOMNode(form).textContent).not.to.contain('test@test.com');
  });
  it('should conditionally require phone number', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          formData={{}}
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);

    ReactTestUtils.findRenderedComponentWithType(form, Form).onSubmit({
      preventDefault: f => f
    });

    // jsdom has issues with colons in attributes
    let errors = Array.from(formDOM.querySelectorAll('.usa-input-error > label'));
    let phoneError = errors.find(errorLabel => errorLabel.getAttribute('for').endsWith('homePhone'));
    expect(phoneError).to.be.undefined;

    const phoneMethod = ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input')
      .find(input => input.getAttribute('id') === 'root_preferredContactMethod_2');
    ReactTestUtils.Simulate.change(phoneMethod, {
      target: {
        value: 'phone'
      }
    });

    errors = Array.from(formDOM.querySelectorAll('.usa-input-error > label'));
    phoneError = errors.find(errorLabel => errorLabel.getAttribute('for').endsWith('homePhone'));
    expect(phoneError).not.to.be.undefined;
  });
  it('should show error if emails do not match', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          formData={{}}
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);
    const inputs = ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input');
    const emailInput = inputs.find(input => input.id.endsWith('email'));
    const confirmEmailInput = inputs.find(input => input.id.endsWith('confirmEmail'));

    ReactTestUtils.Simulate.change(emailInput, {
      target: {
        value: 'test@test.com'
      }
    });
    ReactTestUtils.Simulate.change(confirmEmailInput, {
      target: {
        value: 'test@test.com'
      }
    });
    ReactTestUtils.Simulate.blur(emailInput);
    ReactTestUtils.Simulate.blur(confirmEmailInput);

    expect(formDOM.querySelectorAll('.usa-input-error')).to.be.empty;

    ReactTestUtils.Simulate.change(confirmEmailInput, {
      target: {
        value: 'test@test.org'
      }
    });

    expect(formDOM.querySelectorAll('.usa-input-error')).not.to.be.empty;
  });
  it('should have no errors with all info filled in', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);
    ReactTestUtils.findRenderedComponentWithType(form, Form).onSubmit({
      preventDefault: f => f
    });
    const find = (id) => {
      return Array.from(formDOM.querySelectorAll('input,select')).find(input => input.id === id);
    };
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error')).length).to.equal(6);

    ReactTestUtils.Simulate.change(find('root_veteranAddress_street'), {
      target: {
        value: 'Test'
      }
    });
    ReactTestUtils.Simulate.change(find('root_veteranAddress_city'), {
      target: {
        value: 'Test'
      }
    });
    ReactTestUtils.Simulate.change(find('root_veteranAddress_state'), {
      target: {
        value: 'MT'
      }
    });
    ReactTestUtils.Simulate.change(find('root_veteranAddress_postalCode'), {
      target: {
        value: '01070'
      }
    });
    ReactTestUtils.Simulate.change(find('root_view:otherContactInfo_email'), {
      target: {
        value: 'test@test.com'
      }
    });
    ReactTestUtils.Simulate.change(find('root_view:otherContactInfo_view:confirmEmail'), {
      target: {
        value: 'test@test.com'
      }
    });

    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.be.empty;
    ReactTestUtils.findRenderedComponentWithType(form, Form).onSubmit({
      preventDefault: f => f
    });

    expect(onSubmit.called).to.be.true;
  });
});
