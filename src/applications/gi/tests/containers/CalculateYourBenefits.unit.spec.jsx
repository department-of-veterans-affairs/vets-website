import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
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
  isLoading = false,
  loggedIn = true,
  formData = {},
  contestableIssues = { status: '' },
  returnUrl = '/veteran-details',
} = {}) => ({
  props: {
    loggedIn,
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

  it('should render with gibctEybBottomSheet', async () => {
    const middleware = [thunk];
    const mockStore = configureStore(middleware);
    const gibctEybBottomSheet = true;
    const isOJT = false;
    const { props, data } = getData();
    const store = mockStore(data);
    const { container } = render(
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
      fireEvent.click($('button.eyb-button', container));
      expect($('div.va-modal', container)).to.exist;
    });
  });
  it('should render with empty attributes', async () => {
    const middleware = [thunk];
    const mockStore = configureStore(middleware);
    const gibctEybBottomSheet = true;
    const isOJT = false;
    const { props, data } = getData();
    const PROFILE_EMPTY = {
      attributes: {
        ...data.profile.attributes,
        vetWebsiteLink: '',
        section103Message: '',
      },
    };
    const dataUndefined = {
      ...data,
      profile: PROFILE_EMPTY,
    };
    const store = mockStore(dataUndefined);
    render(
      <Provider store={mockStore(dataUndefined)}>
        <CalculateYourBenefits
          gibctEybBottomSheet={gibctEybBottomSheet}
          isOJT={isOJT}
          estimatedBenefits=""
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
