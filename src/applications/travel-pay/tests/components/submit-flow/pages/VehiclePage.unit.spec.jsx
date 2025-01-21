import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import VehiclePage from '../../../../components/submit-flow/pages/VehiclePage';

describe('Vehicle page', () => {
  const props = {
    pageIndex: 2,
    setPageIndex: () => {},
    yesNo: {
      mileage: 'yes',
      vehicle: '',
      address: '',
    },
    setYesNo: () => {},
    setIsUnsupportedClaimType: () => {},
  };

  it('should render correctly', async () => {
    const screen = render(<VehiclePage {...props} />);

    expect(screen.getByTestId('vehicle-test-id')).to.exist;
    expect(screen.findByText('Did you travel in your own vehicle?')).to.exist;
    expect($('va-button-pair')).to.exist;

    fireEvent.click(
      $(
        `va-additional-info[trigger="If you didn't travel in your own vehicle"]`,
      ),
    );
    await waitFor(() => {
      expect(
        screen.findByText(
          / bus, train, taxi, or other authorized public transportation/i,
        ),
      ).to.exist;
    });
  });

  it('should render an error if no selection made', async () => {
    const screen = render(<VehiclePage {...props} />);

    expect(screen.getByTestId('vehicle-test-id')).to.exist;
    $('va-button-pair').__events.primaryClick(); // continue
    await waitFor(() => {
      expect(screen.findByText(/You must make a selection/i)).to.exist;
    });
  });
});
