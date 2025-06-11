import React from 'react';
import PreSubmitSection from 'platform/forms/components/review/PreSubmitSection';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import ConfirmationPage from '../../containers/ConfirmationPage';
import formConfig from '../../config/form';
import mockData from '../e2e/fixtures/data/test-data.json';

const subDate = new Date('11/13/2023').toString();

const storeBase = {
  form: {
    ...formConfig,
    ...mockData,
    pages: { page1: { schema: { properties: {} } } },
    submission: {
      response: {
        confirmationNumber: '123456',
      },
      timestamp: subDate,
    },
  },
};

const createForm = options => ({
  submission: {
    hasAttemptedSubmit: false,
    status: false,
  },
  pages: {
    page1: {
      schema: {},
    },
  },
  data: {},
  ...options,
});

describe('Confirmation page', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('should exist', () => {
    const { container } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationPage />
      </Provider>,
    );

    expect(container).to.exist;
  });
});

describe('presubmit section', () => {
  it('should render presubmit section', () => {
    const form = createForm();
    const store = {
      getState: () => ({
        form,
        user: { login: { currentlyLoggedIn: false } },
        location: { pathname: '/review-and-submit' },
        navigation: { showLoginModal: false },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const tree = render(
      <Provider store={store}>
        <PreSubmitSection formConfig={formConfig} />
      </Provider>,
    );

    expect(tree.getByText('Representative’s Statement of truth')).to.exist;

    tree.unmount();
  });

  it('should collect signature', async () => {
    const form = createForm({
      data: { certifierRole: 'applicant', applicantName: 'John' },
    });
    const store = {
      getState: () => ({
        form,
        user: { login: { currentlyLoggedIn: false } },
        location: { pathname: '/review-and-submit' },
        navigation: { showLoginModal: false },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const tree = render(
      <Provider store={store}>
        <PreSubmitSection formConfig={formConfig} />
      </Provider>,
    );

    const sigBlock = tree.container.querySelector('va-text-input');
    // Type wrong signature
    const signature = 'asdf';
    sigBlock.value = signature;
    fireEvent.input(sigBlock, { target: { name: 'name' } });
    await userEvent.type(sigBlock, signature);
    expect(sigBlock.value).to.equal(signature);
    // Type correct signature
    sigBlock.value = form.data.applicantName;
    fireEvent.input(sigBlock, { target: { name: 'name' } });
    await userEvent.type(sigBlock, form.data.applicantName);
    expect(sigBlock.value).to.equal(form.data.applicantName);
    tree.unmount();
  });
});
