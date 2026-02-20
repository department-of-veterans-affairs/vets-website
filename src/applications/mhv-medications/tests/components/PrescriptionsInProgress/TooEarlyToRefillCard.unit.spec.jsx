import React from 'react';
import { render, within } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import TooEarlyToRefillCard from '../../../components/PrescriptionsInProgress/TooEarlyToRefillCard';

describe('TooEarlyToRefillCard Component', () => {
  const setup = (tooEarly = []) =>
    render(
      <MemoryRouter>
        <TooEarlyToRefillCard tooEarly={tooEarly} />
      </MemoryRouter>,
    );

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('renders the header and description text', () => {
    const screen = setup();
    expect(screen.getByText('Too early to refill')).to.exist;
    expect(
      screen.getByText(
        /We shipped refills of these medications to you recently/,
      ),
    ).to.exist;
  });

  it('renders no prescription links when array is empty', () => {
    const screen = setup([]);
    const card = within(screen.getByTestId('too-early-section'));
    expect(card.queryByRole('link')).to.be.null;
  });

  it('renders prescription links when array is populated', () => {
    const tooEarlyPrescriptions = [
      {
        prescriptionId: 1,
        prescriptionName: 'Medication A',
        lastUpdated: '2025-01-10T10:00:00Z',
      },
      {
        prescriptionId: 2,
        prescriptionName: 'Medication B',
        lastUpdated: '2025-01-11T10:00:00Z',
      },
    ];
    const screen = setup(tooEarlyPrescriptions);
    const card = within(screen.getByTestId('too-early-section'));

    const medALink = card.getByRole('link', { name: 'Medication A' });
    expect(medALink).to.have.attribute('href', '/my-health/medications/1');

    const medBCard = card.getByRole('link', { name: 'Medication B' });
    expect(medBCard).to.have.attribute('href', '/my-health/medications/2');
  });
});
