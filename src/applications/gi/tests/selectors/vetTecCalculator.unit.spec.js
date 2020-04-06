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
    expect(getCalculatedBenefits(defaultState).outputs.vetTecTuitionFees).toBe(
      'TBD',
    );
  });

  it('should default vetTecScholarships to "TBD"', () => {
    expect(getCalculatedBenefits(defaultState).outputs.vetTecScholarships).toBe(
      '$0',
    );
  });

  it('should default vaPaysToProvider to "TBD"', () => {
    expect(getCalculatedBenefits(defaultState).outputs.vaPaysToProvider).toBe(
      'TBD',
    );
  });

  it('should default quarterVetTecPayment to "TBD"', () => {
    expect(
      getCalculatedBenefits(defaultState).outputs.quarterVetTecPayment,
    ).toBe('TBD');
  });

  it('should default halfVetTecPayment to "TBD"', () => {
    expect(getCalculatedBenefits(defaultState).outputs.halfVetTecPayment).toBe(
      'TBD',
    );
  });

  it('should default outOfPocketTuitionFees to "TBD"', () => {
    expect(
      getCalculatedBenefits(defaultState).outputs.outOfPocketTuitionFees,
    ).toBe('TBD');
  });

  it('should correctly calculate and format vetTecTuitionFees', () => {
    const state = set('calculator.vetTecTuitionFees', '100', defaultState);
    const calculatedBenefits = getCalculatedBenefits(state);
    expect(calculatedBenefits.outputs.vetTecTuitionFees).toBe('$100');
    expect(calculatedBenefits.outputs.vetTecScholarships).toBe('$0');
    expect(calculatedBenefits.outputs.vaPaysToProvider).toBe('$100');
    expect(calculatedBenefits.outputs.quarterVetTecPayment).toBe('$25');
    expect(calculatedBenefits.outputs.halfVetTecPayment).toBe('$50');
  });

  it('should correctly calculate and format vetTecScholarships', () => {
    const state = set('calculator.vetTecScholarships', '100', defaultState);
    const calculatedBenefits = getCalculatedBenefits(state);
    expect(calculatedBenefits.outputs.vetTecTuitionFees).toBe('TBD');
    expect(calculatedBenefits.outputs.vetTecScholarships).toBe('$100');
    expect(calculatedBenefits.outputs.vaPaysToProvider).toBe('TBD');
    expect(calculatedBenefits.outputs.quarterVetTecPayment).toBe('TBD');
    expect(calculatedBenefits.outputs.halfVetTecPayment).toBe('TBD');
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
    expect(calculatedBenefits.outputs.vetTecTuitionFees).toBe('$1,000');
    expect(calculatedBenefits.outputs.vetTecScholarships).toBe('$300');
    expect(calculatedBenefits.outputs.vaPaysToProvider).toBe('$700');
    expect(calculatedBenefits.outputs.quarterVetTecPayment).toBe('$175');
    expect(calculatedBenefits.outputs.halfVetTecPayment).toBe('$350');
  });

  it('should calculate onlineRate as AVGDODBAH constant', () => {
    expect(getCalculatedBenefits(defaultState).outputs.onlineRate).toBe('$800');
  });

  it('should correctly calculate inPersonRate', () => {
    expect(getCalculatedBenefits(defaultState).outputs.inPersonRate).toBe(
      '$1,800',
    );
  });
});
