import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent } from '@testing-library/react';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../../config/form';
import { simulateInputChange } from '../../helpers';

describe('CG SecondaryOneCaregiverContactInfo config', () => {
  const middleware = [];
  const mockStore = configureStore(middleware);
  const address = {
    form: {
      data: {},
    },
  };
  const store = mockStore(address);
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.secondaryCaregiversChapter.pages.secondaryCaregiverOneThree;
  const { defaultDefinitions: definitions } = formConfig;

  it('should render', () => {
    const props = {
      schema,
      definitions,
      uiSchema,
      data: {
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
      },
    };
    const view = render(
      <Provider store={store}>
        <DefinitionTester {...props} />
      </Provider>,
    );
    const formDOM = view.container;
    expect(formDOM.querySelectorAll('.va-address-block')).to.exist;
    expect(formDOM.querySelectorAll('input, select').length).to.equal(6);
    expect(formDOM.querySelectorAll('va-checkbox').length).to.equal(1);
    expect(formDOM.querySelectorAll('va-text-input').length).to.equal(4);
    expect(formDOM.querySelectorAll('va-select').length).to.equal(1);
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const props = {
      schema,
      definitions,
      onSubmit,
      uiSchema,
      data: {
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
      },
    };
    const view = render(
      <Provider store={store}>
        <DefinitionTester {...props} />
      </Provider>,
    );
    const formDOM = view.container;
    const selectors = {
      street: formDOM.querySelector('#root_secondaryOneAddress_street'),
      city: formDOM.querySelector('#root_secondaryOneAddress_city'),
      state: formDOM.querySelector('#root_secondaryOneAddress_state'),
      postalCode: formDOM.querySelector('#root_secondaryOneAddress_postalCode'),
      submitBtn: formDOM.querySelector('button[type=submit]'),
      errors: formDOM.querySelectorAll('.usa-input-error'),
    };

    fireEvent.click(selectors.submitBtn);
    expect(selectors.street).to.have.attribute('error');
    expect(selectors.city).to.have.attribute('error');
    expect(selectors.state).to.have.attribute('error');
    expect(selectors.postalCode).to.have.attribute('error');
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with valid data', () => {
    const props = {
      schema,
      definitions,
      uiSchema,
      data: {
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
      },
    };
    const view = render(
      <Provider store={store}>
        <DefinitionTester {...props} />
      </Provider>,
    );
    const formDOM = view.container;

    simulateInputChange(
      formDOM,
      '#root_secondaryOneAddress_street',
      '1350 I St. NW',
    );
    simulateInputChange(
      formDOM,
      '#root_secondaryOneAddress_city',
      'Washington',
    );
    simulateInputChange(formDOM, '#root_secondaryOneAddress_state', 'DC');
    simulateInputChange(
      formDOM,
      '#root_secondaryOneAddress_postalCode',
      '20005',
    );
    simulateInputChange(
      formDOM,
      '#root_secondaryOnePrimaryPhoneNumber',
      '8008271000',
    );
    simulateInputChange(formDOM, '#root_secondaryOneVetRelationship', 'Son');
    fireEvent.click(formDOM.querySelector('button[type=submit]'));

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
  });
});
