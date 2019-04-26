import { expect } from 'chai';
import { set } from 'lodash/fp';

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

  it('should estimate housing for purple heart benefit', () => {
    const state = set(
      'eligibility.cululativeService',
      'purple heart',
      defaultState,
    );
    expect(
      estimatedBenefits(state, { type: 'public', bah: 2000, country: 'usa' })
        .housing.value,
    ).to.equal(2000);
  });

  it('should estimate books for purple heart benefit', () => {
    const state = set(
      'eligibility.cululativeService',
      'purple heart',
      defaultState,
    );
    expect(
      estimatedBenefits(state, { type: 'public', country: 'usa' }).books.value,
    ).to.equal(1000);
  });
});
