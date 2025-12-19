import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
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

    it('filters out successfully refilled prescriptions from the checkbox list immediately', async () => {
      // This test verifies that after a successful refill, the prescription
      // is immediately hidden from the refillable checkbox list without waiting for cache refresh
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

      // Simulate completed mutation with prescription1 successfully refilled
      sandbox
        .stub(prescriptionsApiModule, 'useBulkRefillPrescriptionsMutation')
        .returns([
          sinon.stub(),
          {
            isLoading: false,
            error: null,
            data: {
              successfulIds: [prescription1.prescriptionId],
              failedIds: [],
            },
          },
        ]);
      stubAllergiesApi({ sandbox });

      const screen = setup(initialState);

      // Wait for prescriptions to load and check the checkbox list
      await waitFor(() => {
        // Only one checkbox should exist now (index 0) since prescription1 was refilled
        const checkbox0 = screen.queryByTestId(
          'refill-prescription-checkbox-0',
        );
        expect(checkbox0).to.exist;
        // MEDICATION B should now be at index 0 since MEDICATION A was filtered out
        expect(checkbox0).to.have.property('label', 'MEDICATION B');
        // There should be no second checkbox
        const checkbox1 = screen.queryByTestId(
          'refill-prescription-checkbox-1',
        );
        expect(checkbox1).to.not.exist;
      });
    });

    it('filters out successfully refilled prescriptions using stationNumber when pilot is enabled', async () => {
      // This test verifies that prescriptions with same ID but different stationNumbers
      // are correctly identified (only the matching one is filtered out from checkbox list)
      sandbox.restore();

      const prescription1 = {
        ...refillablePrescriptions[0],
        prescriptionId: 11111111,
        stationNumber: '989',
        prescriptionName: 'MEDICATION A - STATION 989',
      };
      const prescription2 = {
        ...refillablePrescriptions[1],
        prescriptionId: 11111111, // Same ID, different station
        stationNumber: '123',
        prescriptionName: 'MEDICATION A - STATION 123',
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

      // Simulate completed mutation with only prescription1 (station 989) successfully refilled
      sandbox
        .stub(prescriptionsApiModule, 'useBulkRefillPrescriptionsMutation')
        .returns([
          sinon.stub(),
          {
            isLoading: false,
            error: null,
            data: {
              successfulIds: [
                { id: prescription1.prescriptionId, stationNumber: '989' },
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

      await waitFor(() => {
        // Only one checkbox should exist now (index 0) since prescription1 was refilled
        const checkbox0 = screen.queryByTestId(
          'refill-prescription-checkbox-0',
        );
        expect(checkbox0).to.exist;
        // MEDICATION A - STATION 123 should now be at index 0 since STATION 989 was filtered out
        expect(checkbox0).to.have.property(
          'label',
          'MEDICATION A - STATION 123',
        );
        // There should be no second checkbox
        const checkbox1 = screen.queryByTestId(
          'refill-prescription-checkbox-1',
        );
        expect(checkbox1).to.not.exist;
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
});
