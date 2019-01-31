import { expect } from 'chai';
import { areBoundsEqual, validateIdString } from '../utils/helpers';

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

describe('Validate ID Strings for Breadcrumb', () => {
  it('Should handle facility ID pattern letters_, letter, digits', () => {
    const result = validateIdString('/facility/abc_s1130', '/facility');
    expect(result.length).to.eql(1);
  });

  it('Should handle facility ID pattern letters_, digits, letters', () => {
    const result = validateIdString('/facility/abc_691GE', '/facility');
    expect(result.length).to.eql(1);
  });

  it('Should handle facility ID pattern letters_, digits', () => {
    const result = validateIdString('/facility/abc_827', '/facility');
    expect(result.length).to.eql(1);
  });

  it('Should handle provider ID pattern letters_, letter, digits', () => {
    const result = validateIdString('/provider/abc_s1130', '/provider');
    expect(result.length).to.eql(1);
  });

  it('Should handle provider ID pattern letters_, digits, letters', () => {
    const result = validateIdString('/provider/abc_691GE', '/provider');
    expect(result.length).to.eql(1);
  });

  it('Should handle provider ID pattern letters_, digits', () => {
    const result = validateIdString('/provider/abc_827', '/provider');
    expect(result.length).to.eql(1);
  });

  it('Should handle other facility designations', () => {
    const result = validateIdString('/hospital/abc_123', '/hospital');
    expect(result.length).to.eql(1);
  });

  it('Should not handle facility patterns with 0 characters before underscore', () => {
    const result = validateIdString('/facility/_abcdefghijklmno', '/facility');
    expect(result).to.eql(null);
  });

  it('Should not handle facility patterns with more than 15 characters before underscore', () => {
    const result = validateIdString(
      '/facility/abcdefghijklmno_abcdefghijklmnop',
      '/facility',
    );
    expect(result).to.eql(null);
  });

  it('Should not handle facility patterns with 0 characters after underscore', () => {
    const result = validateIdString('/facility/abc_', '/facility');
    expect(result).to.eql(null);
  });

  it('Should not handle facility patterns with more than 15 characters after underscore', () => {
    const result = validateIdString(
      '/facility/abc_abcdefghijklmnop',
      '/facility',
    );
    expect(result).to.eql(null);
  });

  it('Should not handle provider patterns with 0 characters before underscore', () => {
    const result = validateIdString('/provider/_abcdefghijklmno', '/provider');
    expect(result).to.eql(null);
  });

  it('Should not handle provider patterns with more than 15 characters before underscore', () => {
    const result = validateIdString(
      '/provider/abcdefghijklmno_abcdefghijklmnop',
      '/provider',
    );
    expect(result).to.eql(null);
  });

  it('Should not handle provider patterns with 0 characters after underscore', () => {
    const result = validateIdString('/provider/abc_', '/provider');
    expect(result).to.eql(null);
  });

  it('Should not handle provider patterns with more than 15 characters after underscore', () => {
    const result = validateIdString(
      '/provider/abc_abcdefghijklmnop',
      '/provider',
    );
    expect(result).to.eql(null);
  });

  it('Should not handle patterns without an underscore', () => {
    const result = validateIdString('/facility/abcdefg', '/facility');
    expect(result).to.eql(null);
  });

  it('Should not handle patterns without a type prefix', () => {
    const result = validateIdString('/abcdefg_abcdefg', '/');
    expect(result).to.eql(null);
  });
});
