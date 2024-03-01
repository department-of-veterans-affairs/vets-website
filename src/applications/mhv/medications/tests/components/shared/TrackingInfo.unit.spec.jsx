import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../../reducers';
import TrackingInfo from '../../../components/shared/TrackingInfo';

describe('Medications Breadcrumbs', () => {
  const setup = (carrier = 'ups') => {
    return renderWithStoreAndRouter(
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
                  url: '/my-health/medications/about',
                  label: 'About medications',
                },
                {
                  url: '/my-health/medications/1',
                  label: 'Medications',
                },
              ],
              location: {
                url: `/my-health/medications/prescription/000`,
                label: 'Prescription Name',
              },
            },
          },
        },
        reducers,
        path: '/medications/prescription/000',
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('Find tracking page text', () => {
    const screen = setup();
    const h2 = screen.getByText('Track your package');
    const h3 = screen.getByText('Tracking number');
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
  it('Verify date formatting', () => {
    const screen = setup();
    const shippingDate = screen.getByTestId('shipping-date');
    const shippingDateText = shippingDate.textContent;
    const datePattern = /^(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}$/;
    const isDateFormattedCorrectly = datePattern.test(shippingDateText);
    expect(isDateFormattedCorrectly).to.be.true;
  });
  it('If no carrier is provided, then display trackingNumber', () => {
    const screen = setup('');
    expect(screen.findByText('000'));
  });
});
