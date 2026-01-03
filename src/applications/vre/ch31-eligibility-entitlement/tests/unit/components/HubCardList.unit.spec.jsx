import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import HubCardList from '../../../components/HubCardList';

describe('HubCardList', () => {
  it('renders Orientation + Career Planning cards for steps 1-3', () => {
    [1, 2, 3].forEach(step => {
      const { container, getByText, unmount } = render(
        <HubCardList step={step} />,
      );

      const list = container.querySelector('.hub-card-list');
      expect(list).to.exist;

      const cards = container.querySelectorAll('.hub-card');
      expect(cards.length).to.equal(2);

      getByText('Orientation Tools and Resources');
      getByText('Career Planning');

      expect(container.querySelector('va-card[icon-name="location_city"]')).to
        .exist;
      expect(container.querySelector('va-card[icon-name="work"]')).to.exist;

      unmount();
    });
  });

  it('renders Scheduling + Career Planning cards for step 4', () => {
    const { container, getByText } = render(<HubCardList step={4} />);

    const cards = container.querySelectorAll('.hub-card');
    expect(cards.length).to.equal(2);

    getByText('Scheduling');
    getByText('Career Planning');

    expect(container.querySelector('va-card[icon-name="event"]')).to.exist;
    expect(container.querySelector('va-card[icon-name="work"]')).to.exist;
  });

  it('renders only Career Planning card for steps 5-7', () => {
    [5, 6, 7].forEach(step => {
      const { container, getByText, unmount } = render(
        <HubCardList step={step} />,
      );

      const cards = container.querySelectorAll('.hub-card');
      expect(cards.length).to.equal(1);

      getByText('Career Planning');
      expect(container.querySelector('va-card[icon-name="work"]')).to.exist;

      unmount();
    });
  });

  it('returns null when no cards are available', () => {
    const { container } = render(<HubCardList step={999} />);
    expect(container.querySelector('.hub-card-list')).to.equal(null);
  });
});
