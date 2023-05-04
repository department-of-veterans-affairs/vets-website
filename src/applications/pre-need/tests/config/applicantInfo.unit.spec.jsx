import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils.jsx';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import formConfig from '../../config/form';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Pre-need applicant information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.applicantInformation;
  it('should render', () => {
    const initialState = {
      form: {
        data: { application: { claimant: { dateOfBirth: '1990-01-01' } } },
      },
    };
    const store = mockStore(initialState);
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect(form.find('input').length).to.equal(9);
    expect(form.find('select').length).to.equal(1);
    expect(form.find('va-memorable-date').length).to.equal(1);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const initialState = {
      form: {
        data: { application: { claimant: { dateOfBirth: '' } } },
      },
    };
    const store = mockStore(initialState);
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
        ,
      </Provider>,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(5);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit with required information', () => {
    const initialState = {
      form: {
        data: {
          application: {
            claimant: {
              name: { first: '', last: '' },
              ssn: '',
              dateOfBirth: '',
              relationshipToVet: '',
            },
          },
        },
      },
    };
    const store = mockStore(initialState);
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
        ,
      </Provider>,
    );

    fillData(form, 'input#root_application_claimant_name_first', 'test');
    fillData(form, 'input#root_application_claimant_name_last', 'test2');
    fillData(form, 'input#root_application_claimant_ssn', '234443344');
    fillData(form, 'input#root_application_claimant_dateOfBirthMonth', '2');
    fillData(form, 'input#root_application_claimant_dateOfBirthDay', '2');
    fillData(form, 'input#root_application_claimant_dateOfBirthYear', '2001');
    selectRadio(form, 'root_application_claimant_relationshipToVet', '1');

    form.find('form').simulate('submit');

    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should reveal info message', () => {
    const initialState = {
      form: {
        data: { application: { claimant: { dateOfBirth: '1990-01-01' } } },
      },
    };
    const store = mockStore(initialState);
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
        ,
      </Provider>,
    );

    expect(form.find('va-alert').exists()).to.be.false;

    selectRadio(form, 'root_application_claimant_relationshipToVet', '1');

    expect(form.find('va-alert').exists()).to.be.true;
    form.unmount();
  });
});
