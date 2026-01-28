import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import HubCardList from '../../../components/HubCardList';

describe('HubCardList', () => {
  it('renders Orientation + Career Planning links for steps 1-3', () => {
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
      expect(links.length).to.equal(2);

      expect(links[0].getAttribute('text')).to.equal(
        'Orientation Tools and Resources',
      );
      expect(links[0].getAttribute('href')).to.equal(
        '/orientation-tools-and-resources',
      );

      expect(links[1].getAttribute('text')).to.equal('Career Planning');
      expect(links[1].getAttribute('href')).to.equal(
        '/career-exploration-and-planning',
      );

      unmount();
    });
  });

  it('renders Scheduling + Career Planning links for step 4', () => {
    const { container, getByText } = render(<HubCardList step={4} />);

    getByText('Preparing for the next steps');

    const links = container.querySelectorAll('va-link');
    expect(links.length).to.equal(2);

    expect(links[0].getAttribute('text')).to.equal('Scheduling');
    expect(links[0].getAttribute('href')).to.equal('/my-case-management-hub');

    expect(links[1].getAttribute('text')).to.equal('Career Planning');
    expect(links[1].getAttribute('href')).to.equal(
      '/career-exploration-and-planning',
    );
  });

  it('renders only Career Planning link for steps 5-7', () => {
    [5, 6, 7].forEach(step => {
      const { container, getByText, unmount } = render(
        <HubCardList step={step} />,
      );

      getByText('Preparing for the next steps');

      const links = container.querySelectorAll('va-link');
      expect(links.length).to.equal(1);

      expect(links[0].getAttribute('text')).to.equal('Career Planning');
      expect(links[0].getAttribute('href')).to.equal(
        '/career-exploration-and-planning',
      );

      unmount();
    });
  });

  it('returns null when no cards are available', () => {
    const { container } = render(<HubCardList step={999} />);
    expect(container.innerHTML).to.equal('');
  });
});
