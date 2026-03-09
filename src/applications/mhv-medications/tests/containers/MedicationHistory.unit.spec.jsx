import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { cleanup } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import * as useFetchMedicationHistoryModule from '../../hooks/MedicationHistory/useFetchMedicationHistory';
import * as allergiesApiModule from '../../api/allergiesApi';
import * as prescriptionsApiModule from '../../api/prescriptionsApi';
import { stubAllergiesApi } from '../testing-utils';
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
    prescriptionsData = { prescriptions: [], pagination: null, meta: {} },
    prescriptionsApiError = null,
    isLoading = false,
  }) => {
    return useFetchMedicationHistoryStub.returns({
      prescriptionsData,
      prescriptionsApiError,
      isLoading,
      setQueryParams: sinon.stub(),
    });
  };

  const setup = (state = {}) => {
    const initialState = {
      rx: {
        prescriptionsList: [],
        refillAlertList: [],
        preferences: {
          filterOption: 'ALL_MEDICATIONS',
          sortOption: 'alphabeticallyByStatus',
        },
      },
      user: {
        profile: {
          userFullName: { first: 'Test', last: 'User' },
          dob: '1990-01-01',
        },
      },
      ...state,
    };

    return renderWithStoreAndRouterV6(<MedicationHistory />, {
      initialState,
      reducers,
      additionalMiddlewares: [
        allergiesApiModule.allergiesApi.middleware,
        prescriptionsApiModule.prescriptionsApi.middleware,
      ],
    });
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    stubAllergiesApi({ sandbox });
    useFetchMedicationHistoryStub = sandbox.stub(
      useFetchMedicationHistoryModule,
      'useFetchMedicationHistory',
    );
  });

  afterEach(() => {
    cleanup();
    sandbox.restore();
  });

  it('renders without errors', async () => {
    stubFetchHook({
      prescriptionsData: {
        prescriptions: mockPrescriptions,
        pagination: null,
        meta: {},
      },
    });
    const screen = setup();
    await waitFor(() => {
      expect(screen).to.exist;
    });
  });

  it('displays the page heading', async () => {
    stubFetchHook({
      prescriptionsData: {
        prescriptions: mockPrescriptions,
        pagination: null,
        meta: {},
      },
    });
    const screen = setup();
    await waitFor(() => {
      const heading = screen.getByRole('heading', {
        name: 'Medication history',
        level: 1,
      });
      expect(heading).to.exist;
    });
  });

  it('displays the in-progress medications link', async () => {
    stubFetchHook({
      prescriptionsData: {
        prescriptions: mockPrescriptions,
        pagination: null,
        meta: {},
      },
    });
    const screen = setup();
    await waitFor(() => {
      const link = screen.getByRole('link', {
        name: /Go to your in-progress medications/i,
      });
      expect(link).to.exist;
      expect(link.getAttribute('href')).to.equal('/in-progress');
    });
  });

  it('displays the refill medications link', async () => {
    stubFetchHook({
      prescriptionsData: {
        prescriptions: mockPrescriptions,
        pagination: null,
        meta: {},
      },
    });
    const screen = setup();
    await waitFor(() => {
      const link = screen.getByRole('link', {
        name: /Refill medications/i,
      });
      expect(link).to.exist;
      expect(link.getAttribute('href')).to.equal('/refill');
    });
  });

  it('renders NeedHelp component', async () => {
    stubFetchHook({
      prescriptionsData: {
        prescriptions: mockPrescriptions,
        pagination: null,
        meta: {},
      },
    });
    const screen = setup();
    await waitFor(() => {
      expect(screen.getByText(/Need help/i)).to.exist;
    });
  });

  describe('loading state', () => {
    it('displays loading indicator when loading', async () => {
      stubFetchHook({ isLoading: true });
      const screen = setup();
      await waitFor(() => {
        const loadingIndicator = screen.getByTestId('loading-indicator');
        expect(loadingIndicator).to.exist;
      });
    });
  });

  describe('error state', () => {
    it('displays error notification when API error occurs', async () => {
      stubFetchHook({ prescriptionsApiError: { status: 500 } });
      const screen = setup();
      await waitFor(() => {
        expect(screen.getByTestId('api-error-notification')).to.exist;
      });
    });

    it('does not display loading indicator when error occurs', async () => {
      stubFetchHook({ prescriptionsApiError: { status: 500 } });
      const screen = setup();
      await waitFor(() => {
        expect(screen.queryByTestId('loading-indicator')).to.be.null;
      });
    });
  });

  describe('success state', () => {
    it('does not display loading indicator when not loading', async () => {
      stubFetchHook({
        prescriptionsData: {
          prescriptions: mockPrescriptions,
          pagination: null,
          meta: {},
        },
      });
      const screen = setup();
      await waitFor(() => {
        expect(screen.queryByTestId('loading-indicator')).to.be.null;
      });
    });

    it('does not display error notification when no error', async () => {
      stubFetchHook({
        prescriptionsData: {
          prescriptions: mockPrescriptions,
          pagination: null,
          meta: {},
        },
      });
      const screen = setup();
      await waitFor(() => {
        expect(screen.queryByTestId('api-error-notification')).to.be.null;
      });
    });

    it('renders with empty prescriptions array', async () => {
      stubFetchHook({
        prescriptionsData: { prescriptions: [], pagination: null, meta: {} },
      });
      const screen = setup();
      await waitFor(() => {
        expect(screen.getByTestId('medication-history-heading')).to.exist;
      });
    });
  });
});
