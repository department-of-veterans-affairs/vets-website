import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import VehiclePage from '../../../../components/submit-flow/pages/VehiclePage';

describe('Vehicle page', () => {
  const setPageIndex = sinon.spy();
  const setIsUnsupportedClaimType = sinon.spy();

  const props = {
    pageIndex: 2,
    setPageIndex,
    yesNo: {
      mileage: 'yes',
      vehicle: '',
      address: '',
    },
    setYesNo: () => {},
    setIsUnsupportedClaimType,
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

  it('should render an error selection is "no"', async () => {
    const screen = render(
      <VehiclePage {...props} yesNo={{ ...props.yesNo, vehicle: 'no' }} />,
    );
    $('va-button-pair').__events.primaryClick(); // continue

    expect(setIsUnsupportedClaimType.calledWith(true)).to.be.true;
    await waitFor(() => {
      expect(
        screen.findByText(
          /We can’t file this type of travel reimbursement claim in this tool at this time/i,
        ),
      ).to.exist;
    });
  });

  it('should move on to the next step if selection is "yes"', () => {
    render(
      <VehiclePage {...props} yesNo={{ ...props.yesNo, vehicle: 'yes' }} />,
    );
    $('va-button-pair').__events.primaryClick(); // continue

    expect(setIsUnsupportedClaimType.calledWith(false)).to.be.true;
    expect(setPageIndex.calledWith(3)).to.be.true;
  });

  it('should move back a step', () => {
    render(<VehiclePage {...props} />);
    $('va-button-pair').__events.secondaryClick(); // back

    expect(setPageIndex.calledWith(1)).to.be.true;
  });
});
