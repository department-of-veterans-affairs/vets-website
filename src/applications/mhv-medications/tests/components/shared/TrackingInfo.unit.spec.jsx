import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../../reducers';
import TrackingInfo from '../../../components/shared/TrackingInfo';
import { medicationsUrls } from '../../../util/constants';

describe('Medications Breadcrumbs', () => {
  const setup = (carrier = 'ups') => {
    return renderWithStoreAndRouterV6(
      <TrackingInfo
        carrier={carrier}
        trackingNumber="000"
        completeDateTime={1649971200000}
        prescriptionName="Prescription Name"
      />,
      {
        initialState: {
          rx: {
            breadcrumbs: {
              list: [
                {
                  url: `${medicationsUrls.MEDICATIONS_ABOUT}`,
                  label: 'About medications',
                },
                {
                  url: `${medicationsUrls.MEDICATIONS_URL}/1`,
                  label: 'Medications',
                },
              ],
              location: {
                url: `${medicationsUrls.PRESCRIPTION_DETAILS}/000`,
                label: 'Prescription Name',
              },
            },
          },
        },
        reducers,
        initialEntries: ['/medications/prescription/000'],
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('Find tracking page text', () => {
    const screen = setup();
    const h2 = screen.getByText(
      'Track the shipment of your most recent refill',
    );
    const h3 = screen.getByText('Tracking number:');
    const trackingNumber = screen.getByTestId('tracking-number');
    expect(h2).to.exist;
    expect(h3).to.exist;
    expect(trackingNumber).to.exist;
  });
  it('Verify prescription name', () => {
    const screen = setup();
    const rxName = screen.getByTestId('rx-name');
    expect(rxName).to.exist;
  });
  it('If no carrier is provided, then display trackingNumber', () => {
    const screen = setup('');
    expect(screen.findByText('000'));
  });
});
