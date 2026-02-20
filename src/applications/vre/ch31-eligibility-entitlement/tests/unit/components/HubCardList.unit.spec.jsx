import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import HubCardList from '../../../components/HubCardList';

const sandbox = sinon.createSandbox();

const makeStore = state => {
  const dispatch = sandbox.spy();
  return {
    getState: () => state || {},
    subscribe: () => () => {},
    dispatch,
  };
};

const renderWithProviders = (ui, state = {}) =>
  render(
    <Provider store={makeStore(state)}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>,
  );

describe('HubCardList', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('renders Program Overview + Tracks + Career Planning links for steps 1 and 2 (always all cards)', () => {
    [1, 2].forEach(step => {
      const { container, getByText, unmount } = renderWithProviders(
        <HubCardList step={step} />,
        {}, // no ch31CaseMilestones in store
      );

      // Host elements only (shadow components)
      const wrapper = container.querySelector(
        '.vads-u-margin-top--2.vads-u-margin-bottom--2',
      );
      expect(wrapper).to.exist;

      const vaCard = container.querySelector('va-card');
      expect(vaCard).to.exist;

      // Heading text
      getByText('Preparing for the next steps');

      // Three links
      const links = container.querySelectorAll('va-link');
      expect(links.length).to.equal(3);

      // Assert link texts and hrefs
      expect(links[0].getAttribute('text')).to.equal('Program Overview');
      expect(links[0].getAttribute('href')).to.equal(
        'https://www.va.gov/careers-employment/vocational-rehabilitation',
      );

      expect(links[1].getAttribute('text')).to.equal(
        'VR&E Support-and-Services Tracks',
      );
      expect(links[1].getAttribute('href')).to.equal(
        'https://www.va.gov/careers-employment/vocational-rehabilitation/programs',
      );

      expect(links[2].getAttribute('text')).to.equal('Career Planning');
      expect(links[2].getAttribute('href')).to.equal('/career-planning');

      unmount();
    });
  });

  it('step 3: renders only Career Planning when status is ACTIVE and no milestones', () => {
    const stateList = [{}, {}, { status: 'ACTIVE' }];

    const { container, getByText } = renderWithProviders(
      <HubCardList step={3} stateList={stateList} />,
      {},
    );

    const links = container.querySelectorAll('va-link');
    expect(links.length).to.equal(1);
    expect(links[0].getAttribute('text')).to.equal('Career Planning');
    expect(links[0].getAttribute('href')).to.equal('/career-planning');

    // Step <= 4 includes helper text
    getByText(/Step 4 on the Progress Tracker/i);
  });

  it('step 3: renders only Career Planning when status is PENDING and no milestones', () => {
    const stateList = [{}, {}, { status: 'PENDING' }];

    const { container, getByText } = renderWithProviders(
      <HubCardList step={3} stateList={stateList} />,
      {},
    );

    const links = container.querySelectorAll('va-link');
    expect(links.length).to.equal(1);
    expect(links[0].getAttribute('text')).to.equal('Career Planning');
    expect(links[0].getAttribute('href')).to.equal('/career-planning');

    getByText(/Step 4 on the Progress Tracker/i);
  });

  it('step 3: renders all three cards when milestones data exists, even if ACTIVE', () => {
    const stateList = [{}, {}, { status: 'ACTIVE' }];

    const { container, getByText } = renderWithProviders(
      <HubCardList step={3} stateList={stateList} />,
      { ch31CaseMilestones: { data: { ok: true }, error: null } },
    );

    getByText('Preparing for the next steps');

    const links = container.querySelectorAll('va-link');
    expect(links.length).to.equal(3);
    expect(links[0].getAttribute('text')).to.equal('Program Overview');
    expect(links[1].getAttribute('text')).to.equal(
      'VR&E Support-and-Services Tracks',
    );
    expect(links[2].getAttribute('text')).to.equal('Career Planning');
  });

  it('renders only Career Planning link for step 4', () => {
    const { container, getByText } = renderWithProviders(
      <HubCardList step={4} />,
      {},
    );

    getByText('Preparing for the next steps');

    const links = container.querySelectorAll('va-link');
    expect(links.length).to.equal(1);
    expect(links[0].getAttribute('text')).to.equal('Career Planning');
    expect(links[0].getAttribute('href')).to.equal('/career-planning');

    // Step <= 4 includes helper text
    getByText(/Step 4 on the Progress Tracker/i);
  });

  it('renders only Career Planning link for step 5 (no Step 4 helper text)', () => {
    const { container, queryByText } = renderWithProviders(
      <HubCardList step={5} />,
      {},
    );

    const links = container.querySelectorAll('va-link');
    expect(links.length).to.equal(1);
    expect(links[0].getAttribute('text')).to.equal('Career Planning');
    expect(links[0].getAttribute('href')).to.equal('/career-planning');

    expect(queryByText(/Step 4 on the Progress Tracker/i)).to.be.null;
  });

  it('renders Career Planning for step 6 when step 6 is NOT complete', () => {
    const stateList = [
      {}, // 1
      {}, // 2
      {}, // 3
      {}, // 4
      {}, // 5
      { status: 'ACTIVE' }, // 6
    ];

    const { container } = renderWithProviders(
      <HubCardList step={6} stateList={stateList} />,
      {},
    );

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

    const { container } = renderWithProviders(
      <HubCardList step={6} stateList={stateList} />,
      {},
    );

    expect(container.innerHTML.trim()).to.equal('');
  });

  it('returns null for step 7 (never shows any cards)', () => {
    const { container } = renderWithProviders(<HubCardList step={7} />, {});
    expect(container.innerHTML.trim()).to.equal('');
  });

  it('returns null when no cards are available (unknown step)', () => {
    const { container } = renderWithProviders(<HubCardList step={999} />, {});
    expect(container.innerHTML.trim()).to.equal('');
  });
});
