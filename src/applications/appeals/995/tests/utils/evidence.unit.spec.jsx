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
import {
  HAS_VA_EVIDENCE,
  HAS_PRIVATE_EVIDENCE,
  HAS_OTHER_EVIDENCE,
} from '../../constants';
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
      getVAEvidence({ [HAS_VA_EVIDENCE]: undefined, locations: [{}] }),
    ).to.deep.equal([]);

    expect(
      getVAEvidence({ [HAS_VA_EVIDENCE]: true, locations: [{}] }),
    ).to.deep.equal([{}]);

    expect(
      getVAEvidence({ [HAS_VA_EVIDENCE]: true, locations: [] }),
    ).to.deep.equal([]);

    expect(
      getVAEvidence({ [HAS_VA_EVIDENCE]: false, locations: [{}] }),
    ).to.deep.equal([]);

    expect(
      getVAEvidence({ [HAS_VA_EVIDENCE]: true, locations: [{ test: 'test' }] }),
    ).to.deep.equal([{ test: 'test' }]);
  });
});

describe('getPrivateEvidence', () => {
  it('should return expected value', () => {
    expect(
      getPrivateEvidence({
        [HAS_PRIVATE_EVIDENCE]: undefined,
        providerFacility: [{}],
      }),
    ).to.deep.equal([]);
    expect(
      getPrivateEvidence({
        [HAS_PRIVATE_EVIDENCE]: true,
        providerFacility: [{}],
      }),
    ).to.deep.equal([{}]);
    expect(
      getPrivateEvidence({
        [HAS_PRIVATE_EVIDENCE]: true,
        providerFacility: [],
      }),
    ).to.deep.equal([]);
    expect(
      getPrivateEvidence({
        [HAS_PRIVATE_EVIDENCE]: false,
        providerFacility: [{}],
      }),
    ).to.deep.equal([]);
  });
});

describe('getOtherEvidence', () => {
  it('should return expected value', () => {
    expect(
      getOtherEvidence({
        [HAS_OTHER_EVIDENCE]: undefined,
        additionalDocuments: [{}],
      }),
    ).to.deep.equal([]);
    expect(
      getOtherEvidence({
        [HAS_OTHER_EVIDENCE]: true,
        additionalDocuments: [{}],
      }),
    ).to.deep.equal([{}]);
    expect(
      getOtherEvidence({ [HAS_OTHER_EVIDENCE]: true, additionalDocuments: [] }),
    ).to.deep.equal([]);
    expect(
      getOtherEvidence({
        [HAS_OTHER_EVIDENCE]: false,
        additionalDocuments: [{}],
      }),
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
      [HAS_VA_EVIDENCE]: hasVa,
      [HAS_PRIVATE_EVIDENCE]: hasPrivate,
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
    expect(evidenceNeedsUpdating({ [HAS_VA_EVIDENCE]: true, locations: [{}] }))
      .to.be.false;
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
    [HAS_VA_EVIDENCE]: true,
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
    [HAS_PRIVATE_EVIDENCE]: true,
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
