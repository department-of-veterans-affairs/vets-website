import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import HubCardList from '../../../components/HubCardList';

const PROGRAM_OVERVIEW_URL =
  'https://www.va.gov/careers-employment/vocational-rehabilitation/';
const SUPPORT_TRACKS_URL =
  'https://www.va.gov/careers-employment/vocational-rehabilitation/programs/';

describe('HubCardList', () => {
  it('renders Program Overview + Tracks + Career Planning links for steps 1-2', () => {
    [1, 2].forEach(step => {
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
      expect(links[0].getAttribute('href')).to.equal(PROGRAM_OVERVIEW_URL);

      expect(links[1].getAttribute('text')).to.equal(
        'VR&E Support-and-Services Tracks',
      );
      expect(links[1].getAttribute('href')).to.equal(SUPPORT_TRACKS_URL);

      expect(links[2].getAttribute('text')).to.equal('Career Planning');
      expect(links[2].getAttribute('href')).to.equal(
        '/track-your-vre-benefits/vre-benefit-status/career-planning',
      );

      unmount();
    });
  });

  it('renders Program Overview + Tracks + Career Planning links for step 3 when NOT active/complete', () => {
    // step 3 index = 2
    const stateList = [{}, {}, { status: 'PENDING' }];

    const { container, getByText } = render(
      <HubCardList step={3} stateList={stateList} />,
    );

    getByText('Preparing for the next steps');

    const links = container.querySelectorAll('va-link');
    expect(links.length).to.equal(3);

    expect(links[0].getAttribute('text')).to.equal('Program Overview');
    expect(links[0].getAttribute('href')).to.equal(PROGRAM_OVERVIEW_URL);

    expect(links[1].getAttribute('text')).to.equal(
      'VR&E Support-and-Services Tracks',
    );
    expect(links[1].getAttribute('href')).to.equal(SUPPORT_TRACKS_URL);

    expect(links[2].getAttribute('text')).to.equal('Career Planning');
    expect(links[2].getAttribute('href')).to.equal(
      '/track-your-vre-benefits/vre-benefit-status/career-planning',
    );
  });

  it('renders only Career Planning link for step 4', () => {
    const { container, getByText } = render(<HubCardList step={4} />);

    getByText('Preparing for the next steps');

    const links = container.querySelectorAll('va-link');
    expect(links.length).to.equal(1);

    expect(links[0].getAttribute('text')).to.equal('Career Planning');
    expect(links[0].getAttribute('href')).to.equal(
      '/track-your-vre-benefits/vre-benefit-status/career-planning',
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
      '/track-your-vre-benefits/vre-benefit-status/career-planning',
    );
  });

  it('renders Career Planning for step 6 when step 6 is NOT complete', () => {
    const stateList = [
      {},
      {},
      {},
      {},
      {},
      { status: 'ACTIVE' }, // step 6 NOT complete
    ];

    const { container, getByText } = render(
      <HubCardList step={6} stateList={stateList} />,
    );

    getByText('Preparing for the next steps');

    const links = container.querySelectorAll('va-link');
    expect(links.length).to.equal(1);
    expect(links[0].getAttribute('text')).to.equal('Career Planning');
    expect(links[0].getAttribute('href')).to.equal(
      '/track-your-vre-benefits/vre-benefit-status/career-planning',
    );
  });

  it('returns null for step 6 when step 6 is complete', () => {
    const stateList = [{}, {}, {}, {}, {}, { status: 'COMPLETED' }];

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
