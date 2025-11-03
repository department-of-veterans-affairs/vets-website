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
import reducer from '../../../../redux/reducer';
import IntroductionPage from '../../../../components/complex-claims/pages/IntroductionPage';
import {
  BTSSS_PORTAL_URL,
  FIND_FACILITY_TP_CONTACT_LINK,
} from '../../../../constants';
import ChooseExpenseType from '../../../../components/complex-claims/pages/ChooseExpenseType';

describe('Travel Pay – IntroductionPage', () => {
  const LocationDisplay = () => {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
  };

  const getData = () => ({
    travelPay: {
      claimSubmission: { isSubmitting: false, error: null, data: null },
    },
  });

  const initialRoute = '/file-new-claim/12345/introduction';

  it('renders the IntroductionPage with correct structure', () => {
    const { getByRole, container } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={[initialRoute]}>
        <IntroductionPage />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    // Main heading
    expect(
      getByRole('heading', {
        name: /file a travel reimbursement claim/i,
      }),
    ).to.exist;

    // Process list and step headers
    expect(container.querySelectorAll('va-process-list').length).to.equal(1);
    expect(container.querySelectorAll('va-process-list-item').length).to.equal(
      3,
    );
    expect(
      $(
        'va-process-list-item[header*="Check your travel reimbursement eligibility"]',
        container,
      ),
    ).to.exist;
    expect(
      $('va-process-list-item[header*="Set up direct deposit"]', container),
    ).to.exist;
    expect($('va-process-list-item[header*="File your claim"]', container)).to
      .exist;
  });

  it('renders all important VA links with expected hrefs', () => {
    const { container } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={[initialRoute]}>
        <IntroductionPage />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    expect(
      $(
        'va-link[href="/health-care/get-reimbursed-for-travel-pay/#eligibility-for-general-health"]',
        container,
      ),
    ).to.exist;

    expect(
      $(
        'va-link[href="/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/"]',
        container,
      ),
    ).to.exist;

    expect($(`va-link[href="${BTSSS_PORTAL_URL}"]`, container)).to.exist;
    expect($(`va-link[href="${FIND_FACILITY_TP_CONTACT_LINK}"]`, container)).to
      .exist;
  });

  it('navigates to choose-expense when Start your travel reimbursement claim is clicked', () => {
    const mockAppointment = {
      id: '12345',
      appointmentSource: 'API',
      appointmentDateTime: '2025-10-17T21:32:16.531Z',
      appointmentName: 'string',
      appointmentType: 'EnvironmentalHealth',
      facilityId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      facilityName: 'Cheyenne VA Medical Center',
      serviceConnectedDisability: 0,
      currentStatus: 'Pending',
      appointmentStatus: 'Complete',
      externalAppointmentId: '12345',
      associatedClaimId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      associatedClaimNumber: '',
      isCompleted: true,
    };
    const { container, getByTestId } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route
            path="/file-new-claim/:apptId/introduction"
            element={<IntroductionPage appointment={mockAppointment} />}
          />
          <Route
            path="/file-new-claim/:apptId/:claimId/choose-expense"
            element={<ChooseExpenseType />}
          />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    const linkAction = container.querySelector('va-link-action');
    fireEvent.click(linkAction);

    expect(getByTestId('location-display').textContent).to.equal(
      '/file-new-claim/12345/45678/choose-expense',
    );
  });

  it('renders OMB info', () => {
    const { container } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={[initialRoute]}>
        <IntroductionPage />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    expect($('va-omb-info[exp-date="11/30/2027"]'), container).to.exist;
    expect($('va-omb-info[omb-number="2900-0798"]'), container).to.exist;
    expect($('va-omb-info[res-burden="15"]'), container).to.exist;
  });

  it('renders the Need help section with contact info', () => {
    const { container, getByText } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={[initialRoute]}>
        <IntroductionPage />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    expect(getByText('Need help?')).to.exist;
    expect(getByText(/BTSSS call center/i)).to.exist;
    expect($('va-telephone[contact="8555747292"]', container)).to.exist;
    expect($('va-telephone[tty][contact="711"]', container)).to.exist;
  });

  it('renders correctly even if appointment prop is missing', () => {
    const { getByTestId } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={[initialRoute]}>
        <IntroductionPage />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    expect(getByTestId('introduction-page')).to.exist;
  });
});
