import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { cleanup } from '@testing-library/react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import * as useFetchPrescriptionsInProgressModule from '../../hooks/PrescriptionsInProgress/useFetchPrescriptionsInProgress';
import PrescriptionsInProgress from '../../containers/PrescriptionsInProgress';
import reducers from '../../reducers';

describe('PrescriptionsInProgress container', () => {
  let sandbox;
  let useFetchPrescriptionsInProgressStub;

  const mockPrescriptions = [
    {
      prescriptionId: 1,
      prescriptionName: 'Pepcid 30mg tab',
      status: 'submitted',
      lastUpdated: '2026-01-26T04:00:00.000Z',
    },
    {
      prescriptionId: 2,
      prescriptionName: 'Zoloft 25mg',
      status: 'in-progress',
      lastUpdated: '2026-01-29T04:00:00.000Z',
    },
    {
      prescriptionId: 3,
      prescriptionName: 'Benadryl 50mg',
      status: 'shipped',
      lastUpdated: '2026-01-21T04:00:00.000Z',
    },
  ];

  const stubFetchHook = ({
    prescriptions = [],
    prescriptionsApiError = null,
    isLoading = false,
  }) => {
    return useFetchPrescriptionsInProgressStub.returns({
      prescriptions,
      prescriptionsApiError,
      isLoading,
    });
  };

  const setup = () => {
    const initialState = {
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicationsManagementImprovements]: true,
      },
    };

    return renderWithStoreAndRouterV6(<PrescriptionsInProgress />, {
      initialState,
      reducers,
    });
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    useFetchPrescriptionsInProgressStub = sandbox.stub(
      useFetchPrescriptionsInProgressModule,
      'default',
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
      name: 'In-progress medications',
      level: 1,
    });
    expect(heading).to.exist;
  });

  it('displays the introductory paragraph', () => {
    stubFetchHook({ prescriptions: mockPrescriptions });
    const screen = setup();
    expect(
      screen.getByText(
        /Medications that are shipped will remain in this list for 15 days from the date of shipping/i,
      ),
    ).to.exist;
  });

  it('displays the medication history link', () => {
    stubFetchHook({ prescriptions: mockPrescriptions });
    const screen = setup();
    const link = screen.getByRole('link', {
      name: /Go to your medication history/i,
    });
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal('/');
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

    it('does not display process list while loading', () => {
      stubFetchHook({ isLoading: true });
      const screen = setup();
      expect(screen.queryByText('Request submitted')).to.be.null;
    });
  });

  describe('error state', () => {
    it('displays error notification when API error occurs', () => {
      stubFetchHook({ prescriptionsApiError: new Error('API Error') });
      const screen = setup();
      const errorNotification = screen.getByTestId('api-error-notification');
      expect(errorNotification).to.exist;
    });

    it('does not display process list when error occurs', () => {
      stubFetchHook({ prescriptionsApiError: new Error('API Error') });
      const screen = setup();
      expect(screen.queryByText('Request submitted')).to.be.null;
    });

    it('does not display loading indicator when not loading', () => {
      stubFetchHook({ prescriptionsApiError: new Error('API Error') });
      const screen = setup();
      expect(screen.queryByTestId('loading-indicator')).to.be.null;
    });
  });

  describe('success state', () => {
    it('displays the process list when prescriptions are loaded', () => {
      stubFetchHook({ prescriptions: mockPrescriptions });
      const screen = setup();
      const processListItems = screen.container.querySelectorAll(
        'va-process-list-item',
      );
      expect(processListItems.length).to.equal(3);
      expect(processListItems[0].getAttribute('header')).to.equal(
        'Request submitted',
      );
      expect(processListItems[1].getAttribute('header')).to.equal(
        'Fill in progress',
      );
      expect(processListItems[2].getAttribute('header')).to.equal(
        'Medication shipped',
      );
    });

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

    it('renders process list with empty prescriptions array', () => {
      stubFetchHook({ prescriptions: [] });
      const screen = setup();
      const processListItems = screen.container.querySelectorAll(
        'va-process-list-item',
      );
      expect(processListItems.length).to.equal(3);
      expect(processListItems[0].getAttribute('header')).to.equal(
        'Request submitted',
      );
      expect(processListItems[1].getAttribute('header')).to.equal(
        'Fill in progress',
      );
      expect(processListItems[2].getAttribute('header')).to.equal(
        'Medication shipped',
      );
    });
  });
});
