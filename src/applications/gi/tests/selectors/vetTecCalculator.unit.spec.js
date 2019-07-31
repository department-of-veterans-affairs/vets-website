import { expect } from 'chai';
import { set } from 'lodash/fp';

import { calculatorConstants } from '../gibct-helpers';
import createCommonStore from '../../../../platform/startup/store';
import reducer from '../../reducers';
import { getCalculatedBenefits } from '../../selectors/vetTecCalculator';

let defaultState = createCommonStore(reducer).getState();

defaultState.constants = {
  constants: {},
  version: calculatorConstants.meta.version,
  inProgress: false,
};

calculatorConstants.data.forEach(c => {
  defaultState.constants.constants[c.attributes.name] = c.attributes.value;
});

defaultState = {
  ...defaultState,
  profile: {
    ...defaultState.profile,
    attributes: {
      dodBah: 1800,
    },

    version: {
      createdAt: '2017-04-15T01:00:03.494Z',
      number: 6,
      preview: false,
    },

    inProgress: false,
  },
  calculator: {
    ...defaultState.calculator,
  },
};

describe('getCalculatedBenefits', () => {
  it('should default vetTecTuitionFees to "TBD"', () => {
    expect(
      getCalculatedBenefits(defaultState).outputs.vetTecTuitionFees,
    ).to.equal('TBD');
  });

  it('should default vetTecScholarships to "TBD"', () => {
    expect(
      getCalculatedBenefits(defaultState).outputs.vetTecScholarships,
    ).to.equal('$0');
  });

  it('should default vaPaysToProvider to "TBD"', () => {
    expect(
      getCalculatedBenefits(defaultState).outputs.vaPaysToProvider,
    ).to.equal('TBD');
  });

  it('should default quarterVetTecPayment to "TBD"', () => {
    expect(
      getCalculatedBenefits(defaultState).outputs.quarterVetTecPayment,
    ).to.equal('TBD');
  });

  it('should default halfVetTecPayment to "TBD"', () => {
    expect(
      getCalculatedBenefits(defaultState).outputs.halfVetTecPayment,
    ).to.equal('TBD');
  });

  it('should default outOfPocketTuitionFees to "TBD"', () => {
    expect(
      getCalculatedBenefits(defaultState).outputs.outOfPocketTuitionFees,
    ).to.equal('TBD');
  });

  it('should correctly calculate and format vetTecTuitionFees', () => {
    const state = set('calculator.vetTecTuitionFees', '100', defaultState);
    const calculatedBenefits = getCalculatedBenefits(state);
    expect(calculatedBenefits.outputs.vetTecTuitionFees).to.equal('$100');
    expect(calculatedBenefits.outputs.vetTecScholarships).to.equal('$0');
    expect(calculatedBenefits.outputs.vaPaysToProvider).to.equal('$100');
    expect(calculatedBenefits.outputs.quarterVetTecPayment).to.equal('$25');
    expect(calculatedBenefits.outputs.halfVetTecPayment).to.equal('$50');
  });

  it('should correctly calculate and format vetTecScholarships', () => {
    const state = set('calculator.vetTecScholarships', '100', defaultState);
    const calculatedBenefits = getCalculatedBenefits(state);
    expect(calculatedBenefits.outputs.vetTecTuitionFees).to.equal('TBD');
    expect(calculatedBenefits.outputs.vetTecScholarships).to.equal('$100');
    expect(calculatedBenefits.outputs.vaPaysToProvider).to.equal('TBD');
    expect(calculatedBenefits.outputs.quarterVetTecPayment).to.equal('TBD');
    expect(calculatedBenefits.outputs.halfVetTecPayment).to.equal('TBD');
  });

  it('should correctly calculate and format fields based on vetTecScholarships and vetTecTuitionFees', () => {
    const state = {
      ...defaultState,
      calculator: {
        ...defaultState.calculator,
        vetTecTuitionFees: 1000,
        vetTecScholarships: 300,
      },
    };

    const calculatedBenefits = getCalculatedBenefits(state);
    expect(calculatedBenefits.outputs.vetTecTuitionFees).to.equal('$1,000');
    expect(calculatedBenefits.outputs.vetTecScholarships).to.equal('$300');
    expect(calculatedBenefits.outputs.vaPaysToProvider).to.equal('$700');
    expect(calculatedBenefits.outputs.quarterVetTecPayment).to.equal('$175');
    expect(calculatedBenefits.outputs.halfVetTecPayment).to.equal('$350');
  });

  it('should calculate onlineRate as AVGDODBAH constant', () => {
    expect(getCalculatedBenefits(defaultState).outputs.onlineRate).to.equal(
      '$800/mo',
    );
  });

  it('should correctly calculate inPersonRate', () => {
    expect(getCalculatedBenefits(defaultState).outputs.inPersonRate).to.equal(
      '$1,800/mo',
    );
  });
});
