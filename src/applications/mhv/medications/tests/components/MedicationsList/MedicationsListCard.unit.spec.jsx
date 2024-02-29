import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/dom';
import prescriptionsListItem from '../../fixtures/prescriptionsListItem.json';
import MedicationsListCard from '../../../components/MedicationsList/MedicationsListCard';
import reducers from '../../../reducers';

describe('Medication card component', () => {
  const setup = (rx = prescriptionsListItem) => {
    return renderWithStoreAndRouter(<MedicationsListCard rx={rx} />, {
      path: '/',
      state: {},
      reducers,
    });
  };

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
    if (prescriptionsListItem.dispStatus === 'Active: Refill in Process') {
      expect(screen.getByText('Active: Refill in process')).to.exist;
    } else {
      expect(screen.getByText(prescriptionsListItem.dispStatus)).to.exist;
    }
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
});
