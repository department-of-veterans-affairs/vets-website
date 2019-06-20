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

const ratingArrayTwo = [
  {
    rating: 60,
    description: 'left eye',
  },
  {
    rating: 20,
    description: 'knee',
  },
  {
    rating: 40,
    description: '',
  },
  {
    rating: 10,
    description: 'hearing loss',
  },
];

const ratingArrayThree = [
  {
    rating: 10,
    description: 'left eye',
  },
  {
    rating: 20,
    description: 'knee',
  },
  {
    rating: 40,
    description: '',
  },
  {
    rating: 90,
    description: 'hearing loss',
  },
];

const ratingArrayTens = [
  {
    rating: 10,
    description: '',
  },
  {
    rating: 10,
    description: '',
  },
  {
    rating: 10,
    description: '',
  },
  {
    rating: 10,
    description: '',
  },
  {
    rating: 10,
    description: '',
  },
  {
    rating: 10,
    description: '',
  },
  {
    rating: 10,
    description: '',
  },
  {
    rating: 10,
    description: '',
  },
  {
    rating: 10,
    description: '',
  },
  {
    rating: 10,
    description: '',
  },
];

const ratingArrayTwenties = [
  {
    rating: 20,
    description: '',
  },
  {
    rating: 20,
    description: '',
  },
];

const ratingArraySix = [
  {
    rating: 80,
    description: '',
  },
  {
    rating: 10,
    description: '',
  },
  {
    rating: 40,
    description: '',
  },
];
const ratingArraySeven = [
  {
    rating: 90,
    description: '',
  },
  {
    rating: 90,
    description: '',
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

describe('Disability Caclulator helper', () => {
  it('should return an array with length of two elements', () => {
    const result = calculateRating(ratingArray);
    expect(result)
      .to.be.an('array')
      .that.has.length(2);
  });

  it('should calculate ', () => {
    const result = calculateRating(noRatings)[0];
    expect(result).to.be.equal(0);
  });

  it('should calculate ', () => {
    const result = calculateRating(ratingArray)[0];
    const actual = calculateRating(ratingArray)[1];
    expect(result).to.be.equal(50);
    expect(actual).to.be.equal(49.6);
  });

  it('should calculate ', () => {
    const result = calculateRating(ratingArrayTwo)[0];
    const actual = calculateRating(ratingArrayTwo)[1];
    expect(result).to.be.equal(80);
    expect(actual).to.be.equal(82.72);
  });

  it('should calculate ', () => {
    const result = calculateRating(ratingArrayThree)[0];
    const actual = calculateRating(ratingArrayThree)[1];
    expect(result).to.be.equal(100);
    expect(actual).to.be.equal(95.68);
  });

  it('should calculate ', () => {
    const result = calculateRating(ratingArrayTens)[0];
    const actual = calculateRating(ratingArrayTens)[1];
    expect(result).to.be.equal(70);
    expect(actual).to.be.equal(65.13);
  });

  it('should calculate ', () => {
    const result = calculateRating(ratingArrayTwenties)[0];
    const actual = calculateRating(ratingArrayTwenties)[1];
    expect(result).to.be.equal(40);
    expect(actual).to.be.equal(36);
  });

  it('should calculate ', () => {
    const result = calculateRating(ratingArraySix)[0];
    const actual = calculateRating(ratingArraySix)[1];
    expect(result).to.be.equal(90);
    expect(actual).to.be.equal(89.2);
  });

  it('should calculate ', () => {
    const result = calculateRating(ratingArraySeven)[0];
    const actual = calculateRating(ratingArraySeven)[1];
    expect(result).to.be.equal(100);
    expect(actual).to.be.equal(99);
  });
});
