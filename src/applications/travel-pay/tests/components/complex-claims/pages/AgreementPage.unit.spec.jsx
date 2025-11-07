import React from 'react';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { render } from '@testing-library/react';
import {
  MemoryRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom-v5-compat';
import AgreementPage from '../../../../components/complex-claims/pages/AgreementPage';
import reducer from '../../../../redux/reducer';

describe('Travel Pay – AgreementPage', () => {
  const apptId = '12345';
  const claimId = '45678';

  const LocationDisplay = () => {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
  };

  const getData = () => ({
    travelPay: {
      claimSubmission: { isSubmitting: false, error: null, data: null },
    },
  });

  it('should render the agreement page correctly', () => {
    const screen = renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[
          `/file-new-claim/${apptId}/${claimId}/travel-agreement`,
        ]}
      >
        <AgreementPage />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    expect(
      screen.getByRole('heading', { name: /beneficiary travel agreement/i }),
    ).to.exist;

    expect(screen.getByText(/Penalty statement:/i)).to.exist;
    expect(screen.getByText(/severe criminal and civil penalties/i)).to.exist;
    expect(screen.getByTestId('travel-agreement-content')).to.exist;

    const checkbox = $('va-checkbox[name="accept-agreement"]');
    expect(checkbox).to.exist;
    expect(checkbox).to.have.attribute('checked', 'false');
    expect(checkbox).to.not.have.attribute('error');

    const buttonPair = screen.baseElement.querySelector('va-button-pair');
    expect(buttonPair.getAttribute('left-button-text')).to.contain('Back');
    expect(buttonPair.getAttribute('right-button-text')).to.contain(
      'Submit claim',
    );
  });

  it('should show an error when submitting without checking the box', () => {
    renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[
          `/file-new-claim/${apptId}/${claimId}/travel-agreement`,
        ]}
      >
        <AgreementPage />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    const checkbox = $('va-checkbox[name="accept-agreement"]');
    expect(checkbox).to.have.attribute('checked', 'false');

    // Simulate clicking Submit
    $('va-button-pair').__events.primaryClick();

    const errorCheckbox = $('va-checkbox[name="accept-agreement"]');
    expect(errorCheckbox).to.have.attribute(
      'error',
      'You must accept the beneficiary travel agreement before continuing.',
    );
  });

  it('should clear error when checkbox is checked and submit is clicked and navigate to confirmation page', () => {
    const screen = render(
      <MemoryRouter
        initialEntries={[
          `/file-new-claim/${apptId}/${claimId}/travel-agreement`,
        ]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/travel-agreement"
            element={<AgreementPage />}
          />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    const checkbox = $('va-checkbox[name="accept-agreement"]');
    checkbox.__events.vaChange(); // simulate user checking box

    expect(checkbox).to.have.attribute('checked', 'true');

    $('va-button-pair').__events.primaryClick();

    // Check that the location updated
    expect(screen.getByTestId('location-display').textContent).to.equal(
      `/file-new-claim/${apptId}/${claimId}/confirmation`,
    );
  });

  it('should toggle the checkbox on multiple clicks', () => {
    renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[
          `/file-new-claim/${apptId}/${claimId}/travel-agreement`,
        ]}
      >
        <AgreementPage />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    const checkbox = $('va-checkbox[name="accept-agreement"]');
    expect(checkbox).to.have.attribute('checked', 'false');

    checkbox.__events.vaChange();
    expect(checkbox).to.have.attribute('checked', 'true');

    checkbox.__events.vaChange();
    expect(checkbox).to.have.attribute('checked', 'false');
  });

  it('navigates to the review page when back button is clicked', () => {
    const screen = render(
      <MemoryRouter
        initialEntries={[
          `/file-new-claim/${apptId}/${claimId}/travel-agreement`,
        ]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/travel-agreement"
            element={<AgreementPage />}
          />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    // Click the back button
    const buttonPair = screen.baseElement.querySelector('va-button-pair');
    buttonPair.__events.secondaryClick();

    // Check that the location updated
    expect(screen.getByTestId('location-display').textContent).to.equal(
      `/file-new-claim/${apptId}/${claimId}/review`,
    );
  });
});
