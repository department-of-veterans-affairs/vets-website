import { expect } from 'chai';
import { canReorderOn } from '../../selectors';
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

let state;

describe('canReorderOn', () => {
  it('returns undefined when state is not set', () => {
    expect(canReorderOn({})).to.equal(undefined);
  });

  it('returns the closest date that supplies are able to be reordered', () => {
    const unavailableSupplies = suppliesData.map(s => ({
      productName: s.productName,
      nextAvailabilityDate: s.nextAvailabilityDate,
    }));
    state = stateFn({ supplies: unavailableSupplies });
    expect(canReorderOn(state)).to.equal('2022-10-16');
  });
});
