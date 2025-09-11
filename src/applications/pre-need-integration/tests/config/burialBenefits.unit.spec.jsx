import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { mockFetch } from 'platform/testing/unit/helpers';
import {
  DefinitionTester,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

const mockStore = configureMockStore();

const payload = {
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
  } = formConfig.chapters.burialBenefits.pages.burialBenefitsVeteran;

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

    expect(form.find('input').length).to.equal(3);
    form.unmount();
  });

  it('should not submit empty form', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    fireEvent.submit(container.querySelector('form'));

    await waitFor(() => {
      const errorElements = container.querySelectorAll('.usa-input-error');
      expect(errorElements.length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });
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
        />{' '}
      </Provider>,
    );

    selectRadio(form, 'root_application_hasCurrentlyBuried', '1');

    form.find('form').simulate('submit');

    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
