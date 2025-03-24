import { expect } from 'chai';
import { randomizeOrder } from './randomizer';

const imagePaths = [
  'babu',
  'britton',
  'clark',
  'cogswell',
  'dinh',
  'henline',
  'pickard-locke',
  'singleton',
];

describe('util: randomizer', () => {
  it('should return 3 randomly generated portrait strings', () => {
    const sample = randomizeOrder(imagePaths);
    expect(sample.length).to.eq(3);
    expect(imagePaths).to.contain(sample[0]);
    expect(imagePaths).to.contain(sample[1]);
    expect(imagePaths).to.contain(sample[2]);

    const sample2 = randomizeOrder(imagePaths);
    expect(sample2.length).to.eq(3);
    expect(imagePaths).to.contain(sample2[0]);
    expect(imagePaths).to.contain(sample2[1]);
    expect(imagePaths).to.contain(sample2[2]);
    expect(sample).not.to.deep.eq(sample2);
  });
});
