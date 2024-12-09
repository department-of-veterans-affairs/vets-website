import { expect } from 'chai';
import { selectSupplies, selectUnavailableSupplies } from '../../selectors';
import { supplies as suppliesData } from '../../mocks/in-progress-forms/mdot/supplies';

const stateFn = ({ supplies = [] } = {}) => ({
  mdotInProgressForm: {
    formData: {
      supplies,
    },
    error: false,
    loading: false,
  },
});

let result;
let state;

describe('selectSupplies', () => {
  it('returns [] when state is not set', () => {
    expect(selectSupplies({})).to.deep.equal([]);
  });

  it('returns supplies that are availableForReorder', () => {
    state = stateFn({ supplies: suppliesData });
    result = selectSupplies(state);
    expect(suppliesData.length).to.eq(4);
    expect(result.length).to.eq(3);
    const productNames = result.map(({ productName }) => productName);
    const expectedProductNames = [
      'ERHK HE11 680 MINI',
      'AIRFIT F10 M',
      'AIRFIT P10',
    ];
    expect(productNames).to.deep.equal(expectedProductNames);
  });
});

describe('selectUnavailableSupplies', () => {
  it('returns [] when state is not set', () => {
    expect(selectUnavailableSupplies({})).to.deep.equal([]);
  });

  it('returns supplies that are not availableForReorder', () => {
    state = stateFn({ supplies: suppliesData });
    result = selectUnavailableSupplies(state);
    expect(suppliesData.length).to.eq(4);
    expect(result.length).to.eq(1);
    const productNames = result.map(({ productName }) => productName);
    const expectedProductNames = ['AIRCURVE10-ASV-CLIMATELINE'];
    expect(productNames).to.deep.equal(expectedProductNames);
  });
});
