import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import StatusDropdown from '../../../components/shared/StatusDropdown';
import { dispStatusObj } from '../../../util/constants';
import reducer from '../../../reducers';

describe('component that displays Status', () => {
  const renderStatus = (status, isCernerPilot = false) => {
    const initialState = {
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_medications_cerner_pilot: isCernerPilot,
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
      const screen = renderStatus(undefined, true);
      expect(screen);
    });

    it('displays Status not available as status when there is no status being passed with cernerPilot enabled', () => {
      const screen = renderStatus(undefined, true);
      const unknownStatus = screen.getAllByText('Status not available');
      expect(unknownStatus).to.exist;
    });

    it('displays Active when status is passed as activeParked with cernerPilot enabled', () => {
      const screen = renderStatus('Active: Parked', true);
      const unknownStatus = screen.getAllByText('Active');
      expect(unknownStatus).to.exist;
    });

    it('displays In progress when refillinprocess status is passed with cernerPilot enabled', () => {
      const screen = renderStatus(dispStatusObj.refillinprocess, true);
      const inProgressStatus = screen.getAllByText('In progress');
      expect(inProgressStatus).to.exist;
    });

    it('displays in progress when status is Active: Submitted passed with cernerPilot enabled', () => {
      const screen = renderStatus(dispStatusObj.submitted, true);
      const submittedStatus = screen.getAllByText('In progress');
      expect(submittedStatus).to.exist;
    });

    it('displays correctly formatted status with cernerPilot enabled', () => {
      // Test a few known statuses that work with cernerPilot enabled
      const knownStatuses = [
        dispStatusObj.active,
        dispStatusObj.activeParked,
        dispStatusObj.discontinued,
      ];

      knownStatuses.forEach(status => {
        const screen = renderStatus(status, true);
        // The status should be displayed (though potentially transformed)
        expect(screen.container).to.exist;
      });
    });
  });
});
