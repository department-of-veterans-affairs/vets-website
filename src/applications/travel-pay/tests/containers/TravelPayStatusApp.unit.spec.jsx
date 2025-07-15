import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockDate from 'mockdate';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import reducer from '../../redux/reducer';
import TravelPayStatusApp from '../../containers/TravelPayStatusApp';

describe('TravelPayStatusApp', () => {
  const oldLocation = global.window.location;
  const getData = ({
    areFeatureTogglesLoading = true,
    hasFeatureFlag = true,
    hasClaimDetailsFeatureFlag = true,
    hasSmocFeatureFlag = false,
    loadingClaims = false,
    claimsData = {},
  } = {}) => {
    return {
      featureToggles: {
        loading: areFeatureTogglesLoading,
        /* eslint-disable camelcase */
        travel_pay_power_switch: hasFeatureFlag,
        travel_pay_view_claim_details: hasClaimDetailsFeatureFlag,
        travel_pay_submit_mileage_expense: hasSmocFeatureFlag,
        /* eslint-enable camelcase */
      },
      scheduledDowntime: {
        globalDowntime: null,
        isReady: true,
        isPending: false,
        serviceMap: { get() {} },
        dismissedDowntimeWarnings: [],
      },
      travelClaims: {
        isLoading: loadingClaims,
        claims: claimsData,
      },
    };
  };

  beforeEach(() => {
    global.window.location = {};
    global.window.location.replace = sinon.spy();
    const mockTravelClaims = {
      data: [
        {
          id: '6ea23179-e87c-44ae-a20a-f31fb2c132fb',
          claimNumber: 'TC0928098230498',
          claimName: 'string',
          claimStatus: 'In process',
          appointmentDateTime: aprDate,
          appointmentName: 'more recent',
          appointmentLocation: 'Cheyenne VA Medical Center',
          createdOn: '2024-04-22T21:22:34.465Z',
          modifiedOn: '2024-04-23T16:44:34.465Z',
        },
        {
          id: '6ea23179-e87c-44ae-a20a-f31fb2c132ig',
          claimNumber: 'TC0928098230498',
          claimName: 'string',
          claimStatus: 'Incomplete',
          appointmentDateTime: febDate,
          appointmentName: 'older',
          appointmentLocation: 'Cheyenne VA Medical Center',
          createdOn: '2024-02-22T21:22:34.465Z',
          modifiedOn: '2024-02-23T16:44:34.465Z',
        },
        {
          id: 'abcd1234-65af-4495-b18e-7fd28cab546a',
          claimNumber: 'TC0928098231234',
          claimName: 'string',
          claimStatus: 'Saved',
          appointmentDateTime: null,
          appointmentName: 'Medical imaging',
          appointmentLocation: 'Tomah VA Medical Center',
          createdOn: '2024-01-22T17:11:43.034Z',
          modifiedOn: '2024-01-22T17:11:43.034Z',
        },
        {
          id: '6cecf332-65af-4495-b18e-7fd28ccb546a',
          claimNumber: '39b7b38f-b7cf-4d19-91cf-fb5360c0b8b8',
          claimName: '3583ec0e-34e0-4cf5-99d6-78930c2be969',
          claimStatus: 'Saved',
          appointmentDateTime: previousYearDate,
          appointmentName: 'Medical imaging',
          appointmentLocation: 'Tomah VA Medical Center',
          createdOn: '2023-09-22T17:11:43.034Z',
          modifiedOn: '2023-09-27T17:11:43.034Z',
        },
      ],
    };
    mockApiRequest(mockTravelClaims);
    MockDate.set('2024-06-25');
  });

  afterEach(() => {
    global.window.location = oldLocation;
    MockDate.reset();
  });

  it('should redirect if feature flag is off', () => {
    renderWithStoreAndRouter(<TravelPayStatusApp />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: false,
      }),
      path: `/claims/`,
      reducers: reducer,
    });
    expect(window.location.replace.called).to.be.true;
  });

  it('should redirect the root path / to /claims/ and render the app.', () => {
    const screenFeatureToggle = renderWithStoreAndRouter(
      <TravelPayStatusApp />,
      {
        initialState: getData(),
        path: `/`,
        reducers: reducer,
      },
    );
    expect(screenFeatureToggle.getByTestId('travel-pay-loading-indicator')).to
      .exist;
  });

  it('should render loading state if feature flag is loading', () => {
    const screenFeatureToggle = renderWithStoreAndRouter(
      <TravelPayStatusApp />,
      {
        initialState: getData(),
        path: `/claims/`,
        reducers: reducer,
      },
    );
    expect(screenFeatureToggle.getByTestId('travel-pay-loading-indicator')).to
      .exist;
    // The date select should not render if loading
    expect(screenFeatureToggle.queryAllByTestId('claimsDates').length).to.eq(0);
  });

  it('handles a failed fetch of claims when user is not a Veteran', async () => {
    const screen = renderWithStoreAndRouter(<TravelPayStatusApp />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasSmocFeatureFlag: true,
        hasFeatureFlag: true,
        loadingClaims: false,
        claimsData: {
          pastThreeMonths: {
            metadata: {},
            data: [],
            error: { errors: [{ title: 'Forbidden', status: 403 }] },
          },
        },
      }),
      path: `/claims/`,
      reducers: reducer,
    });

    await waitFor(() => {
      expect(screen.getByText(/We can’t find any travel claims for you/i)).to
        .exist;
      expect(screen.queryAllByTestId('travel-claim-details').length).to.eq(0);
      expect($('va-alert[status="warning"]')).to.exist;
    });
  });

  it('renders the correct date range in the select', async () => {
    const screen = renderWithStoreAndRouter(<TravelPayStatusApp />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
      }),
      path: `/claims/`,
      reducers: reducer,
    });

    await waitFor(() => {
      expect(screen.getAllByRole('option').length).to.eq(7);
      expect(screen.getAllByRole('option')[0].value).to.eq(
        '{"label":"Past 3 Months","value":"pastThreeMonths","start":"2024-03-25T00:00:00","end":"2024-06-25T23:59:59"}',
      );

      const dateSelect = screen.getByTestId('claimsDates');

      expect(dateSelect).to.have.value(
        '{"label":"Past 3 Months","value":"pastThreeMonths","start":"2024-03-25T00:00:00","end":"2024-06-25T23:59:59"}',
      );

      dateSelect.__events.vaSelect({
        target: {
          value:
            '{"label":"Jan 2024 - Mar 2024","value":"Q1_2024","start":"2024-01-01T00:00:00","end":"2024-03-31T23:59:59"}',
        },
      });

      userEvent.selectOptions(dateSelect, ['Jan 2024 - Mar 2024']);

      expect(
        screen.getByRole('option', { name: 'Jan 2024 - Mar 2024' }).selected,
      ).to.true;
    });
  });

  it('renders SMOC entry point with flag on', async () => {
    const screen = renderWithStoreAndRouter(<TravelPayStatusApp />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasSmocFeatureFlag: true,
        hasFeatureFlag: true,
      }),
      path: `/claims/`,
      reducers: reducer,
    });

    expect(screen.getByText('Travel reimbursement claims')).to.exist;
    expect($('va-link-action[text="Go to your past appointments"]')).to.exist;
  });

  // TODO: Figure out why this is still rendering a loading spinner....
  // it('renders SMOC entry point for get claims error with flag on', async () => {
  //   const screen = renderWithStoreAndRouter(<TravelPayStatusApp />, {
  //     initialState: getData({
  //       areFeatureTogglesLoading: false,
  //       hasSmocFeatureFlag: true,
  //       hasFeatureFlag: true,
  //       loadingClaims: false,
  //       claimsData: {
  //         pastThreeMonths: {
  //           metadata: {},
  //           data: [],
  //           error: { errors: [{ title: 'Forbidden', status: 403 }] },
  //         },
  //       },
  //     }),
  //     path: `/claims/`,
  //     reducers: reducer,
  //   });

  //   expect(screen.getByText('Travel reimbursement claims')).to.exist;
  //   expect($('va-link-action[text="Go to your past appointments"]')).to.exist;
  //   expect(screen.getByText(/We can’t find any travel claims for you/i)).to
  //     .exist;
  // });
});
