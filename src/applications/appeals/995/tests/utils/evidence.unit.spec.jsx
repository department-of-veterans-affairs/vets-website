import { expect } from 'chai';
import sinon from 'sinon';
import {
  getVAEvidence,
  getPrivateEvidence,
  getOtherEvidence,
  getIndex,
  evidenceNeedsUpdating,
  removeNonSelectedIssuesFromEvidence,
  onFormLoaded,
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

describe('getVAEvidence', () => {
  it('should return expected value', () => {
    expect(
      getVAEvidence({ [EVIDENCE_VA]: undefined, locations: [{}] }),
    ).to.deep.equal([]);

    expect(
      getVAEvidence({ [EVIDENCE_VA]: true, locations: [{}] }),
    ).to.deep.equal([{}]);

    expect(getVAEvidence({ [EVIDENCE_VA]: true, locations: [] })).to.deep.equal(
      [],
    );

    expect(
      getVAEvidence({ [EVIDENCE_VA]: false, locations: [{}] }),
    ).to.deep.equal([]);

    expect(
      getVAEvidence({ [EVIDENCE_VA]: true, locations: [{ test: 'test' }] }),
    ).to.deep.equal([{ test: 'test' }]);
  });
});

describe('getPrivateEvidence', () => {
  it('should return expected value', () => {
    expect(
      getPrivateEvidence({
        [EVIDENCE_PRIVATE]: undefined,
        providerFacility: [{}],
      }),
    ).to.deep.equal([]);
    expect(
      getPrivateEvidence({ [EVIDENCE_PRIVATE]: true, providerFacility: [{}] }),
    ).to.deep.equal([{}]);
    expect(
      getPrivateEvidence({ [EVIDENCE_PRIVATE]: true, providerFacility: [] }),
    ).to.deep.equal([]);
    expect(
      getPrivateEvidence({ [EVIDENCE_PRIVATE]: false, providerFacility: [{}] }),
    ).to.deep.equal([]);
  });
});

describe('getOtherEvidence', () => {
  it('should return expected value', () => {
    expect(
      getOtherEvidence({
        [EVIDENCE_OTHER]: undefined,
        additionalDocuments: [{}],
      }),
    ).to.deep.equal([]);
    expect(
      getOtherEvidence({ [EVIDENCE_OTHER]: true, additionalDocuments: [{}] }),
    ).to.deep.equal([{}]);
    expect(
      getOtherEvidence({ [EVIDENCE_OTHER]: true, additionalDocuments: [] }),
    ).to.deep.equal([]);
    expect(
      getOtherEvidence({ [EVIDENCE_OTHER]: false, additionalDocuments: [{}] }),
    ).to.deep.equal([]);
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

  it('should return false if provider facility evidence undefined', () => {
    expect(evidenceNeedsUpdating({ [EVIDENCE_VA]: true, locations: [{}] })).to
      .be.false;
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
    [EVIDENCE_VA]: true,
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
    [EVIDENCE_PRIVATE]: true,
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

  it('should return empty template with empty form data', () => {
    const result = removeNonSelectedIssuesFromEvidence();
    expect(result).to.deep.eq({ locations: [], providerFacility: [] });
  });

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

describe('onFormLoaded', () => {
  it('should direct to the correct returnUrl', () => {
    const routerSpy = {
      push: sinon.spy(),
    };

    onFormLoaded({ returnUrl: '/housing-risk', router: routerSpy });
    expect(routerSpy.push.firstCall.args[0]).to.eq('/housing-risk');
  });
});
