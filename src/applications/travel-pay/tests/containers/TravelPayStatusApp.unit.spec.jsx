import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockDate from 'mockdate';
import { subDays, addDays, format } from 'date-fns';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { createServiceMap } from '@department-of-veterans-affairs/platform-monitoring';
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

  it('sets the default page title', async () => {
    // Set the initial title that would be set by the app router/layout
    document.title = 'Travel Pay | Veterans Affairs';
    renderWithStoreAndRouter(<TravelPayStatusApp />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
      }),
      path: `/claims/`,
      reducers: reducer,
    });

    // Verify the title remains as the default since this component doesn't set a custom title
    expect(document.title).to.equal('Travel Pay | Veterans Affairs');
  });

  it('shows downtime alert during maintenance window', () => {
    const serviceMap = createServiceMap([
      {
        attributes: {
          externalService: 'travel_pay',
          status: 'down',
          startTime: format(subDays(new Date(), 1), "yyyy-LL-dd'T'HH:mm:ss"),
          endTime: format(addDays(new Date(), 1), "yyyy-LL-dd'T'HH:mm:ss"),
        },
      },
    ]);

    const screen = renderWithStoreAndRouter(<TravelPayStatusApp />, {
      initialState: {
        ...getData({
          areFeatureTogglesLoading: false,
          hasFeatureFlag: true,
        }),
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap,
          dismissedDowntimeWarnings: [],
        },
      },
      path: `/claims/`,
      reducers: reducer,
    });

    expect(screen.getByText(/is down for maintenance/i)).to.exist;
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
