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
  it('should display correct header for ALL_MEDICATIONS_FILTER_KEY filter option', () => {
    const selectedFilterOption = ALL_MEDICATIONS_FILTER_KEY;
    expect(displayMedicationsListHeader(selectedFilterOption)).to.equal(
      filterOptions[ALL_MEDICATIONS_FILTER_KEY].label,
    );
  });

  it('should display correct header for ACTIVE_FILTER_KEY filter option', () => {
    const selectedFilterOption = ACTIVE_FILTER_KEY;
    expect(displayMedicationsListHeader(selectedFilterOption)).to.equal(
      `${filterOptions[ACTIVE_FILTER_KEY].label} medications`,
    );
  });

  it('should display correct header for RECENTLY_REQUESTED_FILTER_KEY filter option', () => {
    const selectedFilterOption = RECENTLY_REQUESTED_FILTER_KEY;
    expect(displayMedicationsListHeader(selectedFilterOption)).to.equal(
      `${filterOptions[RECENTLY_REQUESTED_FILTER_KEY].label} medications`,
    );
  });

  it('should display correct header for RENEWAL_FILTER_KEY filter option', () => {
    const selectedFilterOption = RENEWAL_FILTER_KEY;
    expect(displayMedicationsListHeader(selectedFilterOption)).to.equal(
      `Medications that need renewal before refill`,
    );
  });

  it('should display correct header for NON_ACTIVE_FILTER_KEY filter option', () => {
    const selectedFilterOption = NON_ACTIVE_FILTER_KEY;
    expect(displayMedicationsListHeader(selectedFilterOption)).to.equal(
      `${filterOptions[NON_ACTIVE_FILTER_KEY].label} medications`,
    );
  });

  it('should throw an error for an unknown filter option', () => {
    expect(() => displayMedicationsListHeader('__NOT_A_FILTER__')).to.throw(
      'Unknown filter option: __NOT_A_FILTER__',
    );
  });

  it('should display correct header for IN_PROGRESS_FILTER_KEY filter option when Cerner pilot is enabled', () => {
    const selectedFilterOption = IN_PROGRESS_FILTER_KEY;
    expect(displayMedicationsListHeader(selectedFilterOption, true)).to.equal(
      `${filterOptionsV2[IN_PROGRESS_FILTER_KEY].label} medications`,
    );
  });

  it('should display correct header for SHIPPED_FILTER_KEY when Cerner pilot is enabled', () => {
    const selectedFilterOption = SHIPPED_FILTER_KEY;
    expect(displayMedicationsListHeader(selectedFilterOption, true)).to.equal(
      `${filterOptionsV2[SHIPPED_FILTER_KEY].label} medications`,
    );
  });

  it('should display correct header for TRANSFERRED_FILTER_KEY when Cerner pilot is enabled', () => {
    const selectedFilterOption = TRANSFERRED_FILTER_KEY;
    expect(displayMedicationsListHeader(selectedFilterOption, true)).to.equal(
      `${filterOptionsV2[TRANSFERRED_FILTER_KEY].label} medications`,
    );
  });

  it('should display correct header for INACTIVE_FILTER_KEY when Cerner pilot is enabled', () => {
    const selectedFilterOption = INACTIVE_FILTER_KEY;
    expect(displayMedicationsListHeader(selectedFilterOption, true)).to.equal(
      `${filterOptionsV2[INACTIVE_FILTER_KEY].label} medications`,
    );
  });

  it('should display correct header for STATUS_NOT_AVAILABLE_FILTER_KEY when Cerner pilot is enabled', () => {
    const selectedFilterOption = STATUS_NOT_AVAILABLE_FILTER_KEY;
    expect(displayMedicationsListHeader(selectedFilterOption, true)).to.equal(
      `${filterOptionsV2[STATUS_NOT_AVAILABLE_FILTER_KEY].label} medications`,
    );
  });

  it('should work with standard filters when Cerner pilot is enabled', () => {
    const selectedFilterOption = ACTIVE_FILTER_KEY;
    expect(displayMedicationsListHeader(selectedFilterOption, true)).to.equal(
      `${filterOptionsV2[ACTIVE_FILTER_KEY].label} medications`,
    );
  });

  it('should work with standard filters when Cerner pilot is disabled', () => {
    const selectedFilterOption = ACTIVE_FILTER_KEY;
    expect(displayMedicationsListHeader(selectedFilterOption, false)).to.equal(
      `${filterOptions[ACTIVE_FILTER_KEY].label} medications`,
    );
  });

  it('should default to standard filter options when no cernerPilot flag is provided', () => {
    const selectedFilterOption = ACTIVE_FILTER_KEY;
    expect(displayMedicationsListHeader(selectedFilterOption)).to.equal(
      `${filterOptions[ACTIVE_FILTER_KEY].label} medications`,
    );
  });
});
