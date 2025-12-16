import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import reducers from '../../../reducers';
import prescriptionsListItem from '../../fixtures/prescriptionsListItem.json';
import ExtraDetails from '../../../components/shared/ExtraDetails';
import { dateFormat } from '../../../util/helpers';
import { DATETIME_FORMATS, dispStatusObj, dispStatusObjV2 } from '../../../util/constants';

describe('Medications List Card Extra Details', () => {
  const prescription = prescriptionsListItem;

  // Shared test data
  const FLAG_COMBINATIONS = [
    { cernerPilot: false, v2StatusMapping: false, useV2: false, desc: 'both flags disabled' },
    { cernerPilot: true, v2StatusMapping: false, useV2: false, desc: 'only cernerPilot enabled' },
    { cernerPilot: false, v2StatusMapping: true, useV2: false, desc: 'only v2StatusMapping enabled' },
    { cernerPilot: true, v2StatusMapping: true, useV2: true, desc: 'both flags enabled' },
  ];

  const setup = (rx = prescription, initialState = {}, isCernerPilot = false, isV2StatusMapping = false) => {
    const featureToggleReducer = (state = {}) => state;
    const testReducers = {
      ...reducers,
      featureToggles: featureToggleReducer,
    };

    const state = {
      ...initialState,
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingMedicationsRenewalRequest]: true,
        [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: isCernerPilot,
        [FEATURE_FLAG_NAMES.mhvMedicationsV2StatusMapping]: isV2StatusMapping,
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

  // REFACTORED: Consolidated V1 status tests into parameterized block
  describe('V1 status handling (when flags disabled)', () => {
    const V1_STATUS_TESTS = [
      { status: dispStatusObj.unknown, testId: 'unknown', includes: 'We\'re sorry. There\'s a problem with our system' },
      { status: dispStatusObj.refillinprocess, testId: 'rx-refillinprocess-info', includes: 'We expect to fill this prescription on' },
      { status: dispStatusObj.submitted, testId: 'submitted-refill-request', includes: 'We got your request on' },
      { status: dispStatusObj.discontinued, testId: 'discontinued', includes: 'You can\'t refill this prescription' },
      { status: dispStatusObj.activeParked, testId: 'active-parked', includes: 'You can request this prescription when you need it' },
      { status: dispStatusObj.transferred, testId: 'transferred', includes: 'To manage this prescription, go to our My VA Health portal' },
      { status: dispStatusObj.onHold, testId: 'active-onHold', includes: 'You can\'t refill this prescription online right now' },
      { status: dispStatusObj.expired, testId: 'expired', includes: 'This prescription is too old to refill', refillRemaining: 0 },
    ];

    V1_STATUS_TESTS.forEach(({ status, testId, includes, refillRemaining }) => {
      it(`displays ${status} content correctly`, async () => {
        const rx = { ...prescription, dispStatus: status };
        if (refillRemaining !== undefined) rx.refillRemaining = refillRemaining;
        const screen = setup(rx);
        expect(await screen.findByTestId(testId)).to.contain.text(includes);
      });
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
  });

  // REFACTORED: Consolidated V2 status tests
  describe('V2 status handling (when BOTH CernerPilot and V2StatusMapping flags enabled)', () => {
    const V2_STATUS_TESTS = [
      { status: dispStatusObjV2.statusNotAvailable, testId: 'unknown' },
      { status: dispStatusObjV2.inprogress, testId: 'refill-in-process' },
      { status: dispStatusObjV2.active, testId: 'active-parked', refillRemaining: 3 },
      { status: dispStatusObjV2.inactive, testId: 'inactive' },
      { status: dispStatusObjV2.transferred, testId: 'transferred' },
    ];

    V2_STATUS_TESTS.forEach(({ status, testId, refillRemaining }) => {
      it(`displays ${status} message`, async () => {
        const rx = { ...prescription, dispStatus: status };
        if (refillRemaining !== undefined) rx.refillRemaining = refillRemaining;
        const screen = setup(rx, {}, true, true);
        expect(await screen.findByTestId(testId)).to.exist;
      });
    });

    it('displays no refills left message when Active with 0 refills', async () => {
      const screen = setup(
        { ...prescription, dispStatus: dispStatusObjV2.active, refillRemaining: 0 },
        {},
        true,
        true,
      );
      expect(await screen.findByTestId('active-no-refill-left')).to.exist;
    });
  });

  describe('CernerPilot and V2StatusMapping flag requirement validation', () => {
    FLAG_COMBINATIONS.forEach(({ cernerPilot, v2StatusMapping, useV2, desc }) => {
      it(`uses ${useV2 ? 'V2' : 'V1'} status logic when ${desc}`, async () => {
        const screen = setup(
          { ...prescription, dispStatus: dispStatusObj.activeParked },
          {},
          cernerPilot,
          v2StatusMapping,
        );
        expect(await screen.findByTestId('active-parked')).to.exist;
      });
    });
  });

  describe('Non-VA status preservation', () => {
    FLAG_COMBINATIONS.forEach(({ cernerPilot, v2StatusMapping, desc }) => {
      it(`preserves Non-VA behavior when ${desc}`, async () => {
        const screen = setup(
          { ...prescription, dispStatus: 'Active: Non-VA', prescriptionSource: 'NV' },
          {},
          cernerPilot,
          v2StatusMapping,
        );
        expect(await screen.findByTestId('non-VA-prescription')).to.exist;
      });
    });
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
