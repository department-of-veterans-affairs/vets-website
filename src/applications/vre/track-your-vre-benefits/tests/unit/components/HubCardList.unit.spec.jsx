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

  it('returns null for step 7', () => {
    const { container } = renderWithProviders(<HubCardList step={7} />);
    expect(container.innerHTML.trim()).to.equal('');
  });
});
