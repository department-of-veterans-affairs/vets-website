import { expect } from 'chai';

import {
  processDependents,
  updateDependentsInFormData,
} from '../../utils/processDependents';
import { PICKLIST_DATA } from '../../config/constants';
import { createDoB } from '../test-helpers';

const getDependent = ({
  index = 0,
  fullName = true,
  dobSlash = false,
  awarded = 'Y',
} = {}) => {
  const first = ['SPOUSY', 'PENNY', 'BOB'][index];
  const last = 'FOSTER';
  const ages = [45, 11, 3];

  const name = fullName
    ? {
        fullName: { first, last, middle: undefined, suffix: undefined },
        firstName: first, // firstName & lastName are preversed
        lastName: last,
      }
    : { firstName: first, lastName: last };
  return {
    ...name,
    dateOfBirth: createDoB(
      ages[index],
      0,
      dobSlash ? 'MM/dd/yyyy' : 'yyyy-MM-dd',
    ),
    ssn: '000111234',
    relationshipToVeteran: ['Spouse', 'Child', 'Child'][index],
    awardIndicator: awarded,
    key: ['spousy-1234', 'penny-1234', 'bob-1234'][index],
    age: ages[index],
    labeledAge: ['45 years old', '11 years old', '3 years old'][index],
  };
};

describe('processDependents', () => {
  const getDependentsArray = (props1, props2) => [
    getDependent(props1),
    getDependent(props2),
  ];

  it('should return empty arrays in processed data', () => {
    const result = processDependents();
    expect(result).to.deep.equal({
      hasError: false, // no API error
      awarded: [],
      notAwarded: [],
    });
  });

  it('should process prefill with v3 toggle disabled data', () => {
    const result = processDependents({
      prefill: true,
      dependents: getDependentsArray({ index: 0 }, { index: 1, awarded: 'N' }),
    });
    expect(result).to.deep.equal({
      hasError: false,
      awarded: [getDependent({ index: 0 })],
      notAwarded: [getDependent({ index: 1, awarded: 'N' })],
    });
  });

  it('should process successful prefill with v3 toggle enabled data', () => {
    const result = processDependents({
      prefill: true,
      dependents: {
        success: 'true',
        dependents: getDependentsArray(
          { index: 0 },
          { index: 1, awarded: 'N' },
        ),
      },
    });
    expect(result).to.deep.equal({
      hasError: false,
      awarded: [getDependent({ index: 0 })],
      notAwarded: [getDependent({ index: 1, awarded: 'N' })],
    });
  });

  it('should process non-successful prefill with v3 toggle enabled data', () => {
    const result = processDependents({
      prefill: true,
      dependents: { success: 'false', dependents: [] },
    });
    expect(result).to.deep.equal({
      hasError: true,
      awarded: [],
      notAwarded: [],
    });
  });

  it('should process successful API loaded data', () => {
    const result = processDependents({
      prefill: false,
      dependents: {
        loading: false,
        error: null,
        data: getDependentsArray(
          { fullName: false, dobSlash: true, index: 0 },
          { fullName: false, dobSlash: true, index: 1, awarded: 'N' },
        ),
      },
    });
    expect(result).to.deep.equal({
      hasError: false,
      awarded: [getDependent({ index: 0 })],
      notAwarded: [
        getDependent({
          index: 1,
          awarded: 'N',
        }),
      ],
    });
  });
});

describe('updateDependentsInFormData', () => {
  it('should add PICKLIST_DATA to formData', () => {
    const formData = { test: true };
    const dependentData = {
      hasDependents: true,
      awarded: [getDependent({ index: 0 })],
      notAwarded: [getDependent({ index: 1, awarded: 'N' })],
    };

    const result = updateDependentsInFormData(formData, dependentData);
    expect(result).to.deep.equal({
      test: true,
      [PICKLIST_DATA]: [getDependent({ index: 0 })],
      dependents: dependentData,
    });
  });

  it('should start with API data and merge PICKLIST_DATA into', () => {
    const formData = {
      test: true,
      [PICKLIST_DATA]: [getDependent({ index: 0 }), getDependent({ index: 2 })],
    };
    const dependentData = {
      hasDependents: true,
      awarded: [getDependent({ index: 1 }), getDependent({ index: 2 })],
      notAwarded: [getDependent({ index: 0 })],
    };

    const result = updateDependentsInFormData(formData, dependentData);
    expect(result).to.deep.equal({
      test: true,
      [PICKLIST_DATA]: [getDependent({ index: 1 }), getDependent({ index: 2 })],
      dependents: {
        hasDependents: true,
        awarded: [getDependent({ index: 1 }), getDependent({ index: 2 })],
        notAwarded: [getDependent({ index: 0 })],
      },
    });
  });
});
