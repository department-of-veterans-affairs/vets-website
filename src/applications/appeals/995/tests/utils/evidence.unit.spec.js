import { expect } from 'chai';

import {
  hasVAEvidence,
  hasPrivateEvidence,
  hasOtherEvidence,
  getIndex,
  evidenceNeedsUpdating,
  removeNonSelectedIssuesFromEvidence,
} from '../../utils/evidence';
import { EVIDENCE_VA, EVIDENCE_PRIVATE, EVIDENCE_OTHER } from '../../constants';

import { SELECTED } from '../../../shared/constants';

describe('getIndex', () => {
  const testData = ['', '', ''];
  it('should return search param index', () => {
    expect(getIndex(testData, null, '?index=1')).to.eq(1);
  });
  it('should return data length for larger indexes', () => {
    expect(getIndex(testData, null, '?index=9')).to.eq(testData.length);
  });
  it('should return zero for no index', () => {
    expect(getIndex(testData, null, '?test=a')).to.eq(0);
  });
  it('should return zero for non-number indexes', () => {
    expect(getIndex(testData, null, '?index=a')).to.eq(0);
  });
  it('should return testIndex when missing an index', () => {
    expect(getIndex(testData, '2', '?test=a')).to.eq(2);
  });
  it('should return zero when missing an index & testIndex', () => {
    expect(getIndex(testData, null, '?test=a')).to.eq(0);
  });
});

describe('hasVAEvidence', () => {
  it('should return expected value', () => {
    expect(hasVAEvidence({ [EVIDENCE_VA]: undefined })).to.be.undefined;
    expect(hasVAEvidence({ [EVIDENCE_VA]: true })).to.be.true;
    expect(hasVAEvidence({ [EVIDENCE_VA]: false })).to.be.false;
  });
});

describe('hasPrivateEvidence', () => {
  it('should return expected value', () => {
    expect(hasPrivateEvidence({ [EVIDENCE_PRIVATE]: undefined })).to.be
      .undefined;
    expect(hasPrivateEvidence({ [EVIDENCE_PRIVATE]: true })).to.be.true;
    expect(hasPrivateEvidence({ [EVIDENCE_PRIVATE]: false })).to.be.false;
  });
});

describe('hasOtherEvidence', () => {
  it('should return expected value', () => {
    expect(hasOtherEvidence({ [EVIDENCE_OTHER]: undefined })).to.be.undefined;
    expect(hasOtherEvidence({ [EVIDENCE_OTHER]: true })).to.be.true;
    expect(hasOtherEvidence({ [EVIDENCE_OTHER]: false })).to.be.false;
  });
});

describe('evidenceNeedsUpdating', () => {
  const getEvidence = ({
    hasVa = true,
    hasPrivate = true,
    addIssue = 'abc',
    locations = [{ issues: ['abc', 'def'] }],
    providerFacility = [{ issues: ['abc', 'def'] }],
  } = {}) => {
    return {
      [EVIDENCE_VA]: hasVa,
      [EVIDENCE_PRIVATE]: hasPrivate,
      contestedIssues: [
        {
          attributes: { ratingIssueSubjectText: 'def' },
          [SELECTED]: true,
        },
      ],
      additionalIssues: addIssue ? [{ issue: addIssue, [SELECTED]: true }] : [],
      locations,
      providerFacility,
    };
  };

  it('should return false if no VA evidence selected', () => {
    const evidence = getEvidence({ hasVa: false, hasPrivate: false });
    expect(evidenceNeedsUpdating(evidence)).to.be.false;
  });
  it('should return false if VA evidence undefined', () => {
    const evidence = getEvidence({ hasVa: false, hasPrivate: false });
    expect(evidenceNeedsUpdating({ ...evidence, locations: null })).to.be.false;
  });
  it('should return false if provider facility evidence undefined', () => {
    const evidence = getEvidence({ hasVa: false, hasPrivate: false });
    expect(evidenceNeedsUpdating({ ...evidence, providerFacility: null })).to.be
      .false;
  });
  it('should return false if no updates needed', () => {
    const evidence = getEvidence();
    expect(evidenceNeedsUpdating(evidence)).to.be.false;
  });
  it('should return true if issue no longer exists', () => {
    const evidence = getEvidence({ addIssue: '' });
    expect(evidenceNeedsUpdating(evidence)).to.be.true;
  });
  it('should return true if issue is renamed', () => {
    const evidence = getEvidence({ addIssue: 'acb' });
    expect(evidenceNeedsUpdating(evidence)).to.be.true;
  });
});

describe('removeNonSelectedIssuesFromEvidence', () => {
  const getData = (addLocation, addProvider) => ({
    contestedIssues: [
      { attributes: { ratingIssueSubjectText: 'test 1' }, [SELECTED]: true },
      { attributes: { ratingIssueSubjectText: 'test 3' }, [SELECTED]: false },
    ],
    additionalIssues: [
      { issue: 'test 2', [SELECTED]: true },
      { issue: 'test 4', [SELECTED]: false },
    ],
    locations: [
      {
        foo: true,
        bar: false,
        issues: ['test 1'],
      },
      {
        foo: true,
        bar: false,
        issues: ['test 1', 'test 2', addLocation].filter(Boolean),
      },
    ],
    providerFacility: [
      {
        foo: false,
        bar: true,
        issues: ['test 1'],
      },
      {
        foo: false,
        bar: true,
        issues: ['test 1', 'test 2', addProvider].filter(Boolean),
      },
    ],
  });

  const expected = getData();
  it('should return un-modified evidence issues', () => {
    const data = getData('', '');
    const result = removeNonSelectedIssuesFromEvidence(data);
    expect(result).to.deep.eq(expected);
  });
  it('should return remove non-selected location issues', () => {
    const data = getData('test 3', '');
    const result = removeNonSelectedIssuesFromEvidence(data);
    expect(result).to.deep.eq(expected);
  });
  it('should return remove non-selected facility issues', () => {
    const data = getData('', 'test 4');
    const result = removeNonSelectedIssuesFromEvidence(data);
    expect(result).to.deep.eq(expected);
  });
  it('should return remove non-selected issues', () => {
    const data = getData('test 3', 'test 4');
    const result = removeNonSelectedIssuesFromEvidence(data);
    expect(result).to.deep.eq(expected);
  });
});
