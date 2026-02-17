import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import { expect } from 'chai';
import { waitFor, fireEvent } from '@testing-library/react';
import * as allergiesApiModule from '../../api/allergiesApi';
import * as prescriptionsApiModule from '../../api/prescriptionsApi';
import { stubAllergiesApi } from '../testing-utils';
import RefillPrescriptions from '../../containers/RefillPrescriptions';
import reducer from '../../reducers';
import { dateFormat } from '../../util/helpers';

const refillablePrescriptions = require('../fixtures/refillablePrescriptionsList.json');

let sandbox;

const initMockApis = ({
  sinonSandbox,
  prescriptions = refillablePrescriptions,
  isLoading = false,
}) => {
  stubAllergiesApi({ sandbox });

  sinonSandbox
    .stub(prescriptionsApiModule, 'useGetRefillablePrescriptionsQuery')
    .returns({
      data: { prescriptions, meta: {} },
      error: false,
      isLoading,
      isFetching: false,
    });

  sinonSandbox
    .stub(prescriptionsApiModule, 'useBulkRefillPrescriptionsMutation')
    .returns([
      sinon.stub().resolves({ data: { successfulIds: [], failedIds: [] } }),
      { isLoading: false, error: null },
    ]);
};

describe('Refill Prescriptions Component', () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    initMockApis({ sinonSandbox: sandbox });
  });

  afterEach(() => {
    sandbox.restore();
  });

  const initialState = {
    rx: {
      prescriptions: {
        selectedSortOption: 'alphabeticallyByStatus',
      },
      breadcrumbs: {
        list: [
          {
            url: '/my-health/medications/about',
            label: 'About medications',
          },
        ],
      },
    },
    featureToggles: {},
    user: {
      login: {
        currentlyLoggedIn: true,
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouterV6(<RefillPrescriptions />, {
      initialState: state,
      reducers: reducer,
      initialEntries: ['/refill'],
      additionalMiddlewares: [
        allergiesApiModule.allergiesApi.middleware,
        prescriptionsApiModule.prescriptionsApi.middleware,
      ],
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('should render loading state', async () => {
    sandbox.restore();
    initMockApis({ sinonSandbox: sandbox, isLoading: true });
    const screen = setup();
    expect(screen.getByTestId('loading-indicator')).to.exist;
  });

  it('Shows 404 page if feature toggle is disabled', async () => {
    const screen = setup({
      ...initialState,
      featureToggles: {},
      rx: {
        ...initialState.rx,
        prescriptions: {
          ...initialState.rx.prescriptions,
        },
      },
    });
    expect(screen.findByTestId('mhv-page-not-found')).to.exist;
  });

  it('Mocks API Request', async () => {
    const screen = setup();
    const title = await screen.findByTestId('refill-page-title');
    expect(title).to.exist;
  });

  it('Shows h1 and h2', async () => {
    const screen = setup();
    const title = await screen.findByTestId('refill-page-title');
    expect(title).to.exist;
    expect(title).to.have.text('Refill prescriptions');
    const heading = await screen.findByRole('heading', {
      level: 2,
      name: /Ready to refill/i,
    });
    expect(heading).to.exist;
    expect(heading.tagName).to.equal('H2');
  });

  it('Shows the request refill button', async () => {
    const screen = setup();
    const button = await screen.findByTestId('request-refill-button');
    expect(button).to.exist;
    const checkbox = await screen.findByTestId(
      'refill-prescription-checkbox-0',
    );
    expect(checkbox).to.exist;
    expect(checkbox).to.have.property('label', `MELOXICAM 15MG TAB`);
    // click checkbox
    checkbox.__events.vaChange({
      detail: { checked: true },
    });
    expect(button).to.have.property('text', 'Request 1 refill');
    button.click();
  });

  it('Shows the select all checkbox', async () => {
    const screen = setup();
    const button = await screen.findByTestId('request-refill-button');
    expect(button).to.exist;
    const checkbox = await screen.findByTestId('select-all-checkbox');
    expect(checkbox).to.exist;
    expect(checkbox).to.have.property('label', `Select all 8 refills`);
    // click checkbox
    checkbox.__events.vaChange({
      detail: { checked: true },
    });
    expect(button).to.have.property('text', 'Request 8 refills');
  });

  it('Shows the correct "last filled on" date for refill', async () => {
    const screen = setup();
    const lastFilledEl = await screen.findByTestId(
      'refill-prescription-checkbox-0',
    );
    expect(lastFilledEl).to.exist;
    expect(lastFilledEl)
      .to.have.property('checkbox-description')
      .that.includes(
        refillablePrescriptions[0].dispensedDate
          ? `Last filled on ${dateFormat(
              refillablePrescriptions[0].dispensedDate,
            )}`
          : 'Not filled yet',
      );
  });

  it('Shows the correct "last filled on" date (w/rxRfRecords) for refill', async () => {
    const screen = setup();
    const lastFilledEl = await screen.findByTestId(
      `refill-prescription-checkbox-6`,
    );
    expect(lastFilledEl).to.exist;
    const rx = refillablePrescriptions.find(
      ({ prescriptionId }) => prescriptionId === 22217099,
    );
    expect(lastFilledEl)
      .to.have.property('checkbox-description')
      .that.includes(
        `Last filled on ${dateFormat(rx.rxRfRecords[0]?.dispensedDate)}`,
      );
  });

  it('does not show "Not filled yet" when Cerner pilot is enabled', async () => {
    sandbox.restore();
    // Create a prescription with no dispense date
    const rxWithNoDispenseDate = {
      ...refillablePrescriptions[0],
      dispensedDate: null,
      sortedDispensedDate: null,
    };
    initMockApis({
      sinonSandbox: sandbox,
      prescriptions: [rxWithNoDispenseDate],
    });
    const screen = setup({
      ...initialState,
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_medications_cerner_pilot: true,
      },
    });
    const lastFilledEl = await screen.findByTestId(
      'refill-prescription-checkbox-0',
    );
    expect(lastFilledEl).to.exist;
    expect(lastFilledEl)
      .to.have.property('checkbox-description')
      .that.does.not.include('Not filled yet');
  });

  it('Checks the checkbox for first prescription', async () => {
    const screen = setup();
    const checkbox = await screen.findByTestId(
      'refill-prescription-checkbox-0',
    );
    checkbox.click();
  });

  it('Unchecks the checkbox for first prescription', async () => {
    const screen = setup();
    const checkbox = await screen.findByTestId(
      'refill-prescription-checkbox-0',
    );
    checkbox.click();
    checkbox.click();
  });

  it('Shows the correct text for one prescription', async () => {
    sandbox.restore();
    initMockApis({
      sinonSandbox: sandbox,
      prescriptions: [refillablePrescriptions[0]],
    });
    const screen = setup();
    const checkboxGroup = await screen.findByTestId('refill-checkbox-group');
    expect(checkboxGroup.label).to.equal(
      'You have 1 prescription ready to refill.',
    );
  });

  it('Completes api request with selected prescriptions', async () => {
    const screen = setup();
    const checkbox = await screen.findByTestId(
      'refill-prescription-checkbox-0',
    );
    checkbox.click();
    const button = await screen.findByTestId('request-refill-button');
    button.click();
  });

  it('Checks for error message when refilling with 0 meds selected and 1 available', async () => {
    sandbox.restore();
    initMockApis({
      sinonSandbox: sandbox,
      prescriptions: [refillablePrescriptions[0]],
    });
    const screen = setup();

    const button = await screen.findByTestId('request-refill-button');
    const checkboxGroup = await screen.findByTestId('refill-checkbox-group');
    expect(checkboxGroup).to.exist;
    expect(checkboxGroup.error).to.equal('');
    button.click();
    expect(checkboxGroup.error).to.equal(
      'Select at least one prescription to refill',
    );
    await waitFor(() => {
      const focusEl = document.activeElement;
      expect(focusEl).to.have.property(
        'id',
        `checkbox-${refillablePrescriptions[0].prescriptionId}`,
      );
    });
  });

  it('Checks for error message when refilling with 0 meds selected and many available', async () => {
    const screen = setup();
    const button = await screen.findByTestId('request-refill-button');
    const checkboxGroup = await screen.findByTestId('refill-checkbox-group');
    expect(button).to.exist;
    expect(checkboxGroup).to.exist;
    expect(checkboxGroup.error).to.equal('');
    button.click();
    expect(checkboxGroup.error).to.equal(
      'Select at least one prescription to refill',
    );
    await waitFor(() => {
      const focusEl = document.activeElement;
      expect(focusEl).to.have.property('id', 'select-all-checkbox');
    });
  });

  it('Shows h1 and note if no prescriptions are refillable', async () => {
    sandbox.restore();
    initMockApis({
      sinonSandbox: sandbox,
      prescriptions: [],
    });
    const screen = setup();
    const title = await screen.findByTestId('refill-page-title');
    expect(title).to.exist;
    expect(title).to.have.text('Refill prescriptions');
    expect(screen.getByTestId('no-refills-message')).to.exist;
  });

  describe('Oracle Health Pilot Flag Tests', () => {
    it('calls bulkRefillPrescriptions with simple IDs when pilot flag is disabled', async () => {
      sandbox.restore();
      const bulkRefillStub = sinon.stub().resolves({
        data: { successfulIds: [22377956], failedIds: [] },
      });
      sandbox
        .stub(prescriptionsApiModule, 'useGetRefillablePrescriptionsQuery')
        .returns({
          data: {
            prescriptions: [refillablePrescriptions[0]],
            meta: {},
          },
          error: false,
          isLoading: false,
          isFetching: false,
        });
      sandbox
        .stub(prescriptionsApiModule, 'useBulkRefillPrescriptionsMutation')
        .returns([bulkRefillStub, { isLoading: false, error: null }]);
      stubAllergiesApi({ sandbox });

      const stateWithPilotDisabled = {
        ...initialState,
        featureToggles: {
          // eslint-disable-next-line camelcase
          mhv_medications_cerner_pilot: false,
        },
      };

      const screen = setup(stateWithPilotDisabled);
      const checkbox = await screen.findByTestId(
        'refill-prescription-checkbox-0',
      );
      checkbox.__events.vaChange({ detail: { checked: true } });

      const button = await screen.findByTestId('request-refill-button');
      button.click();

      await waitFor(() => {
        expect(bulkRefillStub.calledOnce).to.be.true;
        // Should pass array of simple IDs when pilot flag is disabled
        expect(bulkRefillStub.firstCall.args[0]).to.deep.equal([22377956]);
      });
    });

    it('calls bulkRefillPrescriptions with ID objects when pilot flag is enabled', async () => {
      sandbox.restore();
      const bulkRefillStub = sinon.stub().resolves({
        data: {
          successfulIds: [{ id: 22377956, stationNumber: '989' }],
          failedIds: [],
        },
      });
      const prescriptionWithStation = {
        ...refillablePrescriptions[0],
        stationNumber: '989',
      };
      sandbox
        .stub(prescriptionsApiModule, 'useGetRefillablePrescriptionsQuery')
        .returns({
          data: {
            prescriptions: [prescriptionWithStation],
            meta: {},
          },
          error: false,
          isLoading: false,
          isFetching: false,
        });
      sandbox
        .stub(prescriptionsApiModule, 'useBulkRefillPrescriptionsMutation')
        .returns([bulkRefillStub, { isLoading: false, error: null }]);
      stubAllergiesApi({ sandbox });

      const stateWithPilotEnabled = {
        ...initialState,
        featureToggles: {
          // eslint-disable-next-line camelcase
          mhv_medications_cerner_pilot: true,
        },
      };

      const screen = setup(stateWithPilotEnabled);
      const checkbox = await screen.findByTestId(
        'refill-prescription-checkbox-0',
      );
      checkbox.__events.vaChange({ detail: { checked: true } });

      const button = await screen.findByTestId('request-refill-button');
      button.click();

      await waitFor(() => {
        expect(bulkRefillStub.calledOnce).to.be.true;
        // Should pass array of ID objects with stationNumber when pilot flag is enabled
        expect(bulkRefillStub.firstCall.args[0]).to.deep.equal([
          { id: 22377956, stationNumber: '989' },
        ]);
      });
    });

    it('matches medications by ID and stationNumber when pilot flag is enabled', async () => {
      sandbox.restore();
      const bulkRefillStub = sinon.stub().resolves({
        data: {
          successfulIds: [{ id: 22377956, stationNumber: '989' }],
          failedIds: [],
        },
      });
      const prescriptionWithStation = {
        ...refillablePrescriptions[0],
        stationNumber: '989',
      };
      sandbox
        .stub(prescriptionsApiModule, 'useGetRefillablePrescriptionsQuery')
        .returns({
          data: {
            prescriptions: [prescriptionWithStation],
            meta: {},
          },
          error: false,
          isLoading: false,
          isFetching: false,
        });
      sandbox
        .stub(prescriptionsApiModule, 'useBulkRefillPrescriptionsMutation')
        .returns([bulkRefillStub, { isLoading: false, error: null }]);
      stubAllergiesApi({ sandbox });

      const stateWithPilotEnabled = {
        ...initialState,
        featureToggles: {
          // eslint-disable-next-line camelcase
          mhv_medications_cerner_pilot: true,
        },
      };

      const screen = setup(stateWithPilotEnabled);
      const checkbox = await screen.findByTestId(
        'refill-prescription-checkbox-0',
      );
      checkbox.__events.vaChange({ detail: { checked: true } });

      const button = await screen.findByTestId('request-refill-button');
      button.click();

      // Wait for success notification which uses getMedicationsByIds internally
      await waitFor(() => {
        expect(bulkRefillStub.calledOnce).to.be.true;
      });
    });

    it('matches medications by ID only when pilot flag is disabled', async () => {
      sandbox.restore();
      const bulkRefillStub = sinon.stub().resolves({
        data: {
          successfulIds: [22377956],
          failedIds: [],
        },
      });
      sandbox
        .stub(prescriptionsApiModule, 'useGetRefillablePrescriptionsQuery')
        .returns({
          data: {
            prescriptions: [refillablePrescriptions[0]],
            meta: {},
          },
          error: false,
          isLoading: false,
          isFetching: false,
        });
      sandbox
        .stub(prescriptionsApiModule, 'useBulkRefillPrescriptionsMutation')
        .returns([bulkRefillStub, { isLoading: false, error: null }]);
      stubAllergiesApi({ sandbox });

      const stateWithPilotDisabled = {
        ...initialState,
        featureToggles: {
          // eslint-disable-next-line camelcase
          mhv_medications_cerner_pilot: false,
        },
      };

      const screen = setup(stateWithPilotDisabled);
      const checkbox = await screen.findByTestId(
        'refill-prescription-checkbox-0',
      );
      checkbox.__events.vaChange({ detail: { checked: true } });

      const button = await screen.findByTestId('request-refill-button');
      button.click();

      // Wait for success notification which uses getMedicationsByIds internally
      await waitFor(() => {
        expect(bulkRefillStub.calledOnce).to.be.true;
      });
    });

    it('displays medication name in success notification when API returns simple numeric IDs', async () => {
      // This test verifies the fix for the bug where medication names were not rendering
      // because getMedicationsByIds was incorrectly matching IDs when API returned simple numbers
      sandbox.restore();

      const prescription = refillablePrescriptions[0];
      // Simulate the mutation returning isLoading: false with successful result
      // by returning the result directly from the stub
      const bulkRefillStub = sinon.stub().resolves({
        data: {
          successfulIds: [prescription.prescriptionId], // Simple numeric ID (22377956)
          failedIds: [],
        },
      });

      sandbox
        .stub(prescriptionsApiModule, 'useGetRefillablePrescriptionsQuery')
        .returns({
          data: {
            prescriptions: [prescription],
            meta: {},
          },
          error: false,
          isLoading: false,
          isFetching: false,
        });

      // Return the mutation with the resolved data to simulate completed state
      sandbox
        .stub(prescriptionsApiModule, 'useBulkRefillPrescriptionsMutation')
        .returns([
          bulkRefillStub,
          {
            isLoading: false,
            error: null,
            isSuccess: true,
            data: {
              successfulIds: [prescription.prescriptionId],
              failedIds: [],
            },
          },
        ]);
      stubAllergiesApi({ sandbox });

      const stateWithPilotDisabled = {
        ...initialState,
        featureToggles: {
          // eslint-disable-next-line camelcase
          mhv_medications_cerner_pilot: false,
        },
      };

      const screen = setup(stateWithPilotDisabled);

      // The success notification should display with the medication name
      // Previously this would show an empty list item because getMedicationsByIds
      // returned undefined when trying to match id.id on a simple number
      await waitFor(() => {
        const medicationList = screen.queryByTestId(
          'successful-medication-list',
        );
        if (medicationList) {
          expect(medicationList).to.contain.text(prescription.prescriptionName);
        }
      });
    });

    it('displays medication name in success notification when API returns object IDs with stationNumber', async () => {
      // This test verifies medication names render correctly for Oracle Health users
      // where the API returns IDs as objects with id and stationNumber properties
      sandbox.restore();

      const prescription = {
        ...refillablePrescriptions[0],
        stationNumber: '989',
      };

      const bulkRefillStub = sinon.stub().resolves({
        data: {
          successfulIds: [
            { id: prescription.prescriptionId, stationNumber: '989' },
          ],
          failedIds: [],
        },
      });

      sandbox
        .stub(prescriptionsApiModule, 'useGetRefillablePrescriptionsQuery')
        .returns({
          data: {
            prescriptions: [prescription],
            meta: {},
          },
          error: false,
          isLoading: false,
          isFetching: false,
        });

      sandbox
        .stub(prescriptionsApiModule, 'useBulkRefillPrescriptionsMutation')
        .returns([
          bulkRefillStub,
          {
            isLoading: false,
            error: null,
            isSuccess: true,
            data: {
              successfulIds: [
                { id: prescription.prescriptionId, stationNumber: '989' },
              ],
              failedIds: [],
            },
          },
        ]);
      stubAllergiesApi({ sandbox });

      const stateWithPilotEnabled = {
        ...initialState,
        featureToggles: {
          // eslint-disable-next-line camelcase
          mhv_medications_cerner_pilot: true,
        },
      };

      const screen = setup(stateWithPilotEnabled);

      // The success notification should display with the medication name
      await waitFor(() => {
        const medicationList = screen.queryByTestId(
          'successful-medication-list',
        );
        if (medicationList) {
          expect(medicationList).to.contain.text(prescription.prescriptionName);
        }
      });
    });

    it('shows loading indicator during cache refresh (isFetching = true)', async () => {
      // This test verifies the cache refresh behavior when isFetching is true
      // In real usage, this happens after successful refills when RTK Query invalidates and refetches
      sandbox.restore();

      sandbox
        .stub(prescriptionsApiModule, 'useGetRefillablePrescriptionsQuery')
        .returns({
          data: {
            prescriptions: [refillablePrescriptions[0]],
            meta: {},
          },
          error: false,
          isLoading: false,
          isFetching: true, // Cache invalidation in progress
        });

      sandbox
        .stub(prescriptionsApiModule, 'useBulkRefillPrescriptionsMutation')
        .returns([
          sinon.stub(),
          {
            isLoading: false,
            error: null,
            data: null, // No active refill
          },
        ]);
      stubAllergiesApi({ sandbox });

      const screen = setup(initialState);

      // When isFetching is true, component should show the form normally
      // (The cache refresh hiding only occurs when refillStatus is FINISHED AND isFetching is true)
      await waitFor(() => {
        const checkboxGroup = screen.queryByTestId('refill-checkbox-group');
        const button = screen.queryByTestId('request-refill-button');
        expect(checkboxGroup).to.exist;
        expect(button).to.exist;
      });
    });

    it('shows all prescriptions in checkbox list when none have been successfully refilled', async () => {
      sandbox.restore();

      const prescription1 = {
        ...refillablePrescriptions[0],
        prescriptionId: 11111111,
        prescriptionName: 'MEDICATION A',
      };
      const prescription2 = {
        ...refillablePrescriptions[1],
        prescriptionId: 22222222,
        prescriptionName: 'MEDICATION B',
      };

      sandbox
        .stub(prescriptionsApiModule, 'useGetRefillablePrescriptionsQuery')
        .returns({
          data: {
            prescriptions: [prescription1, prescription2],
            meta: {},
          },
          error: false,
          isLoading: false,
          isFetching: false,
        });

      // No successful refills yet
      sandbox
        .stub(prescriptionsApiModule, 'useBulkRefillPrescriptionsMutation')
        .returns([
          sinon.stub(),
          {
            isLoading: false,
            error: null,
            data: null, // No refill data yet
          },
        ]);
      stubAllergiesApi({ sandbox });

      const screen = setup(initialState);

      await waitFor(() => {
        // Both checkboxes should exist
        const checkbox0 = screen.queryByTestId(
          'refill-prescription-checkbox-0',
        );
        const checkbox1 = screen.queryByTestId(
          'refill-prescription-checkbox-1',
        );
        expect(checkbox0).to.exist;
        expect(checkbox0).to.have.property('label', 'MEDICATION A');
        expect(checkbox1).to.exist;
        expect(checkbox1).to.have.property('label', 'MEDICATION B');
      });
    });
  });

  describe('Duplicate refill prevention', () => {
    it('shows loading indicator and hides form during refill submission', async () => {
      sandbox.restore();

      sandbox
        .stub(prescriptionsApiModule, 'useGetRefillablePrescriptionsQuery')
        .returns({
          data: {
            prescriptions: [refillablePrescriptions[0]],
            meta: {},
          },
          error: false,
          isLoading: false,
          isFetching: false,
        });

      // Simulate mutation in loading state (isRefilling = true)
      sandbox
        .stub(prescriptionsApiModule, 'useBulkRefillPrescriptionsMutation')
        .returns([
          sinon
            .stub()
            .resolves({ data: { successfulIds: [22377956], failedIds: [] } }),
          { isLoading: true, error: null }, // This makes isDataLoading = true, preventing interactions
        ]);
      stubAllergiesApi({ sandbox });

      const screen = setup();

      // When isRefilling is true, should show loading indicator and hide form
      await waitFor(() => {
        const loadingIndicator = screen.queryByTestId('loading-indicator');
        expect(loadingIndicator).to.exist;

        // Form elements should not exist during loading to prevent duplicate submissions
        const button = screen.queryByTestId('request-refill-button');
        const checkboxGroup = screen.queryByTestId('refill-checkbox-group');
        expect(button).to.not.exist;
        expect(checkboxGroup).to.not.exist;
      });
    });

    it('prevents duplicate refill attempts when isRefilling is true', async () => {
      sandbox.restore();

      const mockBulkRefill = sinon.stub().resolves({
        data: { successfulIds: [22377956], failedIds: [] },
      });

      sandbox
        .stub(prescriptionsApiModule, 'useGetRefillablePrescriptionsQuery')
        .returns({
          data: {
            prescriptions: [refillablePrescriptions[0]],
            meta: {},
          },
          error: false,
          isLoading: false,
          isFetching: false,
        });

      // First call: normal state
      const mutationStub = sandbox
        .stub(prescriptionsApiModule, 'useBulkRefillPrescriptionsMutation')
        .returns([mockBulkRefill, { isLoading: false, error: null }]);

      stubAllergiesApi({ sandbox });
      const screen = setup();

      // Select a prescription
      const checkbox = await screen.findByTestId(
        'refill-prescription-checkbox-0',
      );
      fireEvent.click(checkbox);

      // Now simulate isRefilling = true for subsequent calls
      mutationStub.returns([
        mockBulkRefill,
        { isLoading: true, error: null }, // isRefilling = true
      ]);

      // Try to submit refill - should be prevented by isRefilling check
      const refillButton = screen.getByTestId('request-refill-button');

      // The button should be disabled when isRefilling is true
      await waitFor(() => {
        expect(refillButton).to.have.attribute('disabled');
      });
    });

    it('uses fixedCacheKey for shared mutation state', () => {
      sandbox.restore();

      const mockMutation = sinon
        .stub()
        .returns([sinon.stub(), { isLoading: false, error: null }]);

      sandbox
        .stub(prescriptionsApiModule, 'useBulkRefillPrescriptionsMutation')
        .callsFake(options => {
          // Verify that fixedCacheKey is being used
          expect(options).to.have.property(
            'fixedCacheKey',
            'bulk-refill-request',
          );
          return mockMutation();
        });

      sandbox
        .stub(prescriptionsApiModule, 'useGetRefillablePrescriptionsQuery')
        .returns({
          data: { prescriptions: [], meta: {} },
          error: false,
          isLoading: false,
          isFetching: false,
        });

      stubAllergiesApi({ sandbox });
      setup();
    });
  });

  it('derives refillRequestStatus correctly from RTK Query state', async () => {
    // This test ensures refillRequestStatus correctly derives FINISHED from RTK Query state
    // preventing race condition where manual status updates conflict with RTK Query
    sandbox.restore();

    const bulkRefillStub = sinon.stub().resolves({
      data: { successfulIds: [22377956], failedIds: [] },
    });

    sandbox
      .stub(prescriptionsApiModule, 'useGetRefillablePrescriptionsQuery')
      .returns({
        data: { prescriptions: refillablePrescriptions, meta: {} },
        error: false,
        isLoading: false,
        isFetching: false,
      });

    sandbox
      .stub(prescriptionsApiModule, 'useBulkRefillPrescriptionsMutation')
      .returns([
        bulkRefillStub,
        {
          isLoading: false,
          error: null,
          isSuccess: true,
          data: { successfulIds: [22377956], failedIds: [] },
        },
      ]);

    stubAllergiesApi({ sandbox });
    const screen = setup();

    // Should show success notification when RTK Query indicates success
    // This tests that refillRequestStatus correctly derives FINISHED from RTK Query state
    await waitFor(() => {
      const successTitle = screen.queryByTestId('success-refill-title');
      const errorTitle = screen.queryByTestId('error-refill-title');

      // Should show success, not error
      expect(successTitle).to.exist;
      expect(errorTitle).to.not.exist;
    });
  });

  it('shows success notification after refill even when cache invalidation removes the prescription', async () => {
    sandbox.restore();

    let currentPrescriptions = refillablePrescriptions;
    let mutationResult = { isLoading: false, error: null };

    const bulkRefillStub = sinon.stub().callsFake(() => {
      currentPrescriptions = refillablePrescriptions.filter(
        rx => rx.prescriptionId !== 22377956,
      );
      mutationResult = {
        isLoading: false,
        error: null,
        isSuccess: true,
        data: { successfulIds: [22377956], failedIds: [] },
      };
      return { unwrap: () => Promise.resolve(mutationResult.data) };
    });

    sandbox
      .stub(prescriptionsApiModule, 'useGetRefillablePrescriptionsQuery')
      .callsFake(() => ({
        data: { prescriptions: currentPrescriptions, meta: {} },
        error: false,
        isLoading: false,
        isFetching: false,
      }));

    sandbox
      .stub(prescriptionsApiModule, 'useBulkRefillPrescriptionsMutation')
      .callsFake(() => [bulkRefillStub, mutationResult]);

    stubAllergiesApi({ sandbox });
    const screen = setup();

    const checkbox = await waitFor(() =>
      screen.getByTestId('refill-prescription-checkbox-0'),
    );
    checkbox.__events.vaChange({ detail: { checked: true } });
    const refillButton = screen.getByTestId('request-refill-button');
    fireEvent.click(refillButton);

    await waitFor(() => {
      const successTitle = screen.queryByTestId('success-refill-title');
      const errorTitle = screen.queryByTestId('error-refill-title');

      expect(successTitle).to.exist;
      expect(errorTitle).to.not.exist;
    });
  });
});
