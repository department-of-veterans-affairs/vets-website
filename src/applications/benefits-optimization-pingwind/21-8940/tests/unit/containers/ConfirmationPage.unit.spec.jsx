import React from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { format } from 'date-fns';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import ConfirmationPage from '../../../containers/ConfirmationPage';
import formConfig from '../../../config/form';
import testData from '../../e2e/fixtures/data/maximal-test.json';

const submitDate = new Date();
const initialState = {
  form: {
    ...createInitialState(formConfig),
    data: testData.data,
    submission: {
      response: {
        attributes: {
          confirmationNumber: '1234567890',
        },
      },
      timestamp: submitDate,
    },
  },
};
const mockStore = state => createStore(() => state);

const renderPage = state => {
  const store = mockStore(state);
  return render(
    <Provider store={store}>
      <ConfirmationPage route={{ formConfig }} />
    </Provider>,
  );
};

describe('ConfirmationPage', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders confirmation number from the submission response', () => {
    const { getByText } = renderPage(initialState);

    expect(getByText(/Your confirmation number is 1234567890/i)).to.exist;
  });

  it('should select form from state when state.form is defined', () => {
    const { getByText } = renderPage(initialState);

    expect(getByText(format(submitDate, 'MMMM d, yyyy'), { exact: false })).to
      .exist;
  });
});
