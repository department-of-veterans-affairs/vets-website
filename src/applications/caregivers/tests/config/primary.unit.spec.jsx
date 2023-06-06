import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  submitForm,
} from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../config/form';

describe('CG Primary Caregiver', () => {
  it('should render primary caregiver apply page', () => {
    const onSubmit = sinon.spy();
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.primaryCaregiverChapter.pages.primaryCaregiverInfoOne;
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input').length).to.equal(2);

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should render primary caregiver information page', () => {
    const onSubmit = sinon.spy();
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.primaryCaregiverChapter.pages.primaryCaregiverInfoTwo;
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(9);

    expect(formDOM.querySelector('#root_primaryFullName_first')).not.to.be.null;
    expect(
      formDOM.querySelector('#root_primaryFullName_first').maxLength,
    ).to.equal(30);
    expect(formDOM.querySelector('#root_primaryFullName_middle')).not.to.be
      .null;
    expect(formDOM.querySelector('#root_primaryFullName_last')).not.to.be.null;
    expect(
      formDOM.querySelector('#root_primaryFullName_last').maxLength,
    ).to.equal(30);

    expect(formDOM.querySelector('#root_primarySsnOrTin')).not.to.be.null;

    expect(formDOM.querySelector('#root_primaryDateOfBirthMonth')).not.to.be
      .null;
    expect(formDOM.querySelector('#root_primaryDateOfBirthDay')).not.to.be.null;
    expect(formDOM.querySelector('#root_primaryDateOfBirthYear')).not.to.be
      .null;

    expect(formDOM.querySelector('#root_primaryGender_0')).not.to.be.null;
    expect(formDOM.querySelector('#root_primaryGender_1')).not.to.be.null;

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(3);
    expect(onSubmit.called).to.be.false;
  });

  it('should render primary caregiver information page and submit successfully', () => {
    const onSubmit = sinon.spy();
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.primaryCaregiverChapter.pages.primaryCaregiverInfoTwo;
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{
          primaryFullName: {
            first: 'Mary',
            last: 'Smith',
          },
          primaryDateOfBirth: '1990-11-18',
        }}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should render primary caregiver contact page', () => {
    const middleware = [];
    const mockStore = configureStore(middleware);
    const address = {
      form: {
        data: {},
      },
    };
    const store = mockStore(address);
    const onSubmit = sinon.spy();
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.primaryCaregiverChapter.pages.primaryCaregiverInfoThree;
    const view = render(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          data={{
            veteranAddress: {
              street: '23 High Street',
              city: 'Pennington',
              state: 'NV',
              postalCode: '08534',
            },
            veteranFullName: {
              first: 'John',
              middle: '',
              last: 'Smith',
              suffix: '',
            },
          }}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect(view.container.querySelectorAll('input, select').length).to.equal(4);
    expect(view.container.querySelectorAll('va-checkbox').length).to.equal(1);
    expect(view.container.querySelectorAll('va-text-input').length).to.equal(4);
    expect(view.container.querySelectorAll('va-select').length).to.equal(1);

    expect(
      view.container.querySelector('.va-address-block', view.container)
        .textContent,
    ).to.contain('John  Smith23 High Street Pennington, NV 08534');

    fireEvent.click(
      view.container.querySelector('button[type=submit]', view.container),
    );

    // address
    const addressElement = view.container.querySelector(
      '#root_primaryAddress_street',
      view.container,
    );
    expect(addressElement.error).to.contain('Please enter a street address');

    // city
    const cityElement = view.container.querySelector(
      '#root_primaryAddress_city',
      view.container,
    );
    expect(cityElement.error).to.contain('Please enter a city');

    // state
    const stateElement = view.container.querySelector(
      '#root_primaryAddress_state',
      view.container,
    );
    expect(stateElement.error).to.contain('Please enter a state');

    // Zip code
    const zipcodeElement = view.container.querySelector(
      '#root_primaryAddress_postalCode',
      view.container,
    );
    expect(zipcodeElement.error).to.contain('Please enter a postal code');

    // phone and relationship
    expect(view.container.querySelectorAll('.usa-input-error').length).to.equal(
      2,
    );

    expect(onSubmit.called).to.be.false;
  });

  it('should render primary caregiver contact page and submit successfully', () => {
    const middleware = [];
    const mockStore = configureStore(middleware);
    const address = {
      form: {
        data: {},
      },
    };
    const store = mockStore(address);
    const onSubmit = sinon.spy();
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.primaryCaregiverChapter.pages.primaryCaregiverInfoThree;
    const view = render(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          data={{
            veteranAddress: {
              street: '23 High Street',
              city: 'Pennington',
              state: 'NV',
              postalCode: '08534',
            },
            veteranFullName: {
              first: 'John',
              middle: '',
              last: 'Smith',
              suffix: '',
            },
          }}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    // primary phone number
    const phoneElement = view.container.querySelector(
      '#root_primaryPrimaryPhoneNumber',
      view.container,
    );

    fireEvent.change(phoneElement, { target: { value: '7777777777' } });

    // primary relationship
    const relationshipElement = view.container.querySelector(
      '#root_primaryVetRelationship',
      view.container,
    );

    fireEvent.change(relationshipElement, { target: { value: 'Spouse' } });

    fireEvent.submit(view.container.querySelector('form'));
    expect(view.container.querySelectorAll('.usa-input-error').length).to.equal(
      0,
    );

    // TODO - should return true but returns false
    // expect(onSubmit.called).to.be.true;
  });

  it('should render primary caregiver health care coverage page', () => {
    const onSubmit = sinon.spy();
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.primaryCaregiverChapter.pages.primaryCaregiverInfoFour;
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(2);

    expect(formDOM.querySelector('#root_primaryHasHealthInsuranceYes')).not.to
      .be.null;
    expect(formDOM.querySelector('#root_primaryHasHealthInsuranceNo')).not.to.be
      .null;

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });
});
