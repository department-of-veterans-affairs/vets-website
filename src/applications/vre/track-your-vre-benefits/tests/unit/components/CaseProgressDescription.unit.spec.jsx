import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import CaseProgressDescription from '../../../components/CaseProgressDescription';
import * as HubCardListMod from '../../../components/HubCardList';
import * as SelectPreferenceViewMod from '../../../components/SelectPreferenceView';

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

describe('CaseProgressDescription', () => {
  beforeEach(() => {
    sandbox
      .stub(HubCardListMod, 'default')
      .callsFake(() => <div data-testid="hub-card-list" />);
    sandbox
      .stub(SelectPreferenceViewMod, 'default')
      .callsFake(() => <div data-testid="select-preference-view" />);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders step 1 description', () => {
    const { getByText } = renderWithProviders(
      <CaseProgressDescription step={1} />,
    );
    getByText(/received your application for VR&E benefits\./i);
  });

  it('renders step 2 with eligibility link', () => {
    const { container } = renderWithProviders(
      <CaseProgressDescription step={2} />,
    );
    const link = container.querySelector(
      'va-link[href="/careers-employment/your-vre-eligibility"]',
    );
    expect(link).to.exist;
  });

  it('renders step 3 orientation content', () => {
    const { container, getByText } = renderWithProviders(
      <CaseProgressDescription step={3} />,
      { ch31CaseMilestones: undefined },
    );
    getByText(/Orientation Completion/i);
    expect(container.querySelector('va-card')).to.exist;
  });

  it('returns null for unknown step', () => {
    const { container } = renderWithProviders(
      <CaseProgressDescription step={999} />,
    );
    expect(container.innerHTML.trim()).to.equal('');
  });
});
