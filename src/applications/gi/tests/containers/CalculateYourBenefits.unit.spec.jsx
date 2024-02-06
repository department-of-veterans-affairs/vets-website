import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { render, waitFor } from '@testing-library/react';
import CalculateYourBenefits from '../../containers/CalculateYourBenefits';
import {
  CALCULATED,
  CALCULATOR,
  CONSTANTS,
  ESTIMATED_BENEFITS,
  ELIGIBILITY,
  PROFILE,
} from '../data/calculate-benefits-data';

const getData = ({
  showNod = true,
  part3 = true,
  isLoading = false,
  loggedIn = true,
  formData = {},
  contestableIssues = { status: '' },
  returnUrl = '/veteran-details',
} = {}) => ({
  props: {
    loggedIn,
    showNod,
    location: { pathname: '/introduction', search: '' },
    children: <h1>Intro</h1>,
    // formData,
    router: { push: () => {} },
  },
  data: {
    profile: PROFILE,
    eligibility: ELIGIBILITY,
    estimatedBenefits: ESTIMATED_BENEFITS,
    calculator: CALCULATOR,
    calculated: CALCULATED,
    constants: CONSTANTS,
    featureToggles: {
      loading: isLoading,
      /* eslint-disable camelcase */
      form10182_nod: showNod,
      nod_part3_update: part3,
      /* eslint-enable camelcase */
    },
    user: {
      login: {
        currentlyLoggedIn: loggedIn,
      },
      profile: {
        savedForms: [],
        prefillsAvailable: [],
        verified: true,
      },
    },
    form: {
      loadedStatus: 'success',
      savedStatus: '',
      loadedData: {
        metadata: {
          returnUrl,
        },
      },
      data: {
        ...formData,
      },
    },
    contestableIssues,
  },
});

describe('<CalculateYourBenefits>', () => {
  const oldWindow = global.window;

  afterEach(() => {
    global.window = oldWindow;
  });

  it('should render', async () => {
    const middleware = [thunk];
    const mockStore = configureStore(middleware);
    const gibctEybBottomSheet = undefined;
    const isOJT = false;
    const { props, data } = getData();
    const store = mockStore(data);
    render(
      <Provider store={mockStore(data)}>
        <CalculateYourBenefits
          gibctEybBottomSheet={gibctEybBottomSheet}
          isOJT={isOJT}
          {...props}
        />
      </Provider>,
    );
    await waitFor(() => {
      const action = store.getActions();
      expect(action.length).to.eq(0);
    });
  });
});
