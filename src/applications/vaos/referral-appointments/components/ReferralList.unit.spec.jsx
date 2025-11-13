import React from 'react';
import { expect } from 'chai';
import { format, subDays, addDays } from 'date-fns';
import { createServiceMap } from '@department-of-veterans-affairs/platform-monitoring';
import { renderWithStoreAndRouter } from '../../tests/mocks/setup';
import ReferralList from './ReferralList';
import MockReferralListResponse from '../../tests/fixtures/MockReferralListResponse';

describe('VAOS Component: ReferralList', () => {
  const referralsResponse = new MockReferralListResponse({
    numberOfReferrals: 2,
  }).toJSON();
  const referrals = referralsResponse.data;
  const emptyReferrals = [];

  it('should render the referral list with referrals', () => {
    const initialState = {
      scheduledDowntime: {
        globalDowntime: null,
        isReady: true,
        isPending: false,
        serviceMap: new Map(),
        dismissedDowntimeWarnings: [],
      },
    };
    const screen = renderWithStoreAndRouter(
      <ReferralList referrals={referrals} referralsError={false} />,
      { initialState },
    );

    expect(screen.getByTestId('referral-list')).to.exist;
    expect(screen.getByRole('list')).to.exist;
    expect(screen.getAllByRole('listitem')).to.have.lengthOf(referrals.length);
  });

  it('should render the no referral content when referrals are empty', () => {
    const initialState = {
      scheduledDowntime: {
        globalDowntime: null,
        isReady: true,
        isPending: false,
        serviceMap: new Map(),
        dismissedDowntimeWarnings: [],
      },
    };
    const screen = renderWithStoreAndRouter(
      <ReferralList referrals={emptyReferrals} referralsError={false} />,
      { initialState },
    );

    expect(screen.getByTestId('no-referral-content')).to.exist;
  });
  it('should render an error when there is a referral error', () => {
    const initialState = {
      scheduledDowntime: {
        globalDowntime: null,
        isReady: true,
        isPending: false,
        serviceMap: new Map(),
        dismissedDowntimeWarnings: [],
      },
    };
    const screen = renderWithStoreAndRouter(
      <ReferralList referrals={emptyReferrals} referralsError />,
      { initialState },
    );

    expect(screen.getByText('We’re sorry. We’ve run into a problem')).to.exist;
  });

  it('should render downtime notification when community care service is down', () => {
    const serviceMap = createServiceMap([
      {
        attributes: {
          externalService: 'community_care_ds',
          status: 'down',
          startTime: format(subDays(new Date(), 1), "yyyy-LL-dd'T'HH:mm:ss"),
          endTime: format(addDays(new Date(), 1), "yyyy-LL-dd'T'HH:mm:ss"),
        },
      },
    ]);

    const initialState = {
      scheduledDowntime: {
        globalDowntime: null,
        isReady: true,
        isPending: false,
        serviceMap,
        dismissedDowntimeWarnings: [],
      },
    };
    const screen = renderWithStoreAndRouter(
      <ReferralList referrals={emptyReferrals} referralsError={false} />,
      { initialState },
    );

    expect(
      screen.getByText('We’re working on community care referrals right now'),
    ).to.exist;
    expect(
      screen.getByText(
        'You can’t access community care referrals right now. Check back soon, or call your provider for help scheduling an appointment.',
      ),
    ).to.exist;
  });
});
