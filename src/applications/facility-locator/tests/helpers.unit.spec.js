import { expect } from 'chai';
import { areBoundsEqual } from '../utils/helpers';

describe('Locator Helper Method Tests', () => {
  describe('areBoundsEqual Tests', () => {
    it('Should handle valid input', () => {
      const bbox1 = [-78.19, 38.14, -76.69, 39.64];
      const bbox2 = [-78.19, 38.14, -76.69, 39.64];

      const result = areBoundsEqual(bbox1, bbox2);

      expect(result).to.eql(true);
    });

    it('Should handle unequal input', () => {
      const bbox1 = [-78.19, 38.14, -76.69, 39.64];
      const bbox2 = [-76.69, 39.64, -78.19, 38.14];

      const result = areBoundsEqual(bbox1, bbox2);

      expect(result).to.eql(false);
    });

    it('Should handle null/missing input', () => {
      // Both Inputs Invalid
      let bbox1 = [-78.128];
      let bbox2 = [];
      let result = areBoundsEqual(bbox1, bbox2);
      expect(result).to.eql(false);

      // First Input Invalid
      bbox1 = [-76.69];
      bbox2 = [-76.69, 39.64, -78.19, 38.14];
      result = areBoundsEqual(bbox1, bbox2);
      expect(result).to.eql(false);

      // Second Input Invalid
      bbox1 = [-76.69, 39.64, -78.19, 38.14];
      bbox2 = [-76.69];
      result = areBoundsEqual(bbox1, bbox2);
      expect(result).to.eql(false);

      // First Input null
      bbox1 = null;
      bbox2 = [-76.69, 39.64, -78.19, 38.14];
      result = areBoundsEqual(bbox1, bbox2);
      expect(result).to.eql(false);

      // Second Input null
      bbox1 = [-76.69, 39.64, -78.19, 38.14];
      bbox2 = null;
      result = areBoundsEqual(bbox1, bbox2);
      expect(result).to.eql(false);

      // First Input undefined
      bbox1 = undefined;
      bbox2 = [-76.69, 39.64, -78.19, 38.14];
      result = areBoundsEqual(bbox1, bbox2);
      expect(result).to.eql(false);

      // Second Input undefined
      bbox1 = [-76.69, 39.64, -78.19, 38.14];
      bbox2 = undefined;
      result = areBoundsEqual(bbox1, bbox2);
      expect(result).to.eql(false);
    });
  });
});
