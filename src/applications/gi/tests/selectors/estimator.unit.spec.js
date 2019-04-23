import { expect } from 'chai';

import reducer from '../../reducers';
import { calculatorConstants } from '../gibct-helpers';
import createCommonStore from 'platform/startup/store';
import { estimatedBenefits } from '../../selectors/estimator';

const defaultState = createCommonStore(reducer).getState();

defaultState.constants = {
  constants: {},
  version: calculatorConstants.meta.version,
  inProgress: false,
};

calculatorConstants.data.forEach(c => {
  defaultState.constants.constants[c.attributes.name] = c.attributes.value;
});

describe('estimatedBenefits', () => {
  it('should estimate no tuition allowance for ojt school', () => {
    expect(
      estimatedBenefits(defaultState, {
        type: 'ojt',
        bah: 1000,
        country: 'usa',
      }).tuition.value,
    ).to.equal('N/A');
  });

  it('lower DoD rate than VA should result in DoD rate displaying', () => {
    expect(
      estimatedBenefits(defaultState, {
        bah: 1000,
        dodBah: 500,
        country: 'usa',
      }).housing.value,
    ).to.equal(500);
  });
});
