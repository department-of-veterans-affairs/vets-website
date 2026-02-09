import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import StatusDropdown from '../../../components/shared/StatusDropdown';
import { dispStatusObj } from '../../../util/constants';
import reducer from '../../../reducers';

describe('component that displays Status', () => {
  const renderStatus = (
    status,
    isCernerPilot = false,
    isV2StatusMapping = false,
  ) => {
    const initialState = {
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: isCernerPilot,
        [FEATURE_FLAG_NAMES.mhvMedicationsV2StatusMapping]: isV2StatusMapping,
      },
    };

    return renderWithStoreAndRouter(<StatusDropdown status={status} />, {
      initialState,
      reducers: reducer,
    });
  };

  describe('when cernerPilot flag is disabled', () => {
    it('renders without errors', () => {
      const screen = renderStatus();
      expect(screen);
    });

    it('displays "Unknown" as status when there is no status being passed', () => {
      const screen = renderStatus();
      const unknownStatus = screen.getAllByText('Unknown');
      expect(unknownStatus).to.exist;
    });

    it('displays "Active: Parked" when status is passed as activeParked', () => {
      const screen = renderStatus('Active: Parked');
      const unknownStatus = screen.getAllByText('Active: Parked');
      expect(unknownStatus).to.exist;
    });

    it('displays correct "Active: Parked" description when drop down is clicked on', async () => {
      const screen = renderStatus('Active: Parked');
      const statusDescription = screen.getAllByText(
        'Your VA provider prescribed this medication or supply to you. But we won’t send any shipments until you request to fill or refill it.',
      );
      expect(statusDescription).to.exist;
    });

    it('displays all correctly formatted status', () => {
      Object.values(dispStatusObj).map(formattedStatus => {
        const screen = renderStatus(formattedStatus);
        expect(screen.getAllByText(formattedStatus, { exact: false })).to.exist;
        return null;
      });
    });
  });

  describe('when cernerPilot flag is enabled', () => {
    it('renders without errors with cernerPilot enabled', () => {
      const screen = renderStatus(undefined, true, false);
      expect(screen);
    });

    it('displays "Unknown" status when cernerPilot is enabled but v2StatusMapping is disabled', () => {
      const screen = renderStatus(undefined, true, false);
      // Still V1 behavior - requires BOTH flags
      const unknownStatus = screen.getAllByText('Unknown');
      expect(unknownStatus).to.exist;
    });

    it('displays "Status not available" only when BOTH CernerPilot and V2StatusMapping flags are enabled', () => {
      const screen = renderStatus(undefined, true, true);
      const unknownStatus = screen.getAllByText('Status not available');
      expect(unknownStatus).to.exist;
    });
  });

  describe('V2 status display when both CernerPilot and V2StatusMapping flags enabled', () => {
    it('renders Active correctly', () => {
      const screen = renderStatus('Active', true, true);
      expect(screen.getAllByText('Active')).to.exist;
    });

    it('renders In progress correctly', () => {
      const screen = renderStatus('In progress', true, true);
      expect(screen.getAllByText('In progress')).to.exist;
    });

    it('renders Inactive correctly', () => {
      const screen = renderStatus('Inactive', true, true);
      expect(screen.getAllByText('Inactive')).to.exist;
    });

    it('renders Transferred correctly', () => {
      const screen = renderStatus('Transferred', true, true);
      expect(screen.getAllByText('Transferred')).to.exist;
    });

    it('renders Status not available correctly', () => {
      const screen = renderStatus('Status not available', true, true);
      expect(screen.getAllByText('Status not available')).to.exist;
    });
  });

  describe('V1 status display when both CernerPilot and V2StatusMapping flags are disabled', () => {
    it('renders Active: Refill in Process', () => {
      const screen = renderStatus('Active: Refill in Process', false, false);
      expect(screen.getAllByText('Active: Refill in Process', { exact: false }))
        .to.exist;
    });

    it('renders Active: Parked', () => {
      const screen = renderStatus('Active: Parked', false, false);
      expect(screen.getAllByText('Active: Parked', { exact: false })).to.exist;
    });

    it('renders Active: Submitted', () => {
      const screen = renderStatus('Active: Submitted', false, false);
      expect(screen.getAllByText('Active: Submitted', { exact: false })).to
        .exist;
    });

    it('renders Active: On Hold', () => {
      const screen = renderStatus('Active: On Hold', false, false);
      expect(screen.getAllByText('Active: On Hold', { exact: false })).to.exist;
    });

    it('renders Expired', () => {
      const screen = renderStatus('Expired', false, false);
      expect(screen.getAllByText('Expired', { exact: false })).to.exist;
    });

    it('renders Discontinued', () => {
      const screen = renderStatus('Discontinued', false, false);
      expect(screen.getAllByText('Discontinued', { exact: false })).to.exist;
    });

    it('renders Transferred', () => {
      const screen = renderStatus('Transferred', false, false);
      expect(screen.getAllByText('Transferred', { exact: false })).to.exist;
    });

    it('renders Active: Non-VA', () => {
      const screen = renderStatus('Active: Non-VA', false, false);
      expect(screen.getAllByText('Active: Non-VA', { exact: false })).to.exist;
    });
  });

  describe('component rendering with both cernerPilot and V2StatusMapping flags disabled', () => {
    it('renders Active: Parked status correctly', () => {
      const screen = renderStatus('Active: Parked', false, false);
      expect(screen.getAllByText('Active: Parked')).to.exist;
    });
  });

  describe('component rendering with both cernerPilot and V2StatusMapping flags enabled', () => {
    it('renders Active status correctly', () => {
      const screen = renderStatus('Active', true, true);
      expect(screen.getAllByText('Active')).to.exist;
    });
  });

  describe('Shipped status handling', () => {
    it('handles Shipped status when both cernerPilot and V2StatusMapping flags disabled', () => {
      const screen = renderStatus('Shipped', false, false);
      expect(screen).to.exist;
      const statusElement =
        screen.container.querySelector('[data-testid="status-dropdown"]') ||
        screen.container.querySelector(
          '[trigger="What does this status mean?"]',
        );
      expect(statusElement).to.exist;
    });

    it('handles Shipped status when both cernerPilot and V2StatusMapping flags enabled', () => {
      const screen = renderStatus('Shipped', true, true);
      expect(screen).to.exist;
      const statusElement =
        screen.container.querySelector('[data-testid="status-dropdown"]') ||
        screen.container.querySelector(
          '[trigger="What does this status mean?"]',
        );
      expect(statusElement).to.exist;
    });
  });

  describe('Pending medication statuses', () => {
    it('displays NewOrder status correctly when both flags disabled', () => {
      const screen = renderStatus('NewOrder', false, false);
      expect(screen).to.exist;
    });

    it('displays NewOrder status correctly when both cernerPilot and V2StatusMapping flags enabled', () => {
      const screen = renderStatus('NewOrder', true, true);
      expect(screen).to.exist;
    });

    it('displays Renew status correctly when both cernerPilot and V2StatusMapping flags disabled', () => {
      const screen = renderStatus('Renew', false, false);
      expect(screen).to.exist;
    });

    it('displays Renew status correctly when both cernerPilot and V2StatusMapping flags enabled', () => {
      const screen = renderStatus('Renew', true, true);
      expect(screen).to.exist;
    });
  });

  describe('Status definition content validation', () => {
    it('V1 Active: Parked has correct definition text when BOTH CernerPilot and V2StatusMapping flags disabled', () => {
      const screen = renderStatus('Active: Parked', false, false);
      expect(screen.getByText(/Your VA provider prescribed this medication/)).to
        .exist;
    });

    it('V2 Active has correct definition text when BOTH CernerPilot and V2StatusMapping flags enabled', () => {
      const screen = renderStatus('Active', true, true);
      const definition = screen.getByTestId('active-status-definition');
      expect(definition.textContent).to.include(
        'A prescription you can fill at a local VA pharmacy',
      );
    });

    it('V2 In progress has correct definition text when BOTH CernerPilot and V2StatusMapping flags enabled', () => {
      const screen = renderStatus('In progress', true, true);
      const definition = screen.getByTestId('inprogress-status-definition');
      expect(definition.textContent).to.include(
        'A new prescription or a prescription you’ve requested',
      );
    });

    it('V2 Inactive has correct definition text when BOTH CernerPilot and V2StatusMapping flags enabled', () => {
      const screen = renderStatus('Inactive', true, true);
      const definition = screen.getByTestId('inactive-status-definition');
      expect(definition.textContent).to.include(
        'A prescription you can no longer fill',
      );
    });

    it('V2 Transferred has correct definition text when BOTH CernerPilot and V2StatusMapping flags enabled', () => {
      const screen = renderStatus('Transferred', true, true);
      const definition = screen.getByTestId('transferred-status-definition');
      expect(definition.textContent).to.include(
        'VA’s new electronic health record',
      );
    });

    it('V2 Status not available has correct definition text when BOTH CernerPilot and V2StatusMapping flags enabled', () => {
      const screen = renderStatus('Status not available', true, true);
      const definition = screen.getByTestId('unknown-status-definition');
      expect(definition.textContent).to.include(
        'There’s a problem with our system',
      );
    });
  });
});
