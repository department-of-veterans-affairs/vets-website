import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import formConfig from '../../config/form';
import { supplies } from '../../mocks/mdot/supplies';
import IntroductionPage from '../../containers/IntroductionPage';

const props = {
  route: {
    path: 'introduction',
    pageList: [],
    formConfig,
  },
  // userLoggedIn: false,
  userIdVerified: true,
};

const stateFn = ({
  mdotInProgressFormLoading = false,
  userProfileLoading = false,
} = {}) => ({
  form: {
    formId: formConfig.formId,
    loadedStatus: 'success',
    savedStatus: '',
    loadedData: {
      metadata: {},
    },
    data: {},
  },
  mdotInProgressForm: {
    loading: mdotInProgressFormLoading,
    error: false,
    formData: {
      supplies,
    },
  },
  user: {
    login: {
      currentlyLoggedIn: true,
    },
    profile: {
      loading: userProfileLoading,
      savedForms: [],
      prefillsAvailable: [],
    },
  },
});

const setup = ({ state = stateFn() } = {}) => {
  const mockStore = {
    getState: () => state,
    subscribe: () => {},
    dispatch: () => {},
  };

  return render(
    <Provider store={mockStore}>
      <IntroductionPage {...props} />
    </Provider>,
  );
};

describe('IntroductionPage', () => {
  it('renders', () => {
    const { container, getByTestId, getByRole } = setup();
    expect(container).to.exist;
    getByRole('link', { name: 'Start a new order' });
    getByTestId('reorder--supplies-available');
    // getByTestId('reorder--supplies-unavailable');
  });

  it('renders Loading component when mdotInProgressForm is loading', () => {
    const state = stateFn({ mdotInProgressFormLoading: true });
    const { getByTestId } = setup({ state });
    getByTestId('reorder--loading');
  });

  it('renders Loading component when user profile is loading', () => {
    const state = stateFn({ userProfileLoading: true });
    const { getByTestId } = setup({ state });
    getByTestId('reorder--loading');
  });
});
