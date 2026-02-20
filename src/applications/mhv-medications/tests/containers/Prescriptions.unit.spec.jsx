import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { datadogRum } from '@datadog/browser-rum';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { cleanup } from '@testing-library/react';
import { fireEvent, waitFor } from '@testing-library/dom';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import reducer from '../../reducers';
import * as allergiesApiModule from '../../api/allergiesApi';
import * as prescriptionsApiModule from '../../api/prescriptionsApi';
import { stubAllergiesApi, stubPrescriptionsListApi } from '../testing-utils';
import Prescriptions from '../../containers/Prescriptions';
import emptyPrescriptionsList from '../e2e/fixtures/empty-prescriptions-list.json';
import { MEDS_BY_MAIL_FACILITY_ID } from '../../util/constants';

let sandbox;

const refillAlertList = [
  {
    prescriptionId: 123456,
    prescriptionName: 'Test name 1',
  },
  {
    prescriptionId: 234567,
    prescriptionName: 'Test name 2',
  },
];

describe('Medications Prescriptions container', () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    stubAllergiesApi({ sandbox });
    stubPrescriptionsListApi({ sandbox });
  });

  afterEach(() => {
    cleanup();
    if (sandbox) {
      sandbox.restore();
    }
    sandbox = null;
  });

  const initialState = {
    rx: {
      prescriptionsList: [],
      refillAlertList: [],
      preferences: {
        filterOption: 'ALL_MEDICATIONS',
        sortOption: 'alphabeticallyByStatus',
      },
    },
  };

  const setup = (
    state = initialState,
    url = '/',
    isCernerPilot = false,
    isV2StatusMapping = false,
  ) => {
    const fullState = {
      ...state,
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: isCernerPilot,
        [FEATURE_FLAG_NAMES.mhvMedicationsV2StatusMapping]: isV2StatusMapping,
        ...state.featureToggles,
      },
    };

    return renderWithStoreAndRouterV6(<Prescriptions />, {
      initialState: fullState,
      reducers: reducer,
      initialEntries: [url],
      additionalMiddlewares: [
        allergiesApiModule.allergiesApi.middleware,
        prescriptionsApiModule.prescriptionsApi.middleware,
      ],
    });
  };

  it('renders without errors', async () => {
    const screen = setup();
    expect(screen);
  });

  it('should display loading message when loading prescriptions', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox, isLoading: true, isFetching: true });
    stubPrescriptionsListApi({
      sandbox,
      isLoading: true,
      isFetching: true,
      data: undefined,
    });
    const screen = setup();
    await waitFor(() => {
      const indicator = screen.getByTestId('loading-indicator');
      expect(indicator).to.exist;
      expect(indicator.getAttribute('message')).to.equal(
        'Loading your medications...',
      );
    });
  });

  it('displays intro text ', async () => {
    const screen = setup();
    await screen.getByTestId('Title-Notes');
  });

  it('shows title ', async () => {
    const screen = setup();
    expect(await screen.findByTestId('list-page-title')).to.exist;
  });

  it('should display delayed refill alert when showRefillProgressContent flag is true and refillAlertList has items', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox });
    stubPrescriptionsListApi({
      sandbox,
      data: {
        prescriptions: emptyPrescriptionsList.data,
        meta: emptyPrescriptionsList.meta,
        pagination: emptyPrescriptionsList.meta.pagination,
        refillAlertList,
      },
    });

    const screen = setup({
      ...initialState,
      rx: {
        ...initialState.rx,
      },
    });

    expect(await screen.findByTestId('mhv-rx--delayed-refill-alert')).to.exist;
    expect(await screen.findByTestId('rxDelay-alert-message')).to.exist;
  });

  it('should not display delayed refill alert when refillAlertList is empty', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox });
    stubPrescriptionsListApi({
      sandbox,
      data: {
        prescriptions: emptyPrescriptionsList.data,
        meta: emptyPrescriptionsList.meta,
        pagination: emptyPrescriptionsList.meta.pagination,
        refillAlertList: [],
      },
    });

    const screen = setup({
      ...initialState,
      rx: {
        ...initialState.rx,
      },
    });

    await waitFor(() => {
      expect(screen.queryByTestId('mhv-rx--delayed-refill-alert')).not.to.exist;
      expect(screen.queryByTestId('rxDelay-alert-message')).not.to.exist;
    });
  });

  it('displays empty list alert', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox });
    stubPrescriptionsListApi({
      sandbox,
      data: {
        prescriptions: emptyPrescriptionsList.data,
        meta: emptyPrescriptionsList.meta,
        pagination: emptyPrescriptionsList.meta.pagination,
      },
    });
    const screen = setup();
    expect(
      screen.getByText(
        'You don’t have any VA prescriptions or medication records',
      ),
    ).to.exist;
  });

  it('should display a clickable download button', async () => {
    const screen = setup();
    const pdfButton = screen.getByTestId('download-pdf-button');
    await waitFor(() => {
      fireEvent.click(pdfButton);
    });
    expect(screen);
  });

  it('should show the allergy error alert when downloading PDF', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox, error: true });
    stubPrescriptionsListApi({ sandbox });
    const screen = setup();
    const pdfButton = screen.getByTestId('download-pdf-button');
    await waitFor(() => {
      fireEvent.click(pdfButton);
    });
    expect(screen);
    await waitFor(() => {
      expect(screen.getByText('We can’t download your records right now')).to
        .exist;
    });
  });

  it('should show the allergy error alert when printing', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox, error: true });
    stubPrescriptionsListApi({ sandbox });
    const screen = setup();
    const pdfButton = screen.getByTestId('download-print-button');

    await waitFor(() => {
      fireEvent.click(pdfButton);
    });
    expect(screen);
    await waitFor(() => {
      expect(screen.getByText('We can’t print your records right now')).to
        .exist;
    });
  });

  it('should show the allergy error alert when downloading txt', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox, error: true });
    stubPrescriptionsListApi({ sandbox });
    const screen = setup();
    const pdfButton = screen.getByTestId('download-txt-button');
    await waitFor(() => {
      fireEvent.click(pdfButton);
    });
    expect(screen);
    await waitFor(() => {
      expect(screen.getByText('We can’t download your records right now')).to
        .exist;
    });
  });

  it('displays text inside refill box "find a list of prescriptions you can refill online."', async () => {
    const screen = setup(initialState);
    expect(
      screen.findByText('find a list of prescriptions you can refill online..'),
    );
  });

  it('Simulates print button click', async () => {
    if (!window.print) {
      window.print = () => {};
    }
    const printStub = sinon.stub(window, 'print');
    const screen = setup();
    const button = await screen.findByTestId('download-print-button');
    expect(button).to.exist;
    expect(button).to.have.text('Print');
    fireEvent.click(button);
    await waitFor(() => {
      fireEvent.click(button);
    });
    printStub.restore();
  });

  it('displays link for allergies if mhv_medications_display_allergies feature flag is set to true', async () => {
    const screen = setup({
      ...initialState,
    });
    expect(screen.getByText('Go to your allergies and reactions')).to.exist;
  });

  it('displays filter accordion', async () => {
    const screen = setup();
    expect(await screen.getByTestId('filter-accordion')).to.exist;
  });

  it('displays Meds by Mail content for Meds by Mail users', async () => {
    const screen = setup({
      ...initialState,
      user: {
        profile: {
          userFullName: { first: 'test', last: 'last', suffix: 'jr' },
          dob: '2000-01-01',
          facilities: [{ facilityId: MEDS_BY_MAIL_FACILITY_ID }],
        },
      },
    });

    expect(
      screen.queryByText(
        /If you use Meds by Mail, you can also call your servicing center and ask them to update your records\./,
        {
          selector: 'p',
        },
      ),
    ).not.to.exist;

    expect(screen.getByTestId('meds-by-mail-header')).to.exist;
    expect(screen.getByTestId('meds-by-mail-top-level-text')).to.exist;
    expect(screen.getByTestId('meds-by-mail-additional-info')).to.exist;
  });

  it('does not display Meds by Mail content for non-Meds by Mail users', async () => {
    const screen = setup();

    expect(
      screen.getByText(
        /If you use Meds by Mail, you can also call your servicing center and ask them to update your records\./,
        {
          selector: 'p',
        },
      ),
    ).to.exist;

    expect(screen.queryByTestId('meds-by-mail-header')).not.to.exist;
    expect(screen.queryByTestId('meds-by-mail-top-level-text')).not.to.exist;
    expect(screen.queryByTestId('meds-by-mail-additional-info')).not.to.exist;
  });

  describe('renderRxRenewalMessageSuccess', () => {
    it('should render component with deleteDraftSuccess query param', async () => {
      const screen = setup(initialState, '?page=1&draftDeleteSuccess=true');
      await waitFor(() => {
        expect(screen.getByTestId('rx-renewal-delete-draft-success-alert')).to
          .exist;
      });
    });

    it('should render component with rxRenewalMessageSuccess query param', async () => {
      const screen = setup(
        initialState,
        '?page=1&rxRenewalMessageSuccess=true',
      );
      await waitFor(() => {
        expect(screen.getByTestId('rx-renewal-message-success-alert')).to.exist;
      });
    });
  });

  describe('SHIPPED filter functionality', () => {
    const FLAG_COMBINATIONS = [
      {
        isCernerPilot: false,
        isV2StatusMapping: false,
        desc: 'both flags disabled',
      },
      {
        isCernerPilot: true,
        isV2StatusMapping: false,
        desc: 'only cernerPilot enabled',
      },
      {
        isCernerPilot: false,
        isV2StatusMapping: true,
        desc: 'only v2StatusMapping enabled',
      },
      {
        isCernerPilot: true,
        isV2StatusMapping: true,
        desc: 'both flags enabled',
      },
    ];

    FLAG_COMBINATIONS.forEach(({ isCernerPilot, isV2StatusMapping, desc }) => {
      it(`should render without error when ${desc}`, async () => {
        const screen = setup(
          initialState,
          '/',
          isCernerPilot,
          isV2StatusMapping,
        );

        await waitFor(() => {
          expect(screen.queryByTestId('loading-indicator')).not.to.exist;
        });

        expect(screen.getByTestId('list-page-title')).to.exist;
      });
    });

    it('should render without error when SHIPPED filter is applied with BOTH CernerPilot and V2StatusMapping flags disabled', async () => {
      const stateWithShippedFilter = {
        ...initialState,
        rx: {
          ...initialState.rx,
          preferences: {
            ...initialState.rx.preferences,
            filterOption: 'SHIPPED',
          },
        },
      };

      const screen = setup(stateWithShippedFilter, '/', false, false);

      await waitFor(() => {
        expect(screen.queryByTestId('loading-indicator')).not.to.exist;
      });

      expect(screen.getByTestId('list-page-title')).to.exist;
    });

    it('should properly apply frontend filtering when SHIPPED filter is selected with BOTH CernerPilot and V2StatusMapping flags enabled', async () => {
      const stateWithShippedFilter = {
        ...initialState,
        rx: {
          ...initialState.rx,
          preferences: {
            ...initialState.rx.preferences,
            filterOption: 'SHIPPED',
          },
        },
      };

      const screen = setup(stateWithShippedFilter, '/', true, true);

      await waitFor(() => {
        expect(screen.queryByTestId('loading-indicator')).not.to.exist;
      });

      expect(screen.getByTestId('list-page-title')).to.exist;
      expect(screen.getByTestId('med-list')).to.exist;
    });
  });

  describe('Rx Renewal Message Success Analytics', () => {
    beforeEach(() => {
      global.window.dataLayer = [];
    });

    afterEach(() => {
      global.window.dataLayer = [];
    });

    it.skip('should call recordEvent when rxRenewalMessageSuccess query param is present', async () => {
      const addActionSpy = sinon.spy(datadogRum, 'addAction');
      setup(initialState, '/?rxRenewalMessageSuccess=true');

      await waitFor(() => {
        const event = global.window.dataLayer?.find(
          e => e['api-name'] === 'Rx SM Renewal',
        );
        expect(event).to.exist;
        expect(event).to.deep.include({
          event: 'api_call',
          'api-name': 'Rx SM Renewal',
          'api-status': 'successful',
        });
      });

      // Check that datadogRum.addAction was called
      await waitFor(() => {
        expect(addActionSpy.called).to.be.true;
      });
      expect(addActionSpy.calledWith('Rx Renewal Success')).to.be.true;

      addActionSpy.restore();
    });

    it('should not call recordEvent when rxRenewalMessageSuccess query param is not present', async () => {
      const screen = setup(initialState, '/');

      // Wait for component to render
      await waitFor(() => {
        expect(screen.getByTestId('list-page-title')).to.exist;
      });

      // Check that the event was NOT recorded
      const event = global.window.dataLayer?.find(
        e => e['api-name'] === 'Rx SM Renewal',
      );
      expect(event).to.be.undefined;
    });
  });

  describe('Medications Print Fallback', () => {
    it('should pass current medications list to print component when printedList is empty', async () => {
      const screen = setup();

      await waitFor(() => {
        expect(screen.getByTestId('list-page-title')).to.exist;
      });

      expect(screen).to.exist;
    });
  });
});
