import { expect } from 'chai';

import { dependsOn } from '../../../utils/conditional';

describe('dependsOn', () => {
  const formData = {
    booleanVal: true,
    stringVal: 'a',
    numberVal: 1,
  };

  describe('`and` operator', () => {
    it('returns true with all true conditions and an `and` operator.', () => {
      const dependsObject = {
        operator: 'and',
        conditions: [
          {
            field: 'booleanVal',
            value: true,
          },
          {
            field: 'stringVal',
            value: 'a',
          },
          {
            field: 'numberVal',
            value: 1,
          },
        ],
      };

      const result = dependsOn(dependsObject)(formData);
      expect(result).to.be.true;
    });

    it('returns false with at least one false condition and an `and` operator.', () => {
      const dependsObject = {
        operator: 'and',
        conditions: [
          {
            field: 'booleanVal',
            value: false, // This is not the actual value of `booleanVal`, so this check should be false
          },
          {
            field: 'stringVal',
            value: 'a',
          },
          {
            field: 'numberVal',
            value: 1,
          },
        ],
      };

      const result = dependsOn(dependsObject)(formData);
      expect(result).to.be.false;
    });
  });

  describe('`or` operator', () => {
    it('returns true with all true conditions and an `or` operator.', () => {
      const dependsObject = {
        operator: 'or',
        conditions: [
          {
            field: 'booleanVal',
            value: true,
          },
          {
            field: 'stringVal',
            value: 'a',
          },
          {
            field: 'numberVal',
            value: 1,
          },
        ],
      };

      const result = dependsOn(dependsObject)(formData);
      expect(result).to.be.true;
    });

    it('returns true with at least one true condition and an `or` operator.', () => {
      const dependsObject = {
        operator: 'or',
        conditions: [
          {
            field: 'booleanVal',
            value: false, // This is not the actual value of `booleanVal`, so this check should be false
          },
          {
            field: 'stringVal',
            value: 'b', // This is not the actual value of `stringVal`, so this check should be false
          },
          {
            field: 'numberVal',
            value: 1, // This IS the actual value of `numberVal`, so this check should be true
          },
        ],
      };

      const result = dependsOn(dependsObject)(formData);
      expect(result).to.be.true;
    });

    it('returns false with no true condition and an `or` operator.', () => {
      const dependsObject = {
        operator: 'or',
        conditions: [
          {
            field: 'booleanVal',
            value: false, // This is not the actual value of `booleanVal`, so this check should be false
          },
          {
            field: 'stringVal',
            value: 'b', // This is not the actual value of `stringVal`, so this check should be false
          },
          {
            field: 'numberVal',
            value: 2, // This is not the actual value of `numberVal`, so this check should be false
          },
        ],
      };

      const result = dependsOn(dependsObject)(formData);
      expect(result).to.be.false;
    });
  });
});
