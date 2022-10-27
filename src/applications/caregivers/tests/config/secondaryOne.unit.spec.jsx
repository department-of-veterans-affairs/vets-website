import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import {
  DefinitionTester,
  submitForm,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('CG Secondary Caregiver One', () => {
  it('should render secondary caregiver apply page', () => {
    const onSubmit = sinon.spy();
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.secondaryCaregiversChapter.pages.secondaryCaregiverOneIntro;
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

  it('should render secondary caregiver one information page', () => {
    const onSubmit = sinon.spy();
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.secondaryCaregiversChapter.pages.secondaryCaregiverOne;
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

    expect(formDOM.querySelector('#root_secondaryOneFullName_first')).not.to.be
      .null;
    expect(
      formDOM.querySelector('#root_secondaryOneFullName_first').maxLength,
    ).to.equal(30);
    expect(formDOM.querySelector('#root_secondaryOneFullName_middle')).not.to.be
      .null;
    expect(formDOM.querySelector('#root_secondaryOneFullName_last')).not.to.be
      .null;
    expect(
      formDOM.querySelector('#root_secondaryOneFullName_last').maxLength,
    ).to.equal(30);

    expect(formDOM.querySelector('#root_secondaryOneSsnOrTin')).not.to.be.null;

    expect(formDOM.querySelector('#root_secondaryOneDateOfBirthMonth')).not.to
      .be.null;
    expect(formDOM.querySelector('#root_secondaryOneDateOfBirthDay')).not.to.be
      .null;
    expect(formDOM.querySelector('#root_secondaryOneDateOfBirthYear')).not.to.be
      .null;

    expect(formDOM.querySelector('#root_secondaryOneGender_0')).not.to.be.null;
    expect(formDOM.querySelector('#root_secondaryOneGender_1')).not.to.be.null;

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(3);
    expect(onSubmit.called).to.be.false;
  });

  it('should render primary caregiver one contact page', () => {
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
    } = formConfig.chapters.secondaryCaregiversChapter.pages.secondaryCaregiverOneThree;
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

    expect(view.container.querySelectorAll('input, select').length).to.equal(6);
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
      '#root_secondaryOneAddress_street',
      view.container,
    );
    expect(addressElement.error).to.contain('Please enter a street address');

    // city
    const cityElement = view.container.querySelector(
      '#root_secondaryOneAddress_city',
      view.container,
    );
    expect(cityElement.error).to.contain('Please enter a city');

    // state
    const stateElement = view.container.querySelector(
      '#root_secondaryOneAddress_state',
      view.container,
    );
    expect(stateElement.error).to.contain('Please enter a state');

    // Zip code
    const zipcodeElement = view.container.querySelector(
      '#root_secondaryOneAddress_postalCode',
      view.container,
    );
    expect(zipcodeElement.error).to.contain('Please enter a postal code');

    expect(view.container.querySelectorAll('.usa-input-error').length).to.equal(
      2,
    );

    expect(onSubmit.called).to.be.false;
  });
});
