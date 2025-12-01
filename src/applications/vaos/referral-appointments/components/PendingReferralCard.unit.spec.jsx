import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import MockDate from 'mockdate';
import sinon from 'sinon';
import PendingReferralCard from './PendingReferralCard';
import { createReferralById } from '../utils/referrals';

describe('VAOS Component: PendingReferralCard', () => {
  beforeEach(() => {
    MockDate.set('2025-01-01');
  });
  afterEach(() => {
    MockDate.reset();
  });

  const referral = createReferralById(
    '2025-01-01',
    'add2f0f4-a1ea-4dea-a504-a54ab57c68',
  ).attributes;

  const handleClick = sinon.spy();

  let screen = null;

  it('should render ListItem component', () => {
    screen = render(
      <PendingReferralCard referral={referral} handleClick={handleClick} />,
    );
    expect(screen.getByTestId('appointment-list-item')).to.exist;
  });

  it('should display the correct type of care name', () => {
    screen = render(
      <PendingReferralCard referral={referral} handleClick={handleClick} />,
    );
    expect(screen.getByTestId('typeOfCare')).to.exist;
  });
  it('should display the correct number of appointments and expiration date', () => {
    screen = render(
      <PendingReferralCard referral={referral} handleClick={handleClick} />,
    );
    expect(
      screen.getByText(
        'You must schedule all appointments for this referral by July 1, 2025.',
      ),
    ).to.exist;
  });
});
