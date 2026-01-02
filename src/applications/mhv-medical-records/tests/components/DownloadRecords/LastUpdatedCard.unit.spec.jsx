import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import LastUpdatedCard from '../../../components/DownloadRecords/LastUpdatedCard';

describe('LastUpdatedCard', () => {
  it('renders nothing when lastSuccessfulUpdate is null', () => {
    const { container } = render(
      <LastUpdatedCard lastSuccessfulUpdate={null} />,
    );

    expect(container.querySelector('va-card')).to.not.exist;
  });

  it('renders the card with correct date and time', () => {
    const lastSuccessfulUpdate = {
      date: 'December 25, 2025',
      time: '10:30 a.m.',
    };

    const { getByTestId, getByText } = render(
      <LastUpdatedCard lastSuccessfulUpdate={lastSuccessfulUpdate} />,
    );

    expect(getByTestId('new-records-last-updated')).to.exist;
    expect(getByText(/Records in these reports last updated at/)).to.exist;
    expect(getByText(/10:30 a.m./)).to.exist;
    expect(getByText(/December 25, 2025/)).to.exist;
  });

  it('renders the card with correct attributes', () => {
    const lastSuccessfulUpdate = {
      date: 'January 1, 2025',
      time: '9:00 a.m.',
    };

    const { getByTestId } = render(
      <LastUpdatedCard lastSuccessfulUpdate={lastSuccessfulUpdate} />,
    );

    const card = getByTestId('new-records-last-updated');
    expect(card.tagName.toLowerCase()).to.equal('va-card');
    expect(card.hasAttribute('background')).to.be.true;
    expect(card.getAttribute('aria-live')).to.equal('polite');
  });
});
