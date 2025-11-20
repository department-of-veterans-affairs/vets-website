import { expect } from 'chai';
import { displayMedicationsListHeader } from '../../../util/helpers';
import {
  ALL_MEDICATIONS_FILTER_KEY,
  ACTIVE_FILTER_KEY,
  RECENTLY_REQUESTED_FILTER_KEY,
  RENEWAL_FILTER_KEY,
  NON_ACTIVE_FILTER_KEY,
  filterOptions,
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
});
