import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import StatusDropdown from '../../../components/shared/StatusDropdown';
import { dispStatusObj } from '../../../util/constants';

describe('component that displays Status', () => {
  const renderStatus = status => {
    return render(<StatusDropdown status={status} />);
  };
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
