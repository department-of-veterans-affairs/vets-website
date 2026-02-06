import { expect } from 'chai';
import veteranAddress from '../../../pages/veteranAddress';

describe('Chapter 36 veteranAddress page', () => {
  it('defines mailing address withing veterainInformation in the schema', () => {
    expect(veteranAddress.schema.properties).to.have.property(
      'veteranMailingAddress',
    );
  });
});
