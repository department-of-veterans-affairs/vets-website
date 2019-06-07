import { expect } from 'chai';
import { calculateRating } from '../../utils/helpers';

const ratingArray = [
  {
    rating: 30,
    description: 'arm',
  },
  {
    rating: 10,
    description: 'leg',
  },
  {
    rating: 20,
    description: 'ears',
  },
];

const noRatings = [
  {
    rating: 0,
    description: 'arm',
  },
  {
    rating: 0,
    description: 'leg',
  },
  {
    rating: 0,
    description: 'ears',
  },
];
describe('Disabilty  Caclulator helper', () => {
  it('should return an array with length of two elements', () => {
    const result = calculateRating(ratingArray);
    expect(result)
      .to.be.an('array')
      .that.has.length(2);
  });

  it('should calculate ', () => {
    const result = calculateRating(ratingArray)[0];
    expect(result).to.be.equal(50);
  });
});
