import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import reducers from '../../../reducers';
import prescriptionsListItem from '../../fixtures/prescriptionsListItem.json';
import ExtraDetails from '../../../components/shared/ExtraDetails';
import { dateFormat } from '../../../util/helpers';
import { DATETIME_FORMATS, dispStatusObj } from '../../../util/constants';

describe('Medications List Card Extra Details', () => {
  const prescription = prescriptionsListItem;
  const setup = (rx = prescription, initialState = {}) => {
    const featureToggleReducer = (state = {}) => state;
    const testReducers = {
      ...reducers,
      featureToggles: featureToggleReducer,
    };

    const state = {
      ...initialState,
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingMedicationsRenewalRequest]: true,
        ...(initialState.featureToggles || {}),
      },
    };

    return renderWithStoreAndRouterV6(<ExtraDetails {...rx} />, {
      initialState: state,
      reducers: testReducers,
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays error message when status is unknown', async () => {
    const screen = setup({
      ...prescription,
      dispStatus: dispStatusObj.unknown,
    });
    expect(await screen.findByTestId('unknown')).to.contain.text(
      'We’re sorry. There’s a problem with our system. You can’t manage this prescription online right now.',
    );
  });

  it('displays refill in process content correctly', async () => {
    const screen = setup({
      ...prescription,
      dispStatus: dispStatusObj.refillinprocess,
    });
    const expectedDate = dateFormat(
      prescription.refillDate,
      DATETIME_FORMATS.longMonthDate,
    );
    expect(
      await screen.findByTestId('rx-refillinprocess-info'),
    ).to.contain.text(
      `We expect to fill this prescription on ${expectedDate}.`,
    );
  });

  it('displays submitted content correctly', async () => {
    const screen = setup({
      ...prescription,
      dispStatus: dispStatusObj.submitted,
    });
    const expectedDate = dateFormat(
      prescription.refillSubmitDate,
      DATETIME_FORMATS.longMonthDate,
    );
    expect(
      await screen.findByTestId('submitted-refill-request'),
    ).to.contain.text(
      `We got your request on ${expectedDate}. Check back for updates.`,
    );
  });

  it('displays discontinued content correctly', async () => {
    const screen = setup({
      ...prescription,
      dispStatus: dispStatusObj.discontinued,
    });
    expect(await screen.findByTestId('discontinued')).to.contain.text(
      'You can’t refill this prescription. If you need more, send a message to your care team.',
    );
  });

  it('displays active parked content correctly', async () => {
    const screen = setup({
      ...prescription,
      dispStatus: dispStatusObj.activeParked,
    });
    expect(await screen.findByTestId('active-parked')).to.contain.text(
      'You can request this prescription when you need it.',
    );
  });

  it('displays transferred content correctly', async () => {
    const screen = setup({
      ...prescription,
      dispStatus: dispStatusObj.transferred,
    });
    expect(await screen.findByTestId('transferred')).to.contain.text(
      'To manage this prescription, go to our My VA Health portal.',
    );
  });

  it('displays on-hold content correctly', async () => {
    const screen = setup({
      ...prescription,
      dispStatus: dispStatusObj.onHold,
    });
    expect(await screen.findByTestId('active-onHold')).to.contain.text(
      'You can’t refill this prescription online right now. If you need a refill, call your VA pharmacy',
    );
  });

  it('displays active with no refills content correctly', async () => {
    const screen = setup({
      ...prescription,
      dispStatus: dispStatusObj.active,
      refillRemaining: 0,
    });
    expect(await screen.findByTestId('active-no-refill-left')).to.contain.text(
      'You have no refills left. If you need more, request a renewal.',
    );
  });

  it('displays expired content correctly', async () => {
    const screen = setup({
      ...prescription,
      dispStatus: dispStatusObj.expired,
      refillRemaining: 0,
    });
    expect(await screen.findByTestId('expired')).to.contain.text(
      'This prescription is too old to refill. If you need more, request a renewal.',
    );
  });

  describe('isRenewable for OH prescriptions', () => {
    it('displays renewal link when isRenewable is true and prescription is not non-VA', async () => {
      const screen = setup({
        ...prescription,
        isRenewable: true,
        prescriptionSource: 'VA',
        dispStatus: null,
      });
      expect(await screen.findByTestId('send-renewal-request-message-link')).to
        .exist;
    });

    it('displays renewal link when isRenewable is true with any dispStatus', async () => {
      const screen = setup({
        ...prescription,
        isRenewable: true,
        prescriptionSource: 'VA',
        dispStatus: 'Active',
        refillRemaining: 5, // Has refills but isRenewable should still show link
      });
      expect(await screen.findByTestId('send-renewal-request-message-link')).to
        .exist;
    });

    it('does not display renewal link when isRenewable is true but prescription is non-VA', async () => {
      const screen = setup({
        ...prescription,
        isRenewable: true,
        prescriptionSource: 'NV',
        dispStatus: null,
      });
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    it('does not display renewal link when isRenewable is false', async () => {
      const screen = setup({
        ...prescription,
        isRenewable: false,
        prescriptionSource: 'VA',
        dispStatus: 'Active',
        refillRemaining: 5,
      });
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    it('falls back to dispStatus logic when isRenewable is undefined', async () => {
      const screen = setup({
        ...prescription,
        isRenewable: undefined,
        prescriptionSource: 'VA',
        dispStatus: dispStatusObj.active,
        refillRemaining: 0,
      });
      expect(
        await screen.findByTestId('active-no-refill-left'),
      ).to.contain.text(
        'You have no refills left. If you need more, request a renewal.',
      );
    });
  });
});
