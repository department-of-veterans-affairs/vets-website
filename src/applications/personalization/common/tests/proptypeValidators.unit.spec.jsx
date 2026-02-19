import { expect } from 'chai';
import { numberBetween, optionalNumberBetween } from '../proptypeValidators';

describe('personalization proptypeValidators', () => {
  describe('numberBetween', () => {
    it('returns null when value is within range', () => {
      const validator = numberBetween(1, 3);
      const result = validator({ count: 2 }, 'count', 'TestComponent');

      expect(result).to.equal(null);
    });

    it('allows the min and max boundaries', () => {
      const validator = numberBetween(1, 3);

      expect(validator({ count: 1 }, 'count', 'TestComponent')).to.equal(null);
      expect(validator({ count: 3 }, 'count', 'TestComponent')).to.equal(null);
    });

    it('returns an error when value is below min', () => {
      const validator = numberBetween(1, 3);
      const result = validator({ count: 0 }, 'count', 'TestComponent');

      expect(result).to.be.instanceOf(Error);
      expect(result.message).to.equal(
        'Prop count must be a number between 1 and 3 on TestComponent',
      );
    });

    it('returns an error when value is above max', () => {
      const validator = numberBetween(1, 3);
      const result = validator({ count: 4 }, 'count', 'TestComponent');

      expect(result).to.be.instanceOf(Error);
      expect(result.message).to.equal(
        'Prop count must be a number between 1 and 3 on TestComponent',
      );
    });

    it('returns an error when value is not a number', () => {
      const validator = numberBetween(1, 3);
      const result = validator({ count: '2' }, 'count', 'TestComponent');

      expect(result).to.be.instanceOf(Error);
      expect(result.message).to.equal(
        'Prop count must be a number between 1 and 3 on TestComponent',
      );
    });
  });

  describe('optionalNumberBetween', () => {
    it('returns null when value is within range', () => {
      const validator = optionalNumberBetween(10, 20);
      const result = validator({ count: 15 }, 'count', 'TestComponent');

      expect(result).to.equal(null);
    });

    it('returns null when value is null', () => {
      const validator = optionalNumberBetween(10, 20);
      const result = validator({ count: null }, 'count', 'TestComponent');

      expect(result).to.equal(null);
    });

    it('returns null when value is undefined', () => {
      const validator = optionalNumberBetween(10, 20);
      const result = validator({}, 'count', 'TestComponent');

      expect(result).to.equal(null);
    });

    it('returns an error when value is not a number', () => {
      const validator = optionalNumberBetween(10, 20);
      const result = validator({ count: '15' }, 'count', 'TestComponent');

      expect(result).to.be.instanceOf(Error);
      expect(result.message).to.equal(
        'Prop count must be a number between 10 and 20 on TestComponent',
      );
    });
  });
});
