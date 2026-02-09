import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import HubCardList from '../../../components/HubCardList';

describe('HubCardList', () => {
  it('renders Program Overview + Tracks + Career Planning links for steps 1-3', () => {
    [1, 2, 3].forEach(step => {
      const { container, getByText, unmount } = render(
        <HubCardList step={step} />,
      );

      const wrapper = container.querySelector(
        '.vads-u-margin-top--2.vads-u-margin-bottom--2',
      );
      expect(wrapper).to.exist;

      const vaCard = container.querySelector('va-card');
      expect(vaCard).to.exist;
      expect(vaCard.hasAttribute('background')).to.equal(true);
      expect(vaCard.getAttribute('icon-name')).to.equal('');

      getByText('Preparing for the next steps');

      const links = container.querySelectorAll('va-link');
      expect(links.length).to.equal(3);
      expect(links[0].getAttribute('text')).to.equal('Program Overview');
      expect(links[0].getAttribute('href')).to.equal('/NeedLinkURL');
      expect(links[1].getAttribute('text')).to.equal(
        'VR&E Support-and-Services Tracks',
      );
      expect(links[1].getAttribute('href')).to.equal(
        '/orientation-tools-and-resources',
      );
      expect(links[2].getAttribute('text')).to.equal('Career Planning');
      expect(links[2].getAttribute('href')).to.equal(
        '/career-exploration-and-planning',
      );

      unmount();
    });
  });

  it('renders only Career Planning link for step 4', () => {
    const { container, getByText } = render(<HubCardList step={4} />);

    getByText('Preparing for the next steps');

    const links = container.querySelectorAll('va-link');
    expect(links.length).to.equal(1);

    expect(links[0].getAttribute('text')).to.equal('Career Planning');
    expect(links[0].getAttribute('href')).to.equal(
      '/career-exploration-and-planning',
    );

    getByText(/prepare you for/i);
    getByText(/Initial Evaluation Counselor Meeting/i);
  });

  it('renders only Career Planning link for step 5', () => {
    const { container, getByText } = render(<HubCardList step={5} />);

    getByText('Preparing for the next steps');

    const links = container.querySelectorAll('va-link');
    expect(links.length).to.equal(1);

    expect(links[0].getAttribute('text')).to.equal('Career Planning');
    expect(links[0].getAttribute('href')).to.equal(
      '/career-exploration-and-planning',
    );
  });

  it('renders Career Planning for step 6 when step 6 is NOT complete', () => {
    // stateList index 5 = step 6
    const stateList = [
      {}, // step 1
      {}, // step 2
      {}, // step 3
      {}, // step 4
      {}, // step 5
      { status: 'ACTIVE' }, // step 6 NOT complete
    ];

    const { container, getByText } = render(
      <HubCardList step={6} stateList={stateList} />,
    );

    getByText('Preparing for the next steps');

    const links = container.querySelectorAll('va-link');
    expect(links.length).to.equal(1);
    expect(links[0].getAttribute('text')).to.equal('Career Planning');
  });

  it('returns null for step 6 when step 6 is complete', () => {
    const stateList = [
      {},
      {},
      {},
      {},
      {},
      { status: 'COMPLETED' }, // step 6 complete => no cards
    ];

    const { container } = render(
      <HubCardList step={6} stateList={stateList} />,
    );
    expect(container.innerHTML).to.equal('');
  });

  it('returns null for step 7 (never shows any cards)', () => {
    const { container } = render(<HubCardList step={7} />);
    expect(container.innerHTML).to.equal('');
  });

  it('returns null when no cards are available', () => {
    const { container } = render(<HubCardList step={999} />);
    expect(container.innerHTML).to.equal('');
  });
});
