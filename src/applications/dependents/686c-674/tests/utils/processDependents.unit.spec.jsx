import { expect } from 'chai';

import {
  slugifyKey,
  processDependents,
  updateDependentsInFormData,
} from '../../utils/processDependents';
import { PICKLIST_DATA } from '../../config/constants';
import { createDoB } from '../test-helpers';

const getDependent = ({
  index = 0,
  fullName = true,
  dobSlash = false,
  relKey = true, // true = relationship, false = relationshipToVeteran (prefill)
  awarded = 'Y',
} = {}) => {
  const last = 'FOSTER';
  const first = ['SPOUSY', 'PENNY', 'BOB'][index];
  const keys = ['spousy-1234', 'penny-1234', 'bob-1234'];
  const relationships = ['Spouse', 'Child', 'Child'];
  const ages = [45, 11, 3];
  const labeledAges = ['45 years old', '11 years old', '3 years old'];

  const name = fullName
    ? {
        fullName: { first, last, middle: undefined, suffix: undefined },
        firstName: first, // firstName & lastName are preversed
        lastName: last,
      }
    : { firstName: first, lastName: last };
  const relationship = relKey
    ? { relationship: relationships[index] }
    : {
        relationship: relationships[index],
        relationshipToVeteran: relationships[index],
      };

  return {
    ...name,
    dateOfBirth: createDoB(
      ages[index],
      0,
      dobSlash ? 'MM/dd/yyyy' : 'yyyy-MM-dd',
    ),
    ssn: '000111234',
    ...relationship,
    awardIndicator: awarded,
    key: keys[index],
    age: ages[index],
    labeledAge: labeledAges[index],
  };
};

describe('slugifyKey', () => {
  it('should return a slugified key based on first name and last 4 of ssn', () => {
    const dependent = {
      fullName: { first: 'Katie' },
      ssn: '123456789',
    };
    const result = slugifyKey(dependent);
    expect(result).to.equal('katie-6789');
  });
  it('should return a slugified key with an empty first name & ssn', () => {
    const result = slugifyKey({});
    expect(result).to.equal('-');
  });
});

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
      awarded: [getDependent({ relKey: false, index: 0 })],
      notAwarded: [getDependent({ relKey: false, index: 1, awarded: 'N' })],
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
      awarded: [getDependent({ relKey: false, index: 0 })],
      notAwarded: [getDependent({ relKey: false, index: 1, awarded: 'N' })],
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
          { fullName: false, dobSlash: true, relKey: false, index: 0 },
          {
            fullName: false,
            dobSlash: true,
            relKey: false,
            index: 1,
            awarded: 'N',
          },
        ),
      },
    });
    expect(result).to.deep.equal({
      hasError: false,
      awarded: [getDependent({ relKey: false, index: 0 })],
      notAwarded: [
        getDependent({
          relKey: false,
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
