import { expect } from 'chai';

import { isEmptyObject, setInitialEditMode } from '../../utils/helpers';

describe('isEmptyObject', () => {
  it('should return true for an empty object', () => {
    expect(isEmptyObject({})).to.be.true;
  });
  it('should return true for non objects or filled objects', () => {
    expect(isEmptyObject('')).to.be.false;
    expect(isEmptyObject([])).to.be.false;
    expect(isEmptyObject('test')).to.be.false;
    expect(isEmptyObject(null)).to.be.false;
    expect(isEmptyObject(true)).to.be.false;
    expect(isEmptyObject(() => {})).to.be.false;
    expect(isEmptyObject({ test: '' })).to.be.false;
  });
});

describe('setInitialEditMode', () => {
  it('should set edit mode when missing data', () => {
    [
      [{}],
      [{ issue: 'test' }],
      [{ decisionDate: '2000-01-01' }],
      [{ issue: '', decisionDate: '' }],
      [{ issue: undefined, decisionDate: undefined }],
    ].forEach(test => {
      expect(setInitialEditMode(test)).to.deep.equal([true]);
    });
    expect(
      setInitialEditMode([
        { issue: '', decisionDate: '2000-01-01' },
        { issue: 'test', decisionDate: '' },
      ]),
    ).to.deep.equal([true, true]);
  });
  it('should not set edit mode when data exists', () => {
    expect(
      setInitialEditMode([{ issue: 'test', decisionDate: '2000-01-01' }]),
    ).to.deep.equal([false]);
    expect(
      setInitialEditMode([
        { issue: 'test', decisionDate: '2000-01-01' },
        { issue: 'test2', decisionDate: '2000-01-02' },
      ]),
    ).to.deep.equal([false, false]);
  });
});
