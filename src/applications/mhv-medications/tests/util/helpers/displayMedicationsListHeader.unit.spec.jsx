import { expect } from 'chai';
import { displayMedicationsListHeader } from '../../../util/helpers';
import {
  ALL_MEDICATIONS_FILTER_KEY,
  ACTIVE_FILTER_KEY,
  RECENTLY_REQUESTED_FILTER_KEY,
  RENEWAL_FILTER_KEY,
  NON_ACTIVE_FILTER_KEY,
  INACTIVE_FILTER_KEY,
  IN_PROGRESS_FILTER_KEY,
  SHIPPED_FILTER_KEY,
  TRANSFERRED_FILTER_KEY,
  STATUS_NOT_AVAILABLE_FILTER_KEY,
  filterOptions,
  filterOptionsV2,
} from '../../../util/constants';

describe('displayMedicationsListHeader function', () => {
  // Shared test data
  const V2_FILTER_KEYS = [
    {
      key: IN_PROGRESS_FILTER_KEY,
      label: filterOptionsV2[IN_PROGRESS_FILTER_KEY].label,
    },
    {
      key: SHIPPED_FILTER_KEY,
      label: filterOptionsV2[SHIPPED_FILTER_KEY].label,
    },
    {
      key: TRANSFERRED_FILTER_KEY,
      label: filterOptionsV2[TRANSFERRED_FILTER_KEY].label,
    },
    {
      key: INACTIVE_FILTER_KEY,
      label: filterOptionsV2[INACTIVE_FILTER_KEY].label,
    },
    {
      key: STATUS_NOT_AVAILABLE_FILTER_KEY,
      label: filterOptionsV2[STATUS_NOT_AVAILABLE_FILTER_KEY].label,
    },
    { key: ACTIVE_FILTER_KEY, label: filterOptionsV2[ACTIVE_FILTER_KEY].label },
  ];

  describe('V1 behavior - default when no flags provided', () => {
    it('returns ALL_MEDICATIONS label correctly', () => {
      expect(displayMedicationsListHeader(ALL_MEDICATIONS_FILTER_KEY)).to.equal(
        filterOptions[ALL_MEDICATIONS_FILTER_KEY].label,
      );
    });

    it('returns ACTIVE medications header', () => {
      expect(displayMedicationsListHeader(ACTIVE_FILTER_KEY)).to.equal(
        `${filterOptions[ACTIVE_FILTER_KEY].label} medications`,
      );
    });

    it('returns RECENTLY_REQUESTED medications header', () => {
      expect(
        displayMedicationsListHeader(RECENTLY_REQUESTED_FILTER_KEY),
      ).to.equal(
        `${filterOptions[RECENTLY_REQUESTED_FILTER_KEY].label} medications`,
      );
    });

    it('returns RENEWAL header with custom text', () => {
      expect(displayMedicationsListHeader(RENEWAL_FILTER_KEY)).to.equal(
        `Medications that need renewal before refill`,
      );
    });

    it('returns NON_ACTIVE medications header', () => {
      expect(displayMedicationsListHeader(NON_ACTIVE_FILTER_KEY)).to.equal(
        `${filterOptions[NON_ACTIVE_FILTER_KEY].label} medications`,
      );
    });

    it('throws error for unrecognized filter option', () => {
      expect(() => displayMedicationsListHeader('__INVALID_FILTER__')).to.throw(
        'Unknown filter option: __INVALID_FILTER__',
      );
    });
  });

  describe('V1 behavior persists when either CernerPilot or  V2StatusMapping is enabled alone', () => {
    it('uses V1 options when cernerPilot=true but v2StatusMapping=false', () => {
      expect(
        displayMedicationsListHeader(ACTIVE_FILTER_KEY, true, false),
      ).to.equal(`${filterOptions[ACTIVE_FILTER_KEY].label} medications`);
    });

    it('uses V1 options when cernerPilot=false but v2StatusMapping=true', () => {
      expect(
        displayMedicationsListHeader(ACTIVE_FILTER_KEY, false, true),
      ).to.equal(`${filterOptions[ACTIVE_FILTER_KEY].label} medications`);
    });
  });

  // REFACTORED: Consolidated V2 behavior tests
  describe('V2 behavior when both cernerPilot AND v2StatusMapping are enabled', () => {
    const bothFlagsEnabled = [true, true];

    V2_FILTER_KEYS.forEach(({ key, label }) => {
      it(`returns ${key} header from V2 options`, () => {
        expect(displayMedicationsListHeader(key, ...bothFlagsEnabled)).to.equal(
          `${label} medications`,
        );
      });
    });

    it('returns ALL_MEDICATIONS label from V2 options', () => {
      expect(
        displayMedicationsListHeader(
          ALL_MEDICATIONS_FILTER_KEY,
          ...bothFlagsEnabled,
        ),
      ).to.equal(filterOptionsV2[ALL_MEDICATIONS_FILTER_KEY].label);
    });
  });
});
