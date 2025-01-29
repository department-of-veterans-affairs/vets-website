import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import MileagePage from '../../../../components/submit-flow/pages/MileagePage';

const appointment = require('../../../fixtures/appointment.json');

describe('Mileage page', () => {
  const props = {
    appointment: appointment.data,
    pageIndex: 1,
    setPageIndex: () => {},
    yesNo: {
      mileage: '',
      vehicle: '',
      address: '',
    },
    setYesNo: () => {},
    setIsUnsupportedClaimType: () => {},
  };

  it('should render correctly', async () => {
    const screen = render(<MileagePage {...props} />);

    expect(screen.getByTestId('mileage-test-id')).to.exist;
    expect(screen.findByText('Fort Collins VA Clinic')).to.exist;
    expect($('va-button-pair')).to.exist;

    fireEvent.click(
      $(`va-additional-info[trigger="How do we calculate mileage"]`),
    );
    await waitFor(() => {
      expect(screen.findByText(/We pay round-trip mileage/i)).to.exist;
    });

    fireEvent.click(
      $(`va-additional-info[trigger="If you have other expenses to claim"]`),
    );
    await waitFor(() => {
      expect(screen.findByText(/submit receipts for other expenses/i)).to.exist;
    });
  });

  it('should render an error if no selection made', async () => {
    const screen = render(<MileagePage {...props} />);

    expect(screen.getByTestId('mileage-test-id')).to.exist;
    $('va-button-pair').__events.primaryClick(); // continue
    await waitFor(() => {
      expect(screen.findByText(/You must make a selection/i)).to.exist;
    });
  });
});
