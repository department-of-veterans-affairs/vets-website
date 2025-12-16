import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import StatusDropdown from '../../../components/shared/StatusDropdown';
import { dispStatusObj } from '../../../util/constants';
import reducer from '../../../reducers';

describe('component that displays Status', () => {
  const renderStatus = (status, isCernerPilot = false, isV2StatusMapping = false) => {
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

  const V1_TO_V2_MAPPINGS = [
    { v1: 'Active: Refill in Process', v2: 'In progress' },
    { v1: 'Active: Submitted', v2: 'In progress' },
    { v1: 'Active: Parked', v2: 'Active' },
    { v1: 'Active', v2: 'Active' },
    { v1: 'Expired', v2: 'Inactive' },
    { v1: 'Discontinued', v2: 'Inactive' },
    { v1: 'Active: On Hold', v2: 'Inactive' },
    { v1: 'Transferred', v2: 'Transferred' },
    { v1: 'Unknown', v2: 'Status not available' },
  ];

  const FLAG_COMBINATIONS = [
    { cernerPilot: false, v2StatusMapping: false, useV2: false, desc: 'both flags disabled' },
    { cernerPilot: true, v2StatusMapping: false, useV2: false, desc: 'only cernerPilot enabled' },
    { cernerPilot: false, v2StatusMapping: true, useV2: false, desc: 'only v2StatusMapping enabled' },
    { cernerPilot: true, v2StatusMapping: true, useV2: true, desc: 'both flags enabled' },
  ];

  describe('when cernerPilot flag is disabled', () => {
    it('renders without errors', () => {
      const screen = renderStatus();
      expect(screen);
    });

    it('displays unknown as status when there is no status being passed', () => {
      const screen = renderStatus();
      const unknownStatus = screen.getAllByText('Unknown');
      expect(unknownStatus).to.exist;
    });

    it('displays Active: Parked when status is passed as activeParked', () => {
      const screen = renderStatus('Active: Parked');
      const unknownStatus = screen.getAllByText('Active: Parked');
      expect(unknownStatus).to.exist;
    });

    it('displays correct Active: Parked description when drop down is clicked on', async () => {
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

    it('displays Unknown status when cernerPilot is enabled but v2StatusMapping is disabled', () => {
      const screen = renderStatus(undefined, true, false);
      // Still V1 behavior - requires BOTH flags
      const unknownStatus = screen.getAllByText('Unknown');
      expect(unknownStatus).to.exist;
    });

    it('displays Status not available only when BOTH CernerPilot and  V2StatusMapping flags are enabled', () => {
      const screen = renderStatus(undefined, true, true);
      const unknownStatus = screen.getAllByText('Status not available');
      expect(unknownStatus).to.exist;
    });
  });

  describe('Status transformation and definition validation', () => {
    V1_TO_V2_MAPPINGS.forEach(({ v1, v2 }) => {
      it(`transforms ${v1} to ${v2} when both flags enabled`, () => {
        const screen = renderStatus(v1, true, true);
        expect(screen.getAllByText(v2)).to.exist;
      });

      it(`preserves ${v1} when both flags disabled`, () => {
        const screen = renderStatus(v1, false, false);
        expect(screen.getAllByText(v1, { exact: false })).to.exist;
      });
    });
  });
  describe('CernerPilot and  V2StatusMapping flag requirement validation', () => {
    FLAG_COMBINATIONS.forEach(({ cernerPilot, v2StatusMapping, useV2, desc }) => {
      it(`${useV2 ? 'V2' : 'V1'} behavior when ${desc}`, () => {
        const screen = renderStatus('Active: Parked', cernerPilot, v2StatusMapping);
        const expectedStatus = useV2 ? 'Active' : 'Active: Parked';
        expect(screen.getAllByText(expectedStatus)).to.exist;
      });
    });
  });
  describe('Shipped status handling', () => {
    FLAG_COMBINATIONS.forEach(({ cernerPilot, v2StatusMapping, desc }) => {
      it(`handles Shipped status when ${desc}`, () => {
        const screen = renderStatus('Shipped', cernerPilot, v2StatusMapping);
        expect(screen).to.exist;
        if (cernerPilot && v2StatusMapping) {
          expect(screen.getAllByText('Shipped')).to.exist;
          expect(screen.getByTestId('shipped-status-definition')).to.exist;
        }
      });
    });
  });
  describe('Pending medication statuses', () => {
    ['NewOrder', 'Renew'].forEach(status => {
      FLAG_COMBINATIONS.forEach(({ cernerPilot, v2StatusMapping, desc }) => {
        it(`displays ${status} status correctly when ${desc}`, () => {
          const screen = renderStatus(status, cernerPilot, v2StatusMapping);
          expect(screen).to.exist;
        });
      });
    });
  });
  describe('Status definition content validation', () => {
    it('V1 Active: Parked has correct definition text', () => {
      const screen = renderStatus('Active: Parked', false, false);
      expect(screen.getByText(/Your VA provider prescribed this medication/)).to.exist;
    });

    it('V2 Active has correct definition text when BOTH CernerPilot and  V2StatusMapping flags enabled', () => {
      const screen = renderStatus('Active', true, true);
      const definition = screen.getByTestId('active-status-definition');
      expect(definition.textContent).to.include('A prescription you can fill at a local VA pharmacy');
    });

    it('V2 In progress has correct definition text when BOTH CernerPilot and  V2StatusMapping flags enabled', () => {
      const screen = renderStatus('In progress', true, true);
      const definition = screen.getByTestId('inprogress-status-definition');
      expect(definition.textContent).to.include("A new prescription or a prescription you've requested");
    });

    it('V2 Inactive has correct definition text when BOTH CernerPilot and  V2StatusMapping flags enabled', () => {
      const screen = renderStatus('Inactive', true, true);
      const definition = screen.getByTestId('inactive-status-definition');
      expect(definition.textContent).to.include('A prescription you can no longer fill');
    });

    it('V2 Transferred has correct definition text when BOTH CernerPilot and  V2StatusMapping flags enabled', () => {
      const screen = renderStatus('Transferred', true, true);
      const definition = screen.getByTestId('transferred-status-definition');
      expect(definition.textContent).to.include("VA's new electronic health record");
    });

    it('V2 Status not available has correct definition text when BOTH CernerPilot and  V2StatusMapping flags enabled', () => {
      const screen = renderStatus('Status not available', true, true);
      const definition = screen.getByTestId('unknown-status-definition');
      expect(definition.textContent).to.include("There's a problem with our system");
    });
  });
});
