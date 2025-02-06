import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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
  );

  const handleClick = sinon.spy();

  let screen = null;

  beforeEach(() => {
    screen = render(
      <PendingReferralCard referral={referral} handleClick={handleClick} />,
    );
  });

  it('should render ListItem component', () => {
    expect(screen.getByTestId('appointment-list-item')).to.exist;
  });

  it('should display the correct type of care name', () => {
    expect(screen.getByTestId('typeOfCare')).to.exist;
  });
  it('should display the correct number of appointments and expiration date', () => {
    expect(
      screen.getByText(
        'You have been approved for 1 appointment. All appointments for this referral must be scheduled by July 1, 2025.',
      ),
    ).to.exist;
  });
  // TODO: figure out how to test the click event
  it.skip('should call handleClick when the link is clicked', () => {
    const link = screen.getByTestId('appointment-list-item');
    fireEvent.click(link);
    expect(handleClick.calledOnce).to.be.true;
    expect(handleClick.calledWith(sinon.match.any, referral.UUID)).to.be.true;
  });
});
