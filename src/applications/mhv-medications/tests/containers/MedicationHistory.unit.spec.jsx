import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { cleanup } from '@testing-library/react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import * as useFetchMedicationHistoryModule from '../../hooks/MedicationHistory/useFetchMedicationHistory';
import MedicationHistory from '../../containers/MedicationHistory';
import reducers from '../../reducers';

describe('MedicationHistory container', () => {
  let sandbox;
  let useFetchMedicationHistoryStub;

  const mockPrescriptions = [
    {
      prescriptionId: 1,
      prescriptionName: 'ACETAMINOPHEN 325MG TAB',
      refillStatus: 'active',
      refillRemaining: 3,
      facilityName: 'VA Medical Center',
      lastFilledDate: '2025-12-01',
      expirationDate: '2026-12-01',
      prescriptionNumber: 'RX12345678',
      sig: 'Take 1 tablet by mouth twice daily',
      quantity: 60,
      isRefillable: true,
    },
    {
      prescriptionId: 2,
      prescriptionName: 'LISINOPRIL 10MG TAB',
      refillStatus: 'active',
      refillRemaining: 5,
      facilityName: 'VA Medical Center',
      lastFilledDate: '2025-11-15',
      expirationDate: '2026-11-15',
      prescriptionNumber: 'RX12345679',
      sig: 'Take 1 tablet by mouth once daily',
      quantity: 30,
      isRefillable: true,
    },
    {
      prescriptionId: 3,
      prescriptionName: 'METFORMIN 500MG TAB',
      refillStatus: 'expired',
      refillRemaining: 0,
      facilityName: 'VA Outpatient Clinic',
      lastFilledDate: '2025-01-10',
      expirationDate: '2025-07-10',
      prescriptionNumber: 'RX12345680',
      sig: 'Take 1 tablet by mouth twice daily with meals',
      quantity: 60,
      isRefillable: false,
    },
  ];

  const stubFetchHook = ({
    prescriptions = [],
    prescriptionsApiError = null,
    isLoading = false,
  }) => {
    return useFetchMedicationHistoryStub.returns({
      prescriptions,
      prescriptionsApiError,
      isLoading,
    });
  };

  const setup = () => {
    const initialState = {};

    return renderWithStoreAndRouterV6(<MedicationHistory />, {
      initialState,
      reducers,
    });
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    useFetchMedicationHistoryStub = sandbox.stub(
      useFetchMedicationHistoryModule,
      'useFetchMedicationHistory',
    );
  });

  afterEach(() => {
    cleanup();
    sandbox.restore();
  });

  it('renders without errors', () => {
    stubFetchHook({ prescriptions: mockPrescriptions });
    const screen = setup();
    expect(screen).to.exist;
  });

  it('displays the page heading', () => {
    stubFetchHook({ prescriptions: mockPrescriptions });
    const screen = setup();
    const heading = screen.getByRole('heading', {
      name: 'Medication history',
      level: 1,
    });
    expect(heading).to.exist;
  });

  it('displays the in-progress medications link', () => {
    stubFetchHook({ prescriptions: mockPrescriptions });
    const screen = setup();
    const link = screen.getByRole('link', {
      name: /Go to your in-prgroess medications/i,
    });
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal('/in-progress');
  });

  it('displays the refill medications link', () => {
    stubFetchHook({ prescriptions: mockPrescriptions });
    const screen = setup();
    const link = screen.getByRole('link', {
      name: /Refill medications/i,
    });
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal('/refill');
  });

  it('renders NeedHelp component', () => {
    stubFetchHook({ prescriptions: mockPrescriptions });
    const screen = setup();
    expect(screen.getByText(/Need help/i)).to.exist;
  });

  describe('loading state', () => {
    it('displays loading indicator when loading', () => {
      stubFetchHook({ isLoading: true });
      const screen = setup();
      const loadingIndicator = screen.getByTestId('loading-indicator');
      expect(loadingIndicator).to.exist;
      expect(loadingIndicator.getAttribute('message')).to.equal(
        'Loading medications...',
      );
    });
  });

  describe('error state', () => {
    it('displays error notification when API error occurs', () => {
      stubFetchHook({ prescriptionsApiError: new Error('API Error') });
      const screen = setup();
      const errorNotification = screen.getByTestId('api-error-notification');
      expect(errorNotification).to.exist;
    });

    it('does not display loading indicator when error occurs', () => {
      stubFetchHook({ prescriptionsApiError: new Error('API Error') });
      const screen = setup();
      expect(screen.queryByTestId('loading-indicator')).to.be.null;
    });
  });

  describe('success state', () => {
    it('does not display loading indicator when not loading', () => {
      stubFetchHook({ prescriptions: mockPrescriptions });
      const screen = setup();
      expect(screen.queryByTestId('loading-indicator')).to.be.null;
    });

    it('does not display error notification when no error', () => {
      stubFetchHook({ prescriptions: mockPrescriptions });
      const screen = setup();
      expect(screen.queryByTestId('api-error-notification')).to.be.null;
    });

    it('renders with empty prescriptions array', () => {
      stubFetchHook({ prescriptions: [] });
      const screen = setup();
      expect(screen.getByTestId('medication-history-heading')).to.exist;
    });
  });
});
