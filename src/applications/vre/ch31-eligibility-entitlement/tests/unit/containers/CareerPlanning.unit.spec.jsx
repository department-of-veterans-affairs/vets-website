/* eslint-disable camelcase */
import React from 'react';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { MemoryRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import CareerPlanning from '../../../containers/CareerPlanning';

const sandbox = sinon.createSandbox();

const makeStore = state => {
  const dispatch = sandbox.spy();
  return {
    getState: () => state,
    subscribe: () => () => {},
    dispatch,
  };
};

const renderPage = state =>
  render(
    <Provider store={makeStore(state)}>
      <MemoryRouter
        initialEntries={[
          '/careers-employment/your-vre-eligibility/career-planning',
        ]}
      >
        <Route path="/careers-employment/your-vre-eligibility/career-planning">
          <CareerPlanning />
        </Route>
      </MemoryRouter>
    </Provider>,
  );

const makeState = ({ toggleOn = true } = {}) => ({
  featureToggles: {
    loading: false,
    vre_eligibility_status_phase_2_updates: toggleOn,
  },
});

describe('<CareerPlanning>', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('renders the main heading and intro paragraph', () => {
    const { getByRole, getByText } = renderPage(makeState());
    getByRole('heading', { name: /Career Planning/i });
    getByText(
      /Explore career resources and tools to help you achieve your employment goals/i,
    );
  });

  it('renders unavailable message when feature toggle is off', () => {
    const { getByText } = renderPage(makeState({ toggleOn: false }));
    getByText(/This page isn't available right now/i);
  });
});
