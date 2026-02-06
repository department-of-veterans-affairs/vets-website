import React from 'react';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/react';
import {
  MemoryRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom-v5-compat';
import UnsupportedMileage from '../../../../components/complex-claims/pages/UnsupportedMileage';
import { BTSSS_PORTAL_URL } from '../../../../constants';
import reducer from '../../../../redux/reducer';

describe('Travel Pay – UnsupportedMileage', () => {
  const LocationDisplay = () => {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
  };

  const getData = () => ({
    travelPay: {
      travelClaims: {
        isLoading: false,
        claims: {},
      },
      claimDetails: {
        isLoading: false,
        error: null,
        data: {},
      },
      appointment: {
        isLoading: false,
        error: null,
        data: null,
      },
      claimSubmission: {
        isSubmitting: false,
        error: null,
        data: null,
      },
      complexClaim: {
        claim: {
          creation: {
            isLoading: false,
            error: null,
          },
          submission: {
            id: '',
            isSubmitting: false,
            error: null,
            data: null,
          },
          fetch: {
            isLoading: false,
            error: null,
          },
          data: null,
        },
        expenses: {
          creation: {
            isLoading: false,
            error: null,
          },
          update: {
            id: '',
            isLoading: false,
            error: null,
          },
          delete: {
            id: '',
            isLoading: false,
            error: null,
          },
          data: [],
        },
      },
    },
  });

  it('should render the unsupported mileage page correctly', () => {
    const screen = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={['/unsupported']}>
        <UnsupportedMileage />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    // Check main heading
    expect(
      screen.getByRole('heading', {
        name: 'Complete and file your claim in BTSSS',
      }),
    ).to.exist;

    // Check explanatory text
    expect(
      screen.getByText(
        /Your travel was one way or you started from somewhere other than your home address. We can’t file your travel reimbursement claim here right now./i,
      ),
    ).to.exist;

    expect(
      screen.getByText(
        /Any information you’ve added here will be available in BTSSS./i,
      ),
    ).to.exist;

    // Check BTSSS link
    const btsssLink = $(
      'va-link[text="Complete and file your claim in BTSSS"]',
    );
    expect(btsssLink).to.exist;
    expect(btsssLink).to.have.attribute('href', BTSSS_PORTAL_URL);
    expect(btsssLink).to.have.attribute('external');

    // Check back button
    const backButton = $('va-button[text="Back"]');
    expect(backButton).to.exist;
    expect(backButton).to.have.attribute('back');
    expect(backButton).to.have.class('vads-u-display--flex');
    expect(backButton).to.have.class('vads-u-margin-y--2');
  });

  it('should have correct BTSSS portal URL', () => {
    renderWithStoreAndRouter(
      <MemoryRouter initialEntries={['/unsupported']}>
        <UnsupportedMileage />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    const btsssLink = $(
      'va-link[text="Complete and file your claim in BTSSS"]',
    );
    expect(btsssLink).to.have.attribute(
      'href',
      'https://dvagov-btsss.dynamics365portals.us/',
    );
  });

  it('should navigate back when back button is clicked', () => {
    const screen = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={['/previous-page', '/unsupported']}>
        <Routes>
          <Route path="/previous-page" element={<div>Previous Page</div>} />
          <Route path="/unsupported" element={<UnsupportedMileage />} />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    // Verify we're on the unsupported mileage page
    expect(screen.getByTestId('location-display').textContent).to.equal(
      '/unsupported',
    );

    // Click the back button
    const backButton = $('va-button[text="Back"]');
    expect(backButton).to.exist;
    fireEvent.click(backButton);

    // Check that we navigated back to the previous page
    expect(screen.getByTestId('location-display').textContent).to.equal(
      '/previous-page',
    );
  });
});
