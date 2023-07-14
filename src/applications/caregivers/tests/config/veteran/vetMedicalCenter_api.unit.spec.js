import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../../config/form';

describe('CG VeteranMedicalCenterLighthouse config', () => {
  const middleware = [];
  const mockStore = configureStore(middleware);
  const veteran = {
    form: {
      data: {
        veteranPreferredFacility: { veteranFacilityState: '' },
      },
    },
  };
  const store = mockStore(veteran);
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranChapter.pages.veteranInfoThreeLighthouse;
  const { defaultDefinitions: definitions } = formConfig;

  it('should render', () => {
    const props = {
      schema,
      definitions,
      uiSchema,
      data: {
        veteranLastTreatmentFacility: {},
      },
    };
    const view = render(
      <Provider store={store}>
        <DefinitionTester {...props} />
      </Provider>,
    );
    const formDOM = view.container;
    expect(formDOM.querySelectorAll('input, select').length).to.equal(3);
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
        veteranLastTreatmentFacility: {},
      },
    };
    const view = render(
      <Provider store={store}>
        <DefinitionTester {...props} />
      </Provider>,
    );
    const formDOM = view.container;
    const selectors = {
      facility: formDOM.querySelector(
        '#root_veteranPreferredFacility_plannedClinic',
      ),
      submitBtn: formDOM.querySelector('button[type=submit]'),
      errors: formDOM.querySelectorAll('.usa-input-error'),
    };

    fireEvent.click(selectors.submitBtn);
    expect(selectors.facility).to.have.attribute('error');
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with valid data', () => {
    const onSubmit = sinon.spy();
    const props = {
      schema,
      definitions,
      onSubmit,
      uiSchema,
      data: {
        veteranLastTreatmentFacility: {},
        veteranPreferredFacility: {
          veteranFacilityState: 'IL',
          plannedClinic: '550',
        },
      },
    };
    const form = mount(
      <Provider store={store}>
        <DefinitionTester {...props} />
      </Provider>,
    );
    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
