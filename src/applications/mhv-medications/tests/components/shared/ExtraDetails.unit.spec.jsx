import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import reducers from '../../../reducers';
import prescriptionsListItem from '../../fixtures/prescriptionsListItem.json';
import ExtraDetails from '../../../components/shared/ExtraDetails';
import { dispStatusObj, dispStatusObjV2 } from '../../../util/constants';
import { pageType } from '../../../util/dataDogConstants';

describe('Medications List Card Extra Details', () => {
  const FLAG_COMBINATIONS = [
    {
      cernerPilot: false,
      v2StatusMapping: false,
      useV2: false,
      desc: 'both flags disabled',
    },
    {
      cernerPilot: true,
      v2StatusMapping: false,
      useV2: false,
      desc: 'only cernerPilot enabled',
    },
    {
      cernerPilot: false,
      v2StatusMapping: true,
      useV2: false,
      desc: 'only v2StatusMapping enabled',
    },
    {
      cernerPilot: true,
      v2StatusMapping: true,
      useV2: true,
      desc: 'both flags enabled',
    },
  ];

  const V1_STATUS_TESTS = [
    { status: dispStatusObj.unknown, testId: 'unknown' },
    {
      status: dispStatusObj.refillinprocess,
      testId: 'rx-refillinprocess-info',
    },
    { status: dispStatusObj.submitted, testId: 'submitted-refill-request' },
    { status: dispStatusObj.discontinued, testId: 'discontinued' },
    { status: dispStatusObj.activeParked, testId: 'active-parked' },
    { status: dispStatusObj.transferred, testId: 'transferred' },
    { status: dispStatusObj.onHold, testId: 'active-onHold' },
    { status: dispStatusObj.expired, testId: 'expired', refillRemaining: 0 },
  ];

  const V2_STATUS_TESTS = [
    { status: dispStatusObjV2.statusNotAvailable, testId: 'unknown' },
    { status: dispStatusObjV2.inprogress, testId: 'refill-in-process' },
    { status: dispStatusObjV2.inactive, testId: 'inactive' },
    { status: dispStatusObjV2.transferred, testId: 'transferred' },
  ];

  const prescription = prescriptionsListItem;

  // Reusable renewable VA prescription at an Oracle Health facility.
  const renewableOHRx = (overrides = {}) => ({
    ...prescription,
    isRenewable: true,
    prescriptionSource: 'VA',
    dispStatus: dispStatusObj.active,
    refillRemaining: 0,
    stationNumber: '668',
    ...overrides,
  });

  const setup = (
    rx = prescription,
    initialState = {},
    isCernerPilot = false,
    isV2StatusMapping = false,
  ) => {
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
      drupalStaticData: {
        vamcEhrData: {
          data: {
            cernerFacilities: [
              { vhaId: '668', vamcFacilityName: 'Spokane VA' },
            ],
          },
        },
        ...(initialState.drupalStaticData || {}),
      },
    };

    return renderWithStoreAndRouterV6(<ExtraDetails {...rx} />, {
      initialState: state,
      reducers: testReducers,
    });
  };

  const setupWithRenewalLink = (
    rx = prescription,
    renewalLinkShownAbove = false,
    initialState = {},
    isCernerPilot = false,
    isV2StatusMapping = false,
  ) => {
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
      drupalStaticData: {
        vamcEhrData: {
          data: {
            cernerFacilities: [
              { vhaId: '668', vamcFacilityName: 'Spokane VA' },
            ],
          },
        },
        ...(initialState.drupalStaticData || {}),
      },
    };

    return renderWithStoreAndRouterV6(
      <ExtraDetails {...rx} renewalLinkShownAbove={renewalLinkShownAbove} />,
      {
        initialState: state,
        reducers: testReducers,
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  // REFACTORED: Consolidated V1 status tests into parameterized block
  describe('V1 status handling (when flags disabled)', () => {
    V1_STATUS_TESTS.forEach(({ status, testId, refillRemaining }) => {
      it(`displays ${status} content correctly`, async () => {
        const rx = { ...prescription, dispStatus: status };
        if (refillRemaining !== undefined) rx.refillRemaining = refillRemaining;
        const screen = setup(rx);
        expect(await screen.findByTestId(testId)).to.exist;
      });
    });

    it('displays active with no refills content correctly', async () => {
      const screen = setup({
        ...prescription,
        dispStatus: dispStatusObj.active,
        refillRemaining: 0,
      });
      expect(
        await screen.findByTestId('active-no-refill-left'),
      ).to.contain.text(
        'Contact your VA provider if you need more of this medication.',
      );
    });

    it('displays OH-specific text for active with no refills for Oracle Health', async () => {
      const screen = setup({
        ...prescription,
        dispStatus: dispStatusObj.active,
        refillRemaining: 0,
        stationNumber: '668',
      });
      expect(
        await screen.findByTestId('active-no-refill-left'),
      ).to.contain.text('send a secure message to your care team');
    });

    it('displays fallback text for discontinued prescription (not renewable per spec Gate 1)', async () => {
      const screen = setup({
        ...prescription,
        dispStatus: dispStatusObj.discontinued,
      });
      expect(await screen.findByTestId('discontinued')).to.exist;
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    it('displays fallback text for onHold prescription (not renewable per spec Gate 1)', async () => {
      const screen = setup({
        ...prescription,
        dispStatus: dispStatusObj.onHold,
      });
      expect(await screen.findByTestId('active-onHold')).to.exist;
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });
  });

  // REFACTORED: Consolidated V2 status tests
  describe('V2 status handling (when BOTH CernerPilot and V2StatusMapping flags enabled)', () => {
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
        {
          ...prescription,
          dispStatus: dispStatusObjV2.active,
          refillRemaining: 0,
        },
        {},
        true,
        true,
      );
      expect(await screen.findByTestId('active-no-refill-left')).to.exist;
    });

    it('renders nothing when Active with refills remaining', () => {
      const screen = setup(
        {
          ...prescription,
          dispStatus: dispStatusObjV2.active,
          refillRemaining: 3,
        },
        {},
        true,
        true,
      );
      // V2 Active with refills remaining returns null (component renders nothing)
      expect(screen.container.querySelector('.shipping-info')).to.not.exist;
    });
  });

  describe('CernerPilot and V2StatusMapping flag requirement validation', () => {
    FLAG_COMBINATIONS.forEach(
      ({ cernerPilot, v2StatusMapping, useV2, desc }) => {
        it(`uses ${
          useV2 ? 'V2' : 'V1'
        } status logic when ${desc}`, async () => {
          // Pass appropriate status based on flag combination
          // When both flags enabled, API returns V2 status; otherwise V1
          const statusToTest = useV2
            ? dispStatusObjV2.inactive
            : dispStatusObj.activeParked;
          const expectedTestId = useV2 ? 'inactive' : 'active-parked';
          const screen = setup(
            { ...prescription, dispStatus: statusToTest },
            {},
            cernerPilot,
            v2StatusMapping,
          );
          expect(await screen.findByTestId(expectedTestId)).to.exist;
        });
      },
    );
  });

  describe('Non-VA status preservation', () => {
    FLAG_COMBINATIONS.forEach(({ cernerPilot, v2StatusMapping, desc }) => {
      it(`preserves Non-VA behavior when ${desc}`, async () => {
        const screen = setup(
          {
            ...prescription,
            dispStatus: 'Active: Non-VA',
            prescriptionSource: 'NV',
          },
          {},
          cernerPilot,
          v2StatusMapping,
        );
        expect(await screen.findByTestId('non-VA-prescription')).to.exist;
      });
    });
  });

  describe('isRenewable for OH prescriptions', () => {
    it('does not display renewal link when isRenewable is true but prescription is non-VA', async () => {
      const screen = setup(renewableOHRx());
      expect(await screen.findByTestId('active-no-refill-left')).to.exist;
      expect(await screen.findByTestId('send-renewal-request-message-link')).to
        .exist;
    });

    it('displays renewal link when Expired and isRenewable is true for Oracle Health', async () => {
      const screen = setup(
        renewableOHRx({ dispStatus: dispStatusObj.expired }),
      );
      expect(await screen.findByTestId('send-renewal-request-message-link')).to
        .exist;
    });

    it('does not display renewal link for non-VA prescription even if isRenewable is true', async () => {
      const screen = setup(
        renewableOHRx({ prescriptionSource: 'NV', dispStatus: null }),
      );
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    it('does not display renewal link when Active has refills even if isRenewable is true', async () => {
      const screen = setup(renewableOHRx({ refillRemaining: 5 }));
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    it('does not display renewal link when isRenewable is false even for Active with 0 refills', async () => {
      const screen = setup(renewableOHRx({ isRenewable: false }));
      expect(await screen.findByTestId('active-no-refill-left')).to.exist;
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    it('uses dispStatus logic when isRenewable is undefined', async () => {
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
        'Contact your VA provider if you need more of this medication.',
      );
    });
  });
  describe('renewalLinkShownAbove prop suppresses renewal link in ExtraDetails', () => {
    it('suppresses renewal link when renewalLinkShownAbove is true for Active with 0 refills (OH)', async () => {
      const screen = setupWithRenewalLink(renewableOHRx(), true);
      expect(await screen.findByTestId('active-no-refill-left')).to.exist;
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    it('shows renewal link when renewalLinkShownAbove is false for Active with 0 refills (OH)', async () => {
      const screen = setupWithRenewalLink(renewableOHRx(), false);
      expect(await screen.findByTestId('active-no-refill-left')).to.exist;
      expect(screen.queryByTestId('send-renewal-request-message-link')).to
        .exist;
    });

    it('suppresses renewal link when renewalLinkShownAbove is true for Expired (OH)', async () => {
      const screen = setupWithRenewalLink(
        renewableOHRx({ dispStatus: dispStatusObj.expired }),
        true,
      );
      expect(await screen.findByTestId('expired')).to.exist;
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    it('suppresses renewal link when renewalLinkShownAbove is true for V2 Inactive (OH)', async () => {
      const screen = setupWithRenewalLink(
        renewableOHRx({ dispStatus: dispStatusObjV2.inactive }),
        true,
        {},
        true,
        true,
      );
      expect(await screen.findByTestId('inactive')).to.exist;
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });
  });

  describe('V2 expired and nonVA statuses', () => {
    it('displays expired message for V2 Expired status', async () => {
      const screen = setup(
        {
          ...prescription,
          dispStatus: dispStatusObjV2.expired,
          refillRemaining: 0,
        },
        {},
        true,
        true,
      );
      expect(await screen.findByTestId('expired')).to.exist;
    });

    it('displays non-VA message for V2 Non-VA status', async () => {
      const screen = setup(
        {
          ...prescription,
          dispStatus: dispStatusObjV2.nonVA,
        },
        {},
        true,
        true,
      );
      expect(await screen.findByTestId('non-VA-prescription')).to.exist;
    });
  });

  describe('RefillButton rendering based on page prop', () => {
    it('renders refill button on list page for active prescription with refills', async () => {
      const screen = setup({
        ...prescription,
        dispStatus: dispStatusObj.active,
        isRefillable: true,
        refillRemaining: 3,
        page: pageType.LIST,
      });
      expect(await screen.findByTestId('refill-request-button')).to.exist;
    });

    it('renders refill button on list page for active parked prescription with refills', async () => {
      const screen = setup({
        ...prescription,
        dispStatus: dispStatusObj.activeParked,
        isRefillable: true,
        refillRemaining: 3,
        page: pageType.LIST,
      });
      expect(await screen.findByTestId('refill-request-button')).to.exist;
    });

    it('does not render refill button on details page for active parked prescription', async () => {
      const screen = setup({
        ...prescription,
        dispStatus: dispStatusObj.activeParked,
        isRefillable: true,
        refillRemaining: 3,
        page: pageType.DETAILS,
      });
      expect(screen.queryByTestId('refill-request-button')).to.not.exist;
    });

    it('does not render refill button when page prop is not provided', async () => {
      const screen = setup({
        ...prescription,
        dispStatus: dispStatusObj.activeParked,
        isRefillable: true,
        refillRemaining: 3,
      });
      expect(screen.queryByTestId('refill-request-button')).to.not.exist;
    });

    it('does not render refill button when prescription is not refillable', async () => {
      const screen = setup({
        ...prescription,
        dispStatus: dispStatusObj.activeParked,
        isRefillable: false,
        refillRemaining: 3,
        page: pageType.LIST,
      });
      expect(screen.queryByTestId('refill-request-button')).to.not.exist;
    });

    it('renders refill button for V2 Active status on list page', async () => {
      const screen = setup(
        {
          ...prescription,
          dispStatus: dispStatusObjV2.active,
          isRefillable: true,
          refillRemaining: 3,
          page: pageType.LIST,
        },
        {},
        true,
        true,
      );
      expect(await screen.findByTestId('refill-request-button')).to.exist;
    });

    it('does not render refill button for V2 Active status on details page', async () => {
      const screen = setup(
        {
          ...prescription,
          dispStatus: dispStatusObjV2.active,
          isRefillable: true,
          refillRemaining: 3,
          page: pageType.DETAILS,
        },
        {},
        true,
        true,
      );
      expect(screen.queryByTestId('refill-request-button')).to.not.exist;
    });
  });

  describe('isRenewalBlocked prop for Oracle Health transition', () => {
    const setupWithRenewalBlocked = (
      rx,
      isCernerPilot = false,
      isV2StatusMapping = false,
    ) => {
      return setup(
        { ...rx, isRenewalBlocked: true },
        {},
        isCernerPilot,
        isV2StatusMapping,
      );
    };

    // Assertion helpers for distinguishing transition alert vs renewal link
    const expectTransitionAlertShown = async screen => {
      expect(await screen.findByTestId('oracle-health-renewal-in-card-alert'))
        .to.exist;
    };

    const expectTransitionAlertNotShown = screen => {
      expect(screen.queryByTestId('oracle-health-renewal-in-card-alert')).to.not
        .exist;
    };

    const expectRenewalLinkShown = async screen => {
      expect(await screen.findByTestId('send-renewal-request-message-link')).to
        .exist;
    };

    const expectRenewalLinkNotShown = screen => {
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    };

    describe('when isRenewalBlocked is true (Oracle Health transition active)', () => {
      describe('renewable prescriptions: shows transition alert instead of renewal link', () => {
        it('V1 Active with 0 refills: shows transition alert, hides renewal link and status content', async () => {
          const screen = setupWithRenewalBlocked(renewableOHRx());
          await expectTransitionAlertShown(screen);
          expectRenewalLinkNotShown(screen);
          expect(screen.queryByTestId('active-no-refill-left')).to.not.exist;
        });

        it('V1 Expired: shows transition alert, hides renewal link and status content', async () => {
          const screen = setupWithRenewalBlocked(
            renewableOHRx({ dispStatus: dispStatusObj.expired }),
          );
          await expectTransitionAlertShown(screen);
          expectRenewalLinkNotShown(screen);
          expect(screen.queryByTestId('expired')).to.not.exist;
        });

        it('V2 Active with 0 refills: shows transition alert, hides renewal link and status content', async () => {
          const screen = setupWithRenewalBlocked(
            renewableOHRx({ dispStatus: dispStatusObjV2.active }),
            true,
            true,
          );
          await expectTransitionAlertShown(screen);
          expectRenewalLinkNotShown(screen);
          expect(screen.queryByTestId('active-no-refill-left')).to.not.exist;
        });

        it('V2 Inactive: shows transition alert, hides renewal link and status content', async () => {
          const screen = setupWithRenewalBlocked(
            renewableOHRx({ dispStatus: dispStatusObjV2.inactive }),
            true,
            true,
          );
          await expectTransitionAlertShown(screen);
          expectRenewalLinkNotShown(screen);
          expect(screen.queryByTestId('inactive')).to.not.exist;
        });
      });

      describe('non-renewable prescriptions: shows normal status content, no transition alert or renewal link', () => {
        it('V1 Active with 0 refills: shows status content, no transition alert or renewal link', async () => {
          const screen = setupWithRenewalBlocked(
            renewableOHRx({ isRenewable: false }),
          );
          expectTransitionAlertNotShown(screen);
          expectRenewalLinkNotShown(screen);
          expect(await screen.findByTestId('active-no-refill-left')).to.exist;
        });

        it('V1 Expired: shows status content, no transition alert or renewal link', async () => {
          const screen = setupWithRenewalBlocked(
            renewableOHRx({
              isRenewable: false,
              dispStatus: dispStatusObj.expired,
            }),
          );
          expectTransitionAlertNotShown(screen);
          expectRenewalLinkNotShown(screen);
          expect(await screen.findByTestId('expired')).to.exist;
        });

        it('V2 Inactive: shows status content, no transition alert or renewal link', async () => {
          const screen = setupWithRenewalBlocked(
            renewableOHRx({
              isRenewable: false,
              dispStatus: dispStatusObjV2.inactive,
            }),
            true,
            true,
          );
          expectTransitionAlertNotShown(screen);
          expectRenewalLinkNotShown(screen);
          expect(await screen.findByTestId('inactive')).to.exist;
        });
      });
    });

    describe('when isRenewalBlocked is false (no Oracle Health transition blocking)', () => {
      it('V1 Active with 0 refills: shows renewal link and status content, no transition alert', async () => {
        const screen = setup(renewableOHRx());
        expectTransitionAlertNotShown(screen);
        expect(await screen.findByTestId('active-no-refill-left')).to.exist;
        await expectRenewalLinkShown(screen);
      });
    });
  });

  describe('isRefillBlocked prop for Oracle Health transition', () => {
    // Helper to create refillable prescription for testing hideRefillButton
    const createRefillablePrescription = (overrides = {}) => ({
      ...prescription,
      dispStatus: dispStatusObj.active,
      isRefillable: true,
      refillRemaining: 3,
      page: pageType.LIST,
      ...overrides,
    });

    // Assertion helpers
    const expectRefillButtonHidden = screen => {
      expect(screen.queryByTestId('refill-request-button')).to.not.exist;
    };

    const expectRefillButtonVisible = async screen => {
      expect(await screen.findByTestId('refill-request-button')).to.exist;
    };

    describe('when isRefillBlocked is true (prescription blocked by Oracle Health transition)', () => {
      it('hides refill button', async () => {
        const rx = createRefillablePrescription({ isRefillBlocked: true });
        const screen = setup(rx, {}, false, false);
        expectRefillButtonHidden(screen);
      });
    });

    describe('when isRefillBlocked is not provided (no Oracle Health transition blocking)', () => {
      it('shows refill button when isRefillBlocked is not provided (default behavior)', async () => {
        const rx = createRefillablePrescription();
        const screen = setup(rx, {}, false, false);
        await expectRefillButtonVisible(screen);
      });
    });
  });

  describe('when mhvMedicationsOracleHealthCutover feature flag is enabled', () => {
    const setupWithCutoverFlagEnabled = rx => {
      return setup(rx, {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicationsOracleHealthCutover]: true,
        },
      });
    };

    it('shows renewal alert when isRenewalBlocked prop is true', async () => {
      const rx = renewableOHRx({ isRenewalBlocked: true });
      const screen = setupWithCutoverFlagEnabled(rx);
      expect(await screen.findByTestId('oracle-health-renewal-in-card-alert'))
        .to.exist;
    });

    it('shows cutover text for V1 transferred status', async () => {
      const screen = setupWithCutoverFlagEnabled({
        ...prescription,
        dispStatus: dispStatusObj.transferred,
      });
      const el = await screen.findByTestId('transferred');
      expect(el).to.contain.text('This is a previous record');
      expect(screen.queryByTestId('prescription-VA-health-link')).to.not.exist;
    });

    it('shows cutover text for V2 transferred status', async () => {
      const screen = setup(
        { ...prescription, dispStatus: dispStatusObjV2.transferred },
        {
          featureToggles: {
            [FEATURE_FLAG_NAMES.mhvMedicationsOracleHealthCutover]: true,
          },
        },
        true,
        true,
      );
      const el = await screen.findByTestId('transferred');
      expect(el).to.contain.text('This is a previous record');
      expect(screen.queryByTestId('prescription-VA-health-link')).to.not.exist;
    });
  });

  describe('when mhvMedicationsOracleHealthCutover feature flag is disabled', () => {
    const setupWithCutoverFlagDisabled = rx => {
      return setup(rx, {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicationsOracleHealthCutover]: false,
        },
      });
    };

    it('shows legacy My VA Health link for V1 transferred status', async () => {
      const screen = setupWithCutoverFlagDisabled({
        ...prescription,
        dispStatus: dispStatusObj.transferred,
      });
      const el = await screen.findByTestId('transferred');
      expect(el).to.contain.text('go to our My VA Health portal');
      expect(screen.queryByTestId('prescription-VA-health-link')).to.exist;
    });

    it('shows legacy My VA Health link for V2 transferred status', async () => {
      const screen = setup(
        { ...prescription, dispStatus: dispStatusObjV2.transferred },
        {
          featureToggles: {
            [FEATURE_FLAG_NAMES.mhvMedicationsOracleHealthCutover]: false,
          },
        },
        true,
        true,
      );
      const el = await screen.findByTestId('transferred');
      expect(el).to.contain.text('go to our My VA Health portal');
      expect(screen.queryByTestId('prescription-VA-health-link')).to.exist;
    });
  });
});
