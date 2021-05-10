import { expect } from 'chai';

import { SELECTED } from '../../constants';
import {
  someSelected,
  hasSomeSelected,
  showAddIssueQuestion,
  isEmptyObject,
  setInitialEditMode,
} from '../../utils/helpers';

describe('someSelected', () => {
  it('should return true for issues that have some selected values', () => {
    expect(someSelected([{ [SELECTED]: true }, {}])).to.be.true;
    expect(someSelected([{}, { [SELECTED]: true }, {}])).to.be.true;
    expect(someSelected([{}, {}, {}, { [SELECTED]: true }])).to.be.true;
  });
  it('should return false for issues with no selected values', () => {
    expect(someSelected()).to.be.false;
    expect(someSelected([])).to.be.false;
    expect(someSelected([{}, {}])).to.be.false;
    expect(someSelected([{}, { [SELECTED]: false }, {}])).to.be.false;
    expect(someSelected([{}, {}, {}, { [SELECTED]: false }])).to.be.false;
  });
});

describe('hasSomeSelected', () => {
  const testIssues = (contestableIssues, additionalIssues) =>
    hasSomeSelected({ contestableIssues, additionalIssues });
  it('should return true for issues that have some selected values', () => {
    expect(testIssues([{ [SELECTED]: true }], [{}])).to.be.true;
    expect(testIssues([{}], [{ [SELECTED]: true }, {}])).to.be.true;
    expect(testIssues([{}], [{}, {}, { [SELECTED]: true }])).to.be.true;
    expect(
      testIssues([{}, { [SELECTED]: true }], [{}, {}, { [SELECTED]: true }]),
    ).to.be.true;
  });
  it('should return false for no selected issues', () => {
    expect(testIssues()).to.be.false;
    expect(testIssues([], [])).to.be.false;
    expect(testIssues([{}], [{}])).to.be.false;
    expect(testIssues([{ [SELECTED]: false }], [{}])).to.be.false;
    expect(testIssues([{}], [{ [SELECTED]: false }, {}])).to.be.false;
    expect(testIssues([{}], [{}, {}, { [SELECTED]: false }])).to.be.false;
    expect(
      testIssues([{}, { [SELECTED]: false }], [{}, {}, { [SELECTED]: false }]),
    ).to.be.false;
  });
});

describe('showAddIssueQuestion', () => {
  it('should show add issue question when contestable issues selected', () => {
    expect(showAddIssueQuestion({ contestableIssues: [{ [SELECTED]: true }] }))
      .to.be.true;
  });
  it('should not show add issue question when no issues or none selected', () => {
    expect(showAddIssueQuestion({ contestableIssues: [] })).to.be.false;
    expect(showAddIssueQuestion({ contestableIssues: [{}] })).to.be.false;
    expect(showAddIssueQuestion({ contestableIssues: [{ [SELECTED]: false }] }))
      .to.be.false;
  });
});

describe('isEmptyObject', () => {
  it('should return true for an empty object', () => {
    expect(isEmptyObject({})).to.be.true;
  });
  it('should return true for non objects or filled objects', () => {
    expect(isEmptyObject()).to.be.false;
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
