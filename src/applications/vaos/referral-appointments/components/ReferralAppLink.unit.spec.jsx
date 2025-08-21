import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as ReactRedux from 'react-redux';
import * as PilotHook from '../hooks/useIsInCCPilot';
import ReferralAppLink from './ReferralAppLink';
import {
  renderWithStoreAndRouter,
  createTestStore,
} from '../../tests/mocks/setup';

describe('<ReferralAppLink />', () => {
  const mockLinkText = 'Schedule your appointment';
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(PilotHook, 'useIsInCCPilot').returns({ isInCCPilot: true });
    sandbox.stub(ReactRedux, 'useSelector').callsFake(() => 'appointments');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders a link when isInCCPilot is true', () => {
    const store = createTestStore();
    const screen = renderWithStoreAndRouter(
      <ReferralAppLink linkText="Schedule your appointment" id="abc-123" />,
      store,
    );
    const link = screen.getByText('Schedule your appointment');
    expect(link.tagName).to.equal('A');
    expect(link.getAttribute('href')).to.equal('/');
  });

  it('renders a button when isInCCPilot is false', () => {
    PilotHook.useIsInCCPilot.returns({ isInCCPilot: false });

    const store = createTestStore();
    const screen = renderWithStoreAndRouter(
      <ReferralAppLink linkText="Schedule your appointment" id="abc-123" />,
      store,
    );

    const button = screen.getByRole('button', { name: mockLinkText });
    expect(button.tagName).to.equal('BUTTON');
  });

  it('does not render on /pending page', () => {
    const store = createTestStore();
    const screen = renderWithStoreAndRouter(
      <ReferralAppLink linkText="Schedule your appointment" id="abc-123" />,
      {
        store,
        path: '/pending',
      },
    );

    expect(screen.queryByText(mockLinkText)).to.be.null;
  });

  it('does not render on /past page', () => {
    const store = createTestStore();
    const screen = renderWithStoreAndRouter(
      <ReferralAppLink linkText="Schedule your appointment" id="abc-123" />,
      {
        store,
        path: '/past',
      },
    );

    expect(screen.queryByText(mockLinkText)).to.be.null;
  });
});
