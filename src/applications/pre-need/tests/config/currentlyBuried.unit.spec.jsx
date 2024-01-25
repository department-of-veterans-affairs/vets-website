import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils';
import { mockFetch } from 'platform/testing/unit/helpers';
import formConfig from '../../config/form';

const mockStore = configureMockStore();

const payload = {
  application: {
    claimant: {
      relationshipToVet: '1',
    },
  },
  claimant: {
    hasCurrentlyBuried: '1',
  },
};

const store = mockStore({
  form: {
    data: payload,
  },
});

const response = {
  data: [
    {
      id: 915,
      type: 'preneeds_cemeteries',
      attributes: {
        // eslint-disable-next-line camelcase
        cemetery_id: '915',
        name: 'ABRAHAM LINCOLN NATIONAL CEMETERY',
        // eslint-disable-next-line camelcase
        cemetery_type: 'N',
        num: '915',
      },
    },
  ],
};

describe('Pre-need burial benefits', () => {
  beforeEach(() => mockFetch(response));
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.burialBenefits.pages.currentlyBuriedPersons;

  it('should render', () => {
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(2);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit with required information', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    fillData(
      form,
      'input#root_application_currentlyBuriedPersons_0_name_first',
      'test',
    );
    fillData(
      form,
      'input#root_application_currentlyBuriedPersons_0_name_last',
      'test2',
    );

    form.find('form').simulate('submit');

    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should change CurrentlyBuriedPersonsDescription to match veteran', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
      </Provider>,
    );
    const div = form.find('.schemaform-block-header');
    expect(div.text()).to.contain(
      'Please provide the details of the person(s) currently buried in a VA national cemetery under your eligibility.',
    );
    form.unmount();
  });

  const sponsorPayload = {
    claimant: {
      hasCurrentlyBuried: '1',
    },
  };

  const sponsorStore = mockStore({
    form: {
      data: sponsorPayload,
    },
  });

  it('should change CurrentlyBuriedPersonsDescription to match sponsor', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={sponsorStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
      </Provider>,
    );
    const div = form.find('.schemaform-block-header');
    expect(div.text()).to.contain(
      'Please provide the details of the person(s) currently buried in a VA national cemetery under the sponsor’s eligibility.',
    );
    form.unmount();
  });

  const emptyStore = mockStore({
    form: {},
  });

  it('should change CurrentlyBuriedPersonsDescription to match sponsor', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={emptyStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
      </Provider>,
    );
    const div = form.find('.schemaform-block-header');
    expect(div.text()).to.contain(
      'Please provide the details of the person(s) currently buried in a VA national cemetery under the sponsor’s eligibility.',
    );
    form.unmount();
  });
});
