import { expect } from 'chai';
import { extractOrderedTest } from '../../reducers/labsAndTests';

describe('extractOrderedTest', () => {
  const TEST_NAME = 'Test Name';
  const record = {
    contained: [{ id: 'ServiceRequest-1', code: { text: TEST_NAME } }],
    basedOn: [{ reference: '#ServiceRequest-1' }],
  };

  it('returns the code when present', () => {
    expect(extractOrderedTest(record)).to.equal(TEST_NAME);
  });

  it('returns null when basedOn is not found', () => {
    const badRec = {
      contained: [{ id: 'ServiceRequest-1', code: { text: TEST_NAME } }],
    };
    expect(extractOrderedTest(badRec)).to.be.null;
  });

  it('returns null when the reference is not found', () => {
    const badRec = {
      contained: [{ id: 'ServiceRequest-1', code: { text: TEST_NAME } }],
      basedOn: [{ reference: '#Not-Found' }],
    };
    expect(extractOrderedTest(badRec)).to.be.null;
  });

  it('returns null when the ServiceRequest has no "code" field', () => {
    const badRec = {
      contained: [{ id: 'ServiceRequest-1', ignore: 'wrong field' }],
      basedOn: [{ reference: '#ServiceRequest-1' }],
    };
    expect(extractOrderedTest(badRec)).to.be.null;
  });

  it('returns null when "code" has no "text" field', () => {
    const badRec = {
      contained: [{ id: 'ServiceRequest-1', code: { ignore: 'wrong field' } }],
      basedOn: [{ reference: '#ServiceRequest-1' }],
    };
    expect(extractOrderedTest(badRec)).to.be.null;
  });
});
