import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import reducer from '../../redux/reducer';
import { formatDateTime } from '../../util/dates';
import TravelPayStatusList from '../../components/TravelPayStatusList';

import travelClaimsAll from '../../services/mocks/travel-claims-31.json';

describe('TravelPayStatusList', () => {
  const mockTravelClaimsData = [
    {
      id: '6ea23179-e87c-44ae-a20a-f31fb2c132fb',
      claimNumber: 'TC0928098230498',
      claimName: 'string',
      claimStatus: 'In process',
      appointmentDateTime: '2024-04-22T16:45:34.465Z',
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
      appointmentDateTime: '2024-02-22T16:45:34.465Z',
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
      appointmentDateTime: '2023-09-21T17:11:43.034Z',
      appointmentName: 'Medical imaging',
      appointmentLocation: 'Tomah VA Medical Center',
      createdOn: '2023-09-22T17:11:43.034Z',
      modifiedOn: '2023-09-27T17:11:43.034Z',
    },
  ];

  const mockClaimsMeta = {
    status: 200,
    totalRecordCount: 4,
    pageNumber: 1,
  };

  it('handles a failed fetch of claims when user is not a Veteran', async () => {
    const errorClaims = {
      metadata: {},
      data: [],
      error: { errors: [{ title: 'Forbidden', status: 403 }] },
    };

    const screen = render(
      <TravelPayStatusList claims={errorClaims} canViewClaimDetails />,
    );

    await waitFor(() => {
      expect(screen.getByText(/We can’t find any travel claims for you/i)).to
        .exist;
      expect(screen.queryAllByTestId('travel-claim-details').length).to.eq(0);
      expect($('va-additional-info')).to.not.exist;
      expect($('va-alert[status="warning"]')).to.exist;
    });
  });

  it('handles unspecified errors', async () => {
    const errorClaims = {
      metadata: {},
      data: [],
      error: { errors: [{ title: 'Service unavailable', status: 500 }] },
    };

    const screen = render(
      <TravelPayStatusList claims={errorClaims} canViewClaimDetails />,
    );

    await waitFor(() => {
      expect(screen.getByText(/we can’t access your travel claims right now/i))
        .to.exist;
      expect(screen.queryAllByTestId('travel-claim-details').length).to.eq(0);
      expect($('va-additional-info')).to.not.exist;
      expect($('va-alert[status="error"]')).to.exist;
    });
  });

  it('handles a successful fetch of zero claims', async () => {
    const screen = renderWithStoreAndRouter(
      <TravelPayStatusList
        claims={{ metadata: mockClaimsMeta, data: [], error: null }}
        canViewClaimDetails
      />,
      {
        initialState: {},
        path: '/claims/',
        reducers: reducer,
      },
    );

    await waitFor(() => {
      expect(screen.queryAllByTestId('travel-claim-details').length).to.eq(0);
      expect(screen.getByText(/No travel claims to show./i)).to.exist;
    });
  });

  it('successfully displays claims', async () => {
    const mockClaims = [
      {
        id: '6ea23179-e87c-44ae-a20a-f31fb2c132fb',
        claimNumber: 'TC0928098230498',
        claimName: 'string',
        claimStatus: 'In process',
        appointmentDateTime: '2024-04-22T16:45:34.465Z',
        appointmentName: 'more recent',
        appointmentLocation: 'Cheyenne VA Medical Center',
        createdOn: '2024-04-22T21:22:34.465Z',
        modifiedOn: '2024-04-23T16:44:34.465Z',
      },
    ];

    const screen = renderWithStoreAndRouter(
      <TravelPayStatusList
        claims={{
          metadata: mockClaimsMeta,
          data: mockClaims,
          error: null,
        }}
        canViewClaimDetails
      />,
      {
        initialState: {},
        path: '/claims/',
        reducers: reducer,
      },
    );

    await waitFor(() => {
      expect(screen.container.querySelectorAll('va-card').length).to.eq(1);
      expect(screen.queryAllByTestId('travel-claim-details').length).to.eq(1);
      expect(screen.getByText(/Travel reimbursement claim details/i)).to.exist;
    });
  });

  it("doesn't show claim details link if feature flag is disabled", async () => {
    const mockClaims = [
      {
        id: '6ea23179-e87c-44ae-a20a-f31fb2c132fb',
        claimNumber: 'TC0928098230498',
        claimName: 'string',
        claimStatus: 'In process',
        appointmentDateTime: '2024-04-22T16:45:34.465Z',
        appointmentName: 'more recent',
        appointmentLocation: 'Cheyenne VA Medical Center',
        createdOn: '2024-04-22T21:22:34.465Z',
        modifiedOn: '2024-04-23T16:44:34.465Z',
      },
    ];

    const screen = renderWithStoreAndRouter(
      <TravelPayStatusList
        claims={{
          metadata: mockClaimsMeta,
          data: mockClaims,
          error: null,
        }}
        canViewClaimDetails={false}
      />,
      {
        initialState: {},
        path: '/claims/',
        reducers: reducer,
      },
    );

    await waitFor(() => {
      expect(screen.queryAllByTestId('travel-claim-details').length).to.eq(1);
      expect(screen.queryByText('Travel reimbursement claim details')).to.be
        .null;
    });
  });

  it('filters by status', async () => {
    const screen = renderWithStoreAndRouter(
      <TravelPayStatusList claims={travelClaimsAll} canViewClaimDetails />,
      {
        initialState: {},
        path: `/claims/`,
        reducers: reducer,
      },
    );

    await waitFor(async () => {
      userEvent.click(
        document.querySelector(
          'va-accordion-item[header="Filter and sort travel claims"]',
        ),
      );

      const statusFilters = screen.getAllByTestId(/status-filter_/);
      const filterNames = statusFilters.map(filter => filter.name);

      const orderedStatuses = [
        'On hold',
        'Denied',
        'In manual review',
        'Appealed',
        'Claim submitted',
        'Closed',
        'In process',
        'Incomplete',
        'Saved',
      ];
      expect(filterNames).to.eql(orderedStatuses);

      const checkboxGroup = $('#status-checkboxes');
      checkboxGroup.__events.vaChange({
        target: {
          name: 'Incomplete',
          checked: true,
        },
      });
    });

    userEvent.click($('va-button[text="Apply filters"]'));

    expect(screen.getAllByTestId('travel-claim-details').length).to.eq(1);
  });

  it('Orders status filters correctly when claims only have a subset of "top" statuses', async () => {
    const topStatusesSubset = travelClaimsAll.data.filter(
      claim =>
        claim.claimStatus === 'On hold' ||
        claim.claimStatus === 'In manual review',
    );

    const screen = renderWithStoreAndRouter(
      <TravelPayStatusList
        claims={{ metadata: mockClaimsMeta, data: topStatusesSubset }}
        canViewClaimDetails
      />,
      {
        initialState: {},
        path: `/claims/`,
        reducers: reducer,
      },
    );

    await waitFor(async () => {
      userEvent.click(
        document.querySelector(
          'va-accordion-item[header="Filter and sort travel claims"]',
        ),
      );

      const statusFilters = screen.getAllByTestId(/status-filter_/);
      const filterNames = statusFilters.map(filter => filter.name);

      const orderedStatuses = ['On hold', 'In manual review'];
      expect(filterNames).to.eql(orderedStatuses);
    });
  });

  it('Orders status filters correctly when claims have no "top" statuses', async () => {
    const nonTopStatuses = travelClaimsAll.data.filter(
      claim =>
        !['On hold', 'Denied', 'In manual review'].includes(claim.claimStatus),
    );

    const screen = renderWithStoreAndRouter(
      <TravelPayStatusList
        claims={{ metadata: mockClaimsMeta, data: nonTopStatuses }}
        canViewClaimDetails
      />,
      {
        initialState: {},
        path: `/claims/`,
        reducers: reducer,
      },
    );

    await waitFor(async () => {
      userEvent.click(
        document.querySelector(
          'va-accordion-item[header="Filter and sort travel claims"]',
        ),
      );

      const statusFilters = screen.getAllByTestId(/status-filter_/);
      const filterNames = statusFilters.map(filter => filter.name);

      const orderedStatuses = [
        'Appealed',
        'Claim submitted',
        'Closed',
        'In process',
        'Incomplete',
        'Saved',
      ];
      expect(filterNames).to.eql(orderedStatuses);
    });
  });

  it('Orders status filters correctly when claims have a subset of top statuses and non-top statuses', async () => {
    const topStatusesSubset = travelClaimsAll.data.filter(
      claim =>
        claim.claimStatus === 'On hold' ||
        claim.claimStatus === 'In manual review' ||
        claim.claimStatus === 'Closed' ||
        claim.claimStatus === 'Saved',
    );

    const screen = renderWithStoreAndRouter(
      <TravelPayStatusList
        claims={{ metadata: mockClaimsMeta, data: topStatusesSubset }}
        canViewClaimDetails
      />,
      {
        initialState: {},
        path: `/claims/`,
        reducers: reducer,
      },
    );

    await waitFor(async () => {
      userEvent.click(
        document.querySelector(
          'va-accordion-item[header="Filter and sort travel claims"]',
        ),
      );

      const statusFilters = screen.getAllByTestId(/status-filter_/);
      const filterNames = statusFilters.map(filter => filter.name);

      const orderedStatuses = [
        'On hold',
        'In manual review',
        'Closed',
        'Saved',
      ];
      expect(filterNames).to.eql(orderedStatuses);
    });
  });

  it('sorts the claims correctly using the select-option', async () => {
    const screen = renderWithStoreAndRouter(
      <TravelPayStatusList
        claims={{ metadata: mockClaimsMeta, data: mockTravelClaimsData }}
        canViewClaimDetails
      />,
      {
        initialState: {},
        path: `/claims/`,
        reducers: reducer,
      },
    );

    await waitFor(() => {
      const [date, time] = formatDateTime('2023-09-21T17:11:43.034Z', true);

      userEvent.click(
        document.querySelector(
          'va-accordion-item[header="Filter and sort travel claims"]',
        ),
      );

      const orderSelect = screen.getByTestId('claimsOrder');
      orderSelect.__events.vaSelect({
        target: {
          value: 'oldest',
        },
      });

      userEvent.selectOptions(orderSelect, ['oldest']);

      expect(screen.getByRole('option', { name: 'Oldest' }).selected).to.true;

      userEvent.click(
        document.querySelector('va-button[text="Apply filters"]'),
      );

      expect(
        screen.getByText('Showing 1 ‒ 4 of 4 claims, sorted by oldest first.'),
      ).to.exist;

      expect(screen.getAllByTestId('travel-claim-details').length).to.eq(4);
      expect(
        screen.getAllByTestId('travel-claim-details')[0].textContent,
      ).to.eq(`${date} at ${time} appointment`);
      expect(
        screen.getAllByTestId('travel-claim-details')[1].textContent,
      ).to.eq('Appointment information not available');
    });

    await waitFor(() => {
      const [date, time] = formatDateTime('2024-04-22T16:45:34.465Z', true);

      userEvent.click(
        document.querySelector(
          'va-accordion-item[header="Filter and sort travel claims"]',
        ),
      );
      const orderSelect = screen.getByTestId('claimsOrder');
      orderSelect.__events.vaSelect({
        target: {
          value: 'mostRecent',
        },
      });

      userEvent.selectOptions(orderSelect, ['mostRecent']);

      expect(screen.getByRole('option', { name: 'Most Recent' }).selected).to
        .true;

      userEvent.click(
        document.querySelector('va-button[text="Apply filters"]'),
      );

      expect(
        screen.getByText('Showing 1 ‒ 4 of 4 claims, sorted by newest first.'),
      ).to.exist;

      expect(screen.getAllByTestId('travel-claim-details').length).to.eq(4);
      expect(
        screen.getAllByTestId('travel-claim-details')[0].textContent,
      ).to.eq(`${date} at ${time} appointment`);
      expect(
        screen.getAllByTestId('travel-claim-details')[2].textContent,
      ).to.eq('Appointment information not available');
    });
  });

  it('filters by status and date together', async () => {
    const screen = renderWithStoreAndRouter(
      <TravelPayStatusList
        claims={{ metadata: mockClaimsMeta, data: mockTravelClaimsData }}
        canViewClaimDetails
      />,
      {
        initialState: {},
        path: `/claims/`,
        reducers: reducer,
      },
    );

    await waitFor(async () => {
      const [date, time] = formatDateTime('2023-09-21T17:11:43.034Z', true);

      userEvent.click(
        document.querySelector(
          'va-accordion-item[header="Filter and sort travel claims"]',
        ),
      );

      const orderSelect = screen.getByTestId('claimsOrder');
      orderSelect.__events.vaSelect({
        target: {
          value: 'oldest',
        },
      });

      userEvent.selectOptions(orderSelect, ['oldest']);

      expect(screen.getByRole('option', { name: 'Oldest' }).selected).to.true;

      const checkboxGroup = $('#status-checkboxes');
      checkboxGroup.__events.vaChange({
        target: {
          name: 'Saved',
          checked: true,
        },
      });

      userEvent.click(
        document.querySelector('va-button[text="Apply filters"]'),
      );

      expect(
        screen.getByText(
          'Showing 1 ‒ 2 of 2 claims, sorted by oldest first, with 2 filters applied.',
        ),
      ).to.exist;
      expect(screen.getAllByTestId('travel-claim-details').length).to.eq(2);
      expect(
        screen.getAllByTestId('travel-claim-details')[0].textContent,
      ).to.eq(`${date} at ${time} appointment`);
    });

    fireEvent.click(document.querySelector('va-button[text="Reset search"]'));
    expect(screen.getAllByTestId('travel-claim-details').length).to.eq(4);
  });

  it('renders pagination correctly', async () => {
    const screen = renderWithStoreAndRouter(
      <TravelPayStatusList claims={travelClaimsAll} canViewClaimDetails />,
      {
        initialState: {},
        path: '/claims/',
        reducers: reducer,
      },
    );

    await waitFor(() => {
      expect(screen.getByText(/Showing 1 ‒ 10 of 31 claims/i)).to.exist;
      // RTL doesn't support shadow DOM elements, so best we can do here is
      // check that the top-level pagination element gets rendered
      expect(screen.container.querySelectorAll('va-card').length).to.eq(10);
      expect(screen.container.querySelector('va-pagination')).to.exist;
    });
  });
});
