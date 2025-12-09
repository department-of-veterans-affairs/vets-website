import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/dom';
import prescriptionsListItem from '../../fixtures/prescriptionsListItem.json';
import MedicationsListCard from '../../../components/MedicationsList/MedicationsListCard';
import reducers from '../../../reducers';

describe('Medication card component', () => {
  const setup = (rx = prescriptionsListItem, initialState = {}) => {
    return renderWithStoreAndRouterV6(<MedicationsListCard rx={rx} />, {
      state: initialState,
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
      orderedDate: '2024-06-16T04:39:11Z',
    };
    const { getByTestId } = setup(rx);
    /* eslint-disable prettier/prettier */
    expect(getByTestId('rx-last-filled-info')).to.have.text('Documented on June 16, 2024');
    expect(getByTestId('rxStatus')).to.have.text('Active: Non-VA');
    expect(getByTestId('non-VA-prescription')).to.have.text('You can’t manage this medication in this online tool.');
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
    expect(getByTestId('rx-last-filled-info')).to.have.text('Documented on: Date not available');
    expect(getByTestId('rxStatus')).to.have.text('Active: Non-VA');
    expect(getByTestId('non-VA-prescription')).to.have.text('You can’t manage this medication in this online tool.');
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
    expect(getByTestId('rx-last-filled-info')).to.have.text('Documented on: Date not available');
    expect(getByTestId('rxStatus')).to.have.text('Active: Non-VA');
    expect(getByTestId('non-VA-prescription')).to.have.text('You can’t manage this medication in this online tool.');
    /* eslint-enable prettier/prettier */
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
});
