/**
 * Unit tests for remarks schema
 */

import { expect } from 'chai';
import { remarksSchema } from './remarks';

describe('Remarks Schema', () => {
  it('should validate empty string', () => {
    const result = remarksSchema.safeParse('');
    expect(result.success).to.be.true;
  });

  it('should validate undefined', () => {
    const result = remarksSchema.safeParse(undefined);
    expect(result.success).to.be.true;
  });

  it('should validate valid remarks', () => {
    const result = remarksSchema.safeParse(
      'This is a valid remark about the claim.',
    );
    expect(result.success).to.be.true;
  });

  it('should reject remarks over 1000 characters', () => {
    const longRemarks = 'a'.repeat(1001);
    const result = remarksSchema.safeParse(longRemarks);
    expect(result.success).to.be.false;
    if (!result.success) {
      expect(result.error.issues[0].message).to.include('1000 characters');
    }
  });

  it('should accept remarks exactly 1000 characters', () => {
    const maxRemarks = 'a'.repeat(1000);
    const result = remarksSchema.safeParse(maxRemarks);
    expect(result.success).to.be.true;
  });
});
