import { expect } from 'chai';
import set from 'platform/utilities/data/set';

import { estimatedBenefits } from '../../selectors/estimator';
import { getDefaultState } from '../helpers';

const defaultState = getDefaultState();

describe('estimatedBenefits', () => {
  it('lower DoD rate than VA should result in DoD rate displaying', () => {
    expect(
      estimatedBenefits(defaultState, {
        institution: {
          bah: 1000,
          dodBah: 500,
          country: 'usa',
        },
      }).housing.value,
    ).to.equal(500);
  });

  it('lower VA rate than DoD should result in VA rate displaying', () => {
    expect(
      estimatedBenefits(defaultState, {
        institution: {
          bah: 1000,
          dodBah: 5000,
          country: 'usa',
        },
      }).housing.value,
    ).to.equal(1000);
  });

  it('should estimate housing for purple heart benefit', () => {
    const state = set(
      'eligibility.cululativeService',
      'purple heart',
      defaultState,
    );
    expect(
      estimatedBenefits(state, {
        institution: { type: 'public', bah: 2000, country: 'usa' },
      }).housing.value,
    ).to.equal(2000);
  });

  it('should estimate books for purple heart benefit', () => {
    const state = set(
      'eligibility.cululativeService',
      'purple heart',
      defaultState,
    );
    expect(
      estimatedBenefits(state, {
        institution: { type: 'public', country: 'usa' },
      }).books.value,
    ).to.equal(1000);
  });

  it('should display 1/2 lower DoD average rate for online classes', () => {
    let state = set('constants.constants.AVGDODBAH', 500, defaultState);
    state = set('eligibility.onlineClasses', 'yes', state);
    expect(
      estimatedBenefits(state, {
        institution: {
          institution: { type: 'public', country: 'usa' },
        },
      }).housing.value,
    ).to.equal(250);
  });

  it('should display 1/2 lower VA average rate for online classes for usa institutions', () => {
    let state = set('eligibility.onlineClasses', 'yes', defaultState);
    state = set('constants.constants.AVGVABAH', 1000, state);
    expect(
      estimatedBenefits(state, {
        institution: { type: 'public', country: 'usa' },
      }).housing.value,
    ).to.equal(state.constants.constants.AVGVABAH * 0.5);
  });

  it('should display 1/2 lower AVGVABAH rate for online classes for non-usa institutions', () => {
    let state = set('eligibility.onlineClasses', 'yes', defaultState);
    state = set('constants.constants.AVGVABAH', 1000, state);
    expect(
      estimatedBenefits(state, {
        institution: { type: 'public', country: 'canada' },
      }).housing.value,
    ).to.equal(state.constants.constants.AVGVABAH * 0.5);
  });

  it('should display lower AVGDODBAH rate for non-usa institutions', () => {
    expect(
      estimatedBenefits(defaultState, {
        institution: { type: 'public', country: 'canada' },
      }).housing.value,
    ).to.equal(defaultState.constants.constants.AVGDODBAH);
  });

  it('should display lower AVGVABAH rate for non-usa institutions', () => {
    const state = set('constants.constants.AVGVABAH', 200, defaultState);
    expect(
      estimatedBenefits(state, {
        institution: { type: 'public', country: 'canada' },
      }).housing.value,
    ).to.equal(state.constants.constants.AVGVABAH);
  });

  it('should estimate zero tuition allowance for OJT school', () => {
    expect(
      estimatedBenefits(defaultState, {
        institution: {
          type: 'ojt',
          bah: 1000,
          country: 'usa',
        },
      }).tuition.value,
    ).to.equal('N/A');
  });

  it('should estimate zero housing allowance for active duty', () => {
    const state = set(
      'eligibility.militaryStatus',
      'active duty',
      defaultState,
    );

    expect(
      estimatedBenefits(state, {
        institution: {
          type: 'public school',
          bah: 1000,
          country: 'usa',
        },
      }).housing.value,
    ).to.equal(0);
  });

  it('should estimate zero housing allowance for active duty spouse', () => {
    let state = set('eligibility.militaryStatus', 'spouse', defaultState);
    state = set('eligibility.spouseActiveDuty', 'yes', state);

    expect(
      estimatedBenefits(state, {
        institution: {
          type: 'public school',
          bah: 1000,
          country: 'usa',
        },
      }).housing.value,
    ).to.equal(0);
  });

  it('should estimate zero housing allowance for correspondence school', () => {
    expect(
      estimatedBenefits(defaultState, {
        institution: {
          type: 'correspondence',
          bah: 1000,
          country: 'usa',
        },
      }).housing.value,
    ).to.equal(0);
  });

  it('should estimate zero tuition allowance for old GI bill', () => {
    const state = set('eligibility.giBillChapter', '30', defaultState);
    expect(
      estimatedBenefits(state, {
        institution: {
          type: 'public school',
          bah: 1000,
          country: 'usa',
        },
      }).tuition.value,
    ).to.equal(0);
  });

  it('should estimate housing allowance for chapter 30 as MGIB3YRRATE', () => {
    const state = set('eligibility.giBillChapter', '30', defaultState);
    expect(
      estimatedBenefits(state, {
        institution: {
          type: 'public school',
          bah: 1000,
          country: 'usa',
        },
      }).housing.value,
    ).to.equal(Math.round(state.constants.constants.MGIB3YRRATE));
  });

  it('should estimate OJT housing allowance for chapter 30 as .75 * MGIB3YRRATE', () => {
    const state = set('eligibility.giBillChapter', '30', defaultState);
    expect(
      estimatedBenefits(state, {
        institution: {
          type: 'ojt',
          bah: 1000,
          country: 'usa',
        },
      }).housing.value,
    ).to.equal(Math.round(state.constants.constants.MGIB3YRRATE * 0.75));
  });
  it('should estimate housing allowance for chapter 30 as MGIB3YRRATE for 3-year enlistment without OJT', () => {
    let state = set('eligibility.giBillChapter', '30', defaultState);
    state = set('eligibility.enlistmentService', '2', state);
    state = set('institution.type', 'public school', state);

    expect(
      estimatedBenefits(state, {
        institution: {
          type: 'public school',
          bah: 1000,
          country: 'usa',
        },
      }).housing.value,
    ).to.equal(Math.round(state.constants.constants.MGIB3YRRATE - 348));
  });
  it('should estimate housing allowance for chapter 30 as MGIB3YRRATE for 3-year enlistment OJT', () => {
    let state = set('eligibility.giBillChapter', '30', defaultState);
    state = set('eligibility.enlistmentService', '2', state);
    state = set('institution.type', 'ojt', state);

    expect(
      estimatedBenefits(state, {
        institution: {
          type: 'ojt',
          bah: 1000,
          country: 'usa',
        },
      }).housing.value,
    ).to.equal(Math.round(state.constants.constants.MGIB3YRRATE * 0.75 - 261));
  });
  it('should estimate housing allowance for chapter 1606 without OJT as SRRATE', () => {
    let state = set('eligibility.giBillChapter', '1606', defaultState);
    state = set('institution.type', 'public school', state);

    expect(
      estimatedBenefits(state, {
        institution: {
          type: 'public school',
          bah: 1000,
          country: 'usa',
        },
      }).housing.value,
    ).to.equal(Math.round(state.constants.constants.SRRATE));
  });
  it('should estimate housing allowance for chapter 1606 with OJT as 0.75 * SRRATE', () => {
    let state = set('eligibility.giBillChapter', '1606', defaultState);
    state = set('institution.type', 'ojt', state);

    expect(
      estimatedBenefits(state, {
        institution: {
          type: 'ojt',
          bah: 1000,
          country: 'usa',
        },
      }).housing.value,
    ).to.equal(Math.round(state.constants.constants.SRRATE * 0.75));
  });
  it('should estimate housing allowance for chapter 35 with OJT as DEARATEOJT', () => {
    let state = set('eligibility.giBillChapter', '35', defaultState);
    state = set('institution.type', 'ojt', state);

    expect(
      estimatedBenefits(state, {
        institution: {
          type: 'ojt',
          bah: 1000,
          country: 'usa',
        },
      }).housing.value,
    ).to.equal(Math.round(state.constants.constants.DEARATEOJT));
  });
  it('should estimate housing allowance for chapter 35 with Flight as 0', () => {
    let state = set('eligibility.giBillChapter', '35', defaultState);
    state = set('institution.type', 'flight', state);

    expect(
      estimatedBenefits(state, {
        institution: {
          type: 'flight',
          bah: 1000,
          country: 'usa',
        },
      }).housing.value,
    ).to.equal(0);
  });
  it('should estimate housing allowance for chapter 35 without OJT or Flight as DEARATEFULLTIME', () => {
    let state = set('eligibility.giBillChapter', '35', defaultState);
    state = set('institution.type', 'public school', state);

    expect(
      estimatedBenefits(state, {
        institution: {
          type: 'public school',
          bah: 1000,
          country: 'usa',
        },
      }).housing.value,
    ).to.equal(Math.round(state.constants.constants.DEARATEFULLTIME));
  });
  it('should halve the housing allowance for chapter 35 dependents in the Philippines', () => {
    let state = set('eligibility.giBillChapter', '35', defaultState);
    state = set('eligibility.militaryStatus', 'child', state);
    state = set('institution.country', 'philippines', state);

    const expectedRate = Math.round(
      state.constants.constants.DEARATEFULLTIME / 2,
    );

    expect(
      estimatedBenefits(state, {
        institution: {
          type: 'public school',
          bah: 1000,
          country: 'philippines',
        },
      }).housing.value,
    ).to.equal(expectedRate);
  });
  it('should estimate housing allowance for chapter 31 with 1 dependent', () => {
    let state = set('eligibility.giBillChapter', '31', defaultState);
    state = set('eligibility.numberOfDependents', 1, state);

    const expectedRate = Math.round(state.constants.constants.VRE1DEPRATE);

    expect(
      estimatedBenefits(state, {
        institution: {
          type: 'public school',
          bah: 1000,
          country: 'usa',
        },
      }).housing.value,
    ).to.equal(expectedRate);
  });
  it('should estimate housing allowance for chapter 31 with 2 dependents', () => {
    let state = set('eligibility.giBillChapter', '31', defaultState);
    state = set('eligibility.numberOfDependents', 2, state);

    const expectedRate = Math.round(state.constants.constants.VRE2DEPRATE);

    expect(
      estimatedBenefits(state, {
        institution: {
          type: 'public school',
          bah: 1000,
          country: 'usa',
        },
      }).housing.value,
    ).to.equal(expectedRate);
  });
  it('should estimate housing allowance for chapter 31 with more than 2 dependents', () => {
    let state = set('eligibility.giBillChapter', '31', defaultState);
    state = set('eligibility.numberOfDependents', 3, state);

    const baseRate = Math.round(state.constants.constants.VRE2DEPRATE);
    const additionalRate = (3 - 2) * state.constants.constants.VREINCRATE;
    const expectedRate = Math.round(baseRate + additionalRate);

    expect(
      estimatedBenefits(state, {
        institution: {
          type: 'public school',
          bah: 1000,
          country: 'usa',
        },
      }).housing.value,
    ).to.equal(expectedRate);
  });
});
