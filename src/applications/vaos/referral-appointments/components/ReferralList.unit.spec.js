import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ReferralList from './ReferralList';
import { createReferrals } from '../utils/referrals';

describe('VAOS Component: ReferralList', () => {
  const referrals = createReferrals(2, new Date().toISOString());
  const emptyReferrals = [];

  it('should render the referral list with referrals', () => {
    const screen = render(<ReferralList referrals={referrals} />);

    expect(screen.getByTestId('referrals-heading')).to.exist;
    expect(screen.getByTestId('referrals-text')).to.exist;
    expect(screen.getByRole('list')).to.exist;
    expect(screen.getAllByRole('listitem')).to.have.lengthOf(referrals.length);
  });

  it('should not render the referral list when referrals are empty', () => {
    const { container } = render(<ReferralList referrals={emptyReferrals} />);

    expect(container).to.be.empty;
  });
});
