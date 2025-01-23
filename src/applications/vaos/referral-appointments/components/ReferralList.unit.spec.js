import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ReferralList from './ReferralList';
import { createReferrals } from '../utils/referrals';

describe('VAOS Component: ReferralList', () => {
  const referrals = createReferrals(2, '2024-11-27');
  const emptyReferrals = [];

  it('should render the referral list with referrals', () => {
    const screen = render(
      <ReferralList referrals={referrals} referralsError={false} />,
    );

    expect(screen.getByTestId('referral-list')).to.exist;
    expect(screen.getByRole('list')).to.exist;
    expect(screen.getAllByRole('listitem')).to.have.lengthOf(referrals.length);
  });

  it('should render the no referral content when referrals are empty', () => {
    const screen = render(
      <ReferralList referrals={emptyReferrals} referralsError={false} />,
    );

    expect(screen.getByTestId('no-referral-content')).to.exist;
  });
  it('should render an error when there is a referral error', () => {
    const screen = render(
      <ReferralList referrals={emptyReferrals} referralsError />,
    );

    expect(screen.getByText('We’re sorry. We’ve run into a problem')).to.exist;
  });
});
