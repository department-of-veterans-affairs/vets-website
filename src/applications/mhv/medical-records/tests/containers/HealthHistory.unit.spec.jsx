import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import HealthHistory from '../../containers/HealthHistory';

describe('Vaccine container', () => {
  const setup = () => {
    return renderWithStoreAndRouter(<HealthHistory />, {
      path: '/health-history',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen.getByText('Health history', { exact: true })).to.exist;
  });

  it('displays links to different sections', async () => {
    const screen = setup();
    const sectionLinks = await screen.getAllByTestId('section-link');
    expect(sectionLinks.length).to.equal(5);
  });
});
