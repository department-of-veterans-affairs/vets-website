import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/dom';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import prescriptionsListItem from '../../fixtures/prescriptionsListItem.json';
import MedicationsListCard from '../../../components/MedicationsList/MedicationsListCard';
import reducers from '../../../reducers';

describe('Medication card component', () => {
  const FLAG_COMBINATIONS = [
    {
      cernerPilot: false,
      v2StatusMapping: false,
      useV2: false,
      desc: 'both flags disabled',
    },
    {
      cernerPilot: true,
      v2StatusMapping: false,
      useV2: false,
      desc: 'only cernerPilot enabled',
    },
    {
      cernerPilot: false,
      v2StatusMapping: true,
      useV2: false,
      desc: 'only v2StatusMapping enabled',
    },
    {
      cernerPilot: true,
      v2StatusMapping: true,
      useV2: true,
      desc: 'both flags enabled',
    },
  ];

  const V2_STATUSES = [
    { status: 'Active', desc: 'Active' },
    { status: 'In progress', desc: 'In progress' },
    { status: 'Inactive', desc: 'Inactive' },
    { status: 'Transferred', desc: 'Transferred' },
    { status: 'Shipped', desc: 'Shipped' },
    { status: 'Status not available', desc: 'Status not available' },
  ];

  const V1_STATUSES = [
    'Active: Parked',
    'Active: Refill in Process',
    'Active: Submitted',
    'Active: On Hold',
    'Expired',
    'Discontinued',
    'Transferred',
  ];

  const setup = (rx = prescriptionsListItem, initialState = {}) => {
    return renderWithStoreAndRouterV6(<MedicationsListCard rx={rx} />, {
      state: initialState,
      reducers,
    });
  };

  const setupWithFlags = (
    rx = prescriptionsListItem,
    isCernerPilot = false,
    isV2StatusMapping = false,
  ) => {
    const initialState = {
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: isCernerPilot,
        [FEATURE_FLAG_NAMES.mhvMedicationsV2StatusMapping]: isV2StatusMapping,
      },
    };
    return renderWithStoreAndRouterV6(<MedicationsListCard rx={rx} />, {
      initialState,
      reducers,
    });
  };

  // Shared test data

  it('renders without errors, even when no prescription name is given ', () => {
    const screen = setup({
      ...prescriptionsListItem,
      prescriptionName: '',
      dispStatus: 'Active: Non-VA',
    });
    const medicationName = screen.getByTestId(
      'medications-history-details-link',
    );
    fireEvent.click(medicationName);
    expect(screen);
  });

  it('shows status', () => {
    const screen = setup();
    expect(screen.getByText(prescriptionsListItem.dispStatus)).to.exist;
  });

  it('does not show Unknown when status is unknown', () => {
    const rxWithUnknownStatus = {
      ...prescriptionsListItem,
      dispStatus: 'Unknown',
    };
    const screen = setup(rxWithUnknownStatus);
    expect(screen.queryByText(rxWithUnknownStatus.dispStatus)).to.not.exist;
  });

  it('able to click on medication name', () => {
    const screen = setup({
      ...prescriptionsListItem,
      dispStatus: 'Active: Non-VA',
    });
    const medicationName = screen.getByText(
      prescriptionsListItem.prescriptionName,
    );
    fireEvent.click(medicationName);
    expect(screen);
  });

  it('shows shipped on information when available', () => {
    const screen = setup({
      ...prescriptionsListItem,
      trackingList: [
        {
          completeDateTime: 'Sun, 16 Jun 2024 04:39:11 EDT',
        },
      ],
    });
    const shippedOn = screen.getByText('Shipped on June 16, 2024');
    expect(shippedOn);
  });

  it('shows number of refills when it is refillable and has at least 1 refill remaining', () => {
    const rx = {
      ...prescriptionsListItem,
      isRefillable: true,
      dispStatus: 'Active',
      refillRemaining: 3,
    };
    const { getByTestId } = setup(rx);
    expect(getByTestId('rx-refill-remaining')).to.have.text(
      'Refills remaining: 3',
    );
  });

  it('Does not show number of refills when it is not refillable', () => {
    const rx = {
      ...prescriptionsListItem,
      dispStatus: 'Active',
      refillRemaining: 3,
    };
    const { queryByTestId } = setup(rx);
    expect(queryByTestId('rx-refill-remaining')).to.be.null;
  });

  it('Does not show number of refills when it has less than 1 refill remaining', () => {
    const rx = {
      ...prescriptionsListItem,
      isRefillable: true,
      dispStatus: 'Active',
      refillRemaining: 0,
    };
    const { queryByTestId } = setup(rx);
    expect(queryByTestId('rx-refill-remaining')).to.be.null;
  });

  it('displays "Not available" when prescription number is missing', () => {
    const rx = {
      ...prescriptionsListItem,
      prescriptionNumber: null,
      dispStatus: 'Active: Non-VA',
    };
    const { getByTestId } = setup(rx);
    expect(getByTestId('rx-number')).to.have.text(
      'Prescription number: Not available',
    );
  });

  it('shows pending med text inside card body when the rx prescription source is PD and dispStatus is NewOrder', () => {
    const screen = setup({
      ...prescriptionsListItem,
      prescriptionSource: 'PD',
      dispStatus: 'NewOrder',
    });
    expect(
      screen.getByText(
        'This is a new prescription from your provider. Your VA pharmacy is reviewing it now. Details may change.',
      ),
    );
  });

  it('shows pending renewal text inside card body when the rx prescription source is PD and the disp status is Renew', () => {
    const screen = setup({
      ...prescriptionsListItem,
      prescriptionSource: 'PD',
      dispStatus: 'Renew',
    });
    expect(
      screen.getByText(
        'This is a renewal you requested. Your VA pharmacy is reviewing it now. Details may change.',
      ),
    );
  });

  it('renders a Non-VA Prescription with an orderedDate', () => {
    const rx = {
      ...prescriptionsListItem,
      prescriptionSource: 'NV',
      dispStatus: 'Active: Non-VA',
      orderedDate: '2024-06-16T20:00:00Z',
    };
    const { getByTestId } = setup(rx);
    /* eslint-disable prettier/prettier */
    expect(getByTestId('rx-last-filled-info')).to.have.text(
      'Documented on June 16, 2024',
    );
    expect(getByTestId('rxStatus')).to.have.text('Active: Non-VA');
    expect(getByTestId('non-VA-prescription')).to.have.text(
      'You can’t manage this medication in this online tool.',
    );
    /* eslint-enable prettier/prettier */
  });

  it('renders a Non-VA Prescription without an orderedDate', () => {
    const rx = {
      ...prescriptionsListItem,
      prescriptionSource: 'NV',
      dispStatus: 'Active: Non-VA',
      orderedDate: '',
    };
    const { getByTestId } = setup(rx);
    /* eslint-disable prettier/prettier */
    expect(getByTestId('rx-last-filled-info')).to.have.text(
      'Documented on: Date not available',
    );
    expect(getByTestId('rxStatus')).to.have.text('Active: Non-VA');
    expect(getByTestId('non-VA-prescription')).to.have.text(
      'You can’t manage this medication in this online tool.',
    );
    /* eslint-enable prettier/prettier */
  });

  it('renders a Non-VA Prescription when dispStatus is null', () => {
    const rx = {
      ...prescriptionsListItem,
      prescriptionSource: 'NV',
      dispStatus: null,
      orderedDate: '',
    };
    const { getByTestId } = setup(rx);
    /* eslint-disable prettier/prettier */
    expect(getByTestId('rx-last-filled-info')).to.have.text(
      'Documented on: Date not available',
    );
    expect(getByTestId('rxStatus')).to.have.text('Active: Non-VA');
    expect(getByTestId('non-VA-prescription')).to.have.text(
      'You can’t manage this medication in this online tool.',
    );
    /* eslint-enable prettier/prettier */
  });

  describe('CernerPilot and V2StatusMapping flag requirement validation', () => {
    FLAG_COMBINATIONS.forEach(
      ({ cernerPilot, v2StatusMapping, useV2, desc }) => {
        it(`${useV2 ? 'V2' : 'V1'} behavior when ${desc}`, () => {
          // Pass appropriate status based on flag combination
          // When both flags enabled, API returns V2 status; otherwise V1
          const dispStatus = useV2 ? 'Inactive' : 'Expired';
          const rx = { ...prescriptionsListItem, dispStatus };
          const screen = setupWithFlags(rx, cernerPilot, v2StatusMapping);
          expect(screen.getByText(dispStatus)).to.exist;
        });
      },
    );
  });

  it('renders link text from orderableItem when prescriptionName is null', () => {
    const rx = {
      ...prescriptionsListItem,
      prescriptionName: null, // null check
      orderableItem: 'Amoxicillin 500mg Capsules', // fallback text
    };
    const screen = setup(rx);
    const link = screen.getByTestId('medications-history-details-link');
    expect(link).to.exist;
    expect(link.textContent).to.include('Amoxicillin 500mg Capsules');
  });

  it('renders link with medication name when available', () => {
    const rx = {
      ...prescriptionsListItem,
      prescriptionName: 'Atorvastatin',
      orderableItem: 'Fallback should not be used',
    };
    const screen = setup(rx);
    const link = screen.getByTestId('medications-history-details-link');
    expect(link).to.exist;
    expect(link.textContent).to.include('Atorvastatin');
  });

  it('does not render Unknown status text', () => {
    const rxWithUnknownStatus = {
      ...prescriptionsListItem,
      dispStatus: 'Unknown',
    };
    const screen = setup(rxWithUnknownStatus);
    expect(screen.queryByText(rxWithUnknownStatus.dispStatus)).to.not.exist;
  });

  it('does not render aria-describedby attribute on the link', () => {
    const screen = setup();
    const link = screen.getByTestId('medications-history-details-link');
    expect(link.getAttribute('aria-describedby')).to.be.null;
  });
  describe('Status display edge cases', () => {
    const edgeCases = [
      { dispStatus: null, desc: 'null dispStatus' },
      { dispStatus: undefined, desc: 'undefined dispStatus' },
      { dispStatus: '', desc: 'empty string dispStatus' },
    ];

    edgeCases.forEach(({ dispStatus, desc }) => {
      FLAG_COMBINATIONS.forEach(
        ({ cernerPilot, v2StatusMapping, desc: flagDesc }) => {
          it(`handles ${desc} when ${flagDesc}`, () => {
            const rx = { ...prescriptionsListItem, dispStatus };
            const screen = setupWithFlags(rx, cernerPilot, v2StatusMapping);
            expect(screen).to.exist;
          });
        },
      );
    });
  });
  describe('Non-VA status preservation', () => {
    FLAG_COMBINATIONS.forEach(({ cernerPilot, v2StatusMapping, desc }) => {
      it(`preserves Active: Non-VA status when ${desc}`, () => {
        const rx = {
          ...prescriptionsListItem,
          dispStatus: 'Active: Non-VA',
          prescriptionSource: 'NV',
        };
        const screen = setupWithFlags(rx, cernerPilot, v2StatusMapping);
        expect(screen.getByText('Active: Non-VA')).to.exist;
      });
    });
  });

  describe('Pending medication status handling', () => {
    const pendingStatuses = [
      {
        dispStatus: 'NewOrder',
        expectedText: /new prescription from your provider/,
      },
      { dispStatus: 'Renew', expectedText: /renewal you requested/ },
    ];

    pendingStatuses.forEach(({ dispStatus, expectedText }) => {
      FLAG_COMBINATIONS.forEach(({ cernerPilot, v2StatusMapping, desc }) => {
        it(`shows pending ${dispStatus} text when ${desc}`, () => {
          const rx = {
            ...prescriptionsListItem,
            prescriptionSource: 'PD',
            dispStatus,
          };
          const screen = setupWithFlags(rx, cernerPilot, v2StatusMapping);
          expect(screen.getByText(expectedText)).to.exist;
        });
      });
    });
  });

  describe('V2 status display when API returns V2 statuses (both flags enabled)', () => {
    V2_STATUSES.forEach(({ status, desc }) => {
      it(`displays ${desc} correctly when returned by API`, () => {
        const rx = { ...prescriptionsListItem, dispStatus: status };
        const screen = setupWithFlags(rx, true, true);
        expect(screen.getByText(status)).to.exist;
      });
    });
  });

  describe('V1 status display when flags disabled', () => {
    V1_STATUSES.forEach(status => {
      it(`displays ${status} correctly when returned by API`, () => {
        const rx = { ...prescriptionsListItem, dispStatus: status };
        const screen = setupWithFlags(rx, false, false);
        expect(screen.getByText(status)).to.exist;
      });
    });
  });
});
