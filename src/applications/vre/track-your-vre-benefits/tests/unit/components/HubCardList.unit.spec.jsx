import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';

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

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
};

describe('HubCardList', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('renders all cards for step 1', () => {
    const { container } = renderWithProviders(<HubCardList step={1} />);
    const links = container.querySelectorAll('va-link');
    expect(links.length).to.equal(3);
    expect(links[2].getAttribute('href')).to.equal('/career-planning');
  });

  it('renders only Career Planning for step 4', () => {
    const { container } = renderWithProviders(<HubCardList step={4} />);
    const links = container.querySelectorAll('va-link');
    expect(links.length).to.equal(1);
    expect(links[0].getAttribute('href')).to.equal('/career-planning');
  });

  it('renders only Career Planning for step 3 when the current step is active', () => {
    const { container, getByText } = renderWithProviders(
      <HubCardList step={3} stateList={[{}, {}, { status: 'ACTIVE' }]} />,
    );
    const links = container.querySelectorAll('va-link');

    expect(links.length).to.equal(1);
    expect(links[0].getAttribute('href')).to.equal('/career-planning');
    getByText(/Initial Evaluation Counselor Meeting/i);
  });

  it('renders all cards for step 3 when the milestone preference is already saved', () => {
    const { container } = renderWithProviders(<HubCardList step={3} />, {
      ch31CaseMilestones: {
        data: { saved: true },
        error: null,
      },
    });
    const links = container.querySelectorAll('va-link');

    expect(links.length).to.equal(3);
  });

  it('renders all cards for step 3 when the current status is not active or pending', () => {
    const { container } = renderWithProviders(
      <HubCardList step={3} stateList={[{}, {}, { status: 'COMPLETED' }]} />,
    );
    const links = container.querySelectorAll('va-link');

    expect(links.length).to.equal(3);
  });

  it('renders a single Career Planning description for step 5', () => {
    const { container, queryByText } = renderWithProviders(
      <HubCardList step={5} />,
    );
    const links = container.querySelectorAll('va-link');
    const paragraphs = container.querySelectorAll('p');

    expect(links.length).to.equal(1);
    expect(paragraphs.length).to.equal(1);
    expect(queryByText(/Initial Evaluation Counselor Meeting/i)).to.equal(null);
  });

  it('returns null for step 6 when the current status is COMPLETE', () => {
    const { container } = renderWithProviders(
      <HubCardList
        step={6}
        stateList={[{}, {}, {}, {}, {}, { status: 'COMPLETE' }]}
      />,
    );

    expect(container.innerHTML.trim()).to.equal('');
  });

  it('returns null for step 6 when the current status is COMPLETED', () => {
    const { container } = renderWithProviders(
      <HubCardList
        step={6}
        stateList={[{}, {}, {}, {}, {}, { status: 'COMPLETED' }]}
      />,
    );

    expect(container.innerHTML.trim()).to.equal('');
  });

  it('renders Career Planning for step 6 when the current status is not complete', () => {
    const { container } = renderWithProviders(
      <HubCardList
        step={6}
        stateList={[{}, {}, {}, {}, {}, { status: 'ACTIVE' }]}
      />,
    );
    const links = container.querySelectorAll('va-link');

    expect(links.length).to.equal(1);
    expect(links[0].getAttribute('href')).to.equal('/career-planning');
  });

  it('pushes the career-planning route when the internal link is clicked', () => {
    const { container, getByTestId } = render(
      <Provider store={makeStore()}>
        <MemoryRouter initialEntries={['/']}>
          <HubCardList step={4} />
          <LocationDisplay />
        </MemoryRouter>
      </Provider>,
    );
    const link = container.querySelector('va-link[href="/career-planning"]');

    userEvent.click(link);

    expect(getByTestId('location-display').textContent).to.equal(
      '/career-planning',
    );
  });

  it('returns null for step 7', () => {
    const { container } = renderWithProviders(<HubCardList step={7} />);
    expect(container.innerHTML.trim()).to.equal('');
  });

  it('returns null for unsupported steps', () => {
    const { container } = renderWithProviders(<HubCardList step={999} />);
    expect(container.innerHTML.trim()).to.equal('');
  });
});
