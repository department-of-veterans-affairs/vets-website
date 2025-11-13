import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

const mockStore = configureStore([]);

describe('isSponsor Pre-Need Integration info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.sponsorInformation.pages.isSponsor;

  it('should render without errors', () => {
    const store = mockStore({
      form: {
        data: {},
      },
    });

    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect(form.find('va-radio-option').length).to.equal(2);
    form.unmount();
  });

  it('should not submit empty form', async () => {
    const store = mockStore({
      form: {
        data: {},
      },
    });
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
});
