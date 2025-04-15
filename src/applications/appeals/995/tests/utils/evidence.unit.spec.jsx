import { expect } from 'chai';

import {
  getVAEvidence,
  getPrivateEvidence,
  getOtherEvidence,
  hasVAEvidence,
  hasPrivateEvidence,
  hasPrivateLimitation,
  hasNewPrivateLimitation,
  hasOriginalPrivateLimitation,
  hasOtherEvidence,
  getIndex,
  evidenceNeedsUpdating,
  removeNonSelectedIssuesFromEvidence,
  onFormLoaded,
} from '../../utils/evidence';
import {
  EVIDENCE_VA,
  EVIDENCE_PRIVATE,
  EVIDENCE_LIMIT,
  EVIDENCE_OTHER,
  SC_NEW_FORM_DATA,
  HAS_REDIRECTED,
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

describe('hasPrivateLimitation', () => {
  it('should always return false when toggle is disabled', () => {
    const getData = (hasPrivate, limit = false) => ({
      [SC_NEW_FORM_DATA]: false,
      [EVIDENCE_PRIVATE]: hasPrivate,
      [EVIDENCE_LIMIT]: limit,
    });
    expect(hasPrivateLimitation(getData())).to.be.false;
    expect(hasPrivateLimitation(getData(true))).to.be.false;
    expect(hasPrivateLimitation(getData(false))).to.be.false;
    expect(hasPrivateLimitation(getData(false, false))).to.be.false;
    expect(hasPrivateLimitation(getData(false, true))).to.be.false;
    expect(hasPrivateLimitation(getData(true, true))).to.be.false;
    expect(hasPrivateLimitation(getData(true, false))).to.be.false;
  });
  it('should return expected value', () => {
    const getData = limit => ({
      [SC_NEW_FORM_DATA]: true,
      [EVIDENCE_PRIVATE]: true,
      [EVIDENCE_LIMIT]: limit,
    });
    // returns false when limitation is falsy, and true when truthy
    expect(hasPrivateLimitation(getData(false))).to.be.false;
    expect(hasPrivateLimitation(getData())).to.be.false;
    expect(hasPrivateLimitation(getData(''))).to.be.false;
    expect(hasPrivateLimitation(getData('test'))).to.be.true;
    expect(hasPrivateLimitation(getData(true))).to.be.true;
  });
});

describe('hasNewPrivateLimitation', () => {
  it('should always return false when toggle is disabled', () => {
    const getData = hasPrivate => ({
      [SC_NEW_FORM_DATA]: false,
      [EVIDENCE_PRIVATE]: hasPrivate,
    });
    expect(hasNewPrivateLimitation(getData())).to.be.false;
    expect(hasNewPrivateLimitation(getData(true))).to.be.false;
    expect(hasNewPrivateLimitation(getData(false))).to.be.false;
  });
  it('should return expected value', () => {
    const getData = hasPrivate => ({
      [SC_NEW_FORM_DATA]: true,
      [EVIDENCE_PRIVATE]: hasPrivate,
    });
    expect(hasNewPrivateLimitation(getData())).to.be.undefined; // falsy
    expect(hasNewPrivateLimitation(getData(''))).to.eq(''); // falsy
    expect(hasNewPrivateLimitation(getData('test'))).to.eq('test'); // truthy
    expect(hasNewPrivateLimitation(getData(true))).to.be.true;
  });
});

// hasOriginalPrivateLimitation,
describe('hasOriginalPrivateLimitation', () => {
  it('should always return false when toggle is disabled', () => {
    const getData = hasPrivate => ({
      [SC_NEW_FORM_DATA]: true,
      [EVIDENCE_PRIVATE]: hasPrivate,
    });
    expect(hasOriginalPrivateLimitation(getData())).to.be.false;
    expect(hasOriginalPrivateLimitation(getData(true))).to.be.false;
    expect(hasOriginalPrivateLimitation(getData(false))).to.be.false;
  });
  it('should return expected value', () => {
    const getData = hasPrivate => ({
      [SC_NEW_FORM_DATA]: false,
      [EVIDENCE_PRIVATE]: hasPrivate,
    });
    // only returns false when explicitly set to false
    expect(hasOriginalPrivateLimitation(getData(false))).to.be.false;
    expect(hasOriginalPrivateLimitation(getData())).to.be.undefined; // falsy
    expect(hasOriginalPrivateLimitation(getData(''))).to.eq(''); // falsy
    expect(hasOriginalPrivateLimitation(getData('test'))).to.eq('test'); // truthy
    expect(hasOriginalPrivateLimitation(getData(true))).to.be.true;
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
  const getLocation = ({ from, treatmentDate }) => ({
    evidenceDates: { from },
    treatmentDate,
    noDate: !treatmentDate,
  });
  const getData = ({
    toggle = false,
    locations = [],
    redirected = true,
  } = {}) => ({
    [SC_NEW_FORM_DATA]: toggle,
    [HAS_REDIRECTED]: redirected,
    locations,
  });
  const returnUrl = '/test';

  it('should do nothing when locations is an empty array', () => {
    const router = [];
    const formData = getData();
    onFormLoaded({ formData, returnUrl, router });
    expect(formData).to.deep.equal(getData());
    expect(router[0]).to.eq(returnUrl);
  });

  it('should do nothing when locations is an empty array when feature toggle is set', () => {
    const router = [];
    const formData = getData({ toggle: true });
    onFormLoaded({ formData, returnUrl, router });
    expect(formData).to.deep.equal(getData({ toggle: true }));
    expect(router[0]).to.eq(returnUrl);
  });

  it('should do nothing when feature toggle is not set', () => {
    const router = [];
    const locations = [getLocation({ from: '2010-03-04' })];
    const props = { locations };
    const formData = getData(props);
    onFormLoaded({ formData, returnUrl, router });
    expect(formData).to.deep.equal(getData(props));
    expect(router[0]).to.eq(returnUrl);
  });

  it('should update treatment date when feature toggle is set', () => {
    const router = [];
    const from = '2010-03-04';
    const locations = [getLocation({ from })];
    const props = { toggle: true, locations };
    const formData = getData(props);
    onFormLoaded({ formData, returnUrl, router });
    expect(formData).to.deep.equal({
      ...getData(props),
      locations: [getLocation({ from, treatmentDate: '2010-03' })],
    });
    expect(router[0]).to.eq(returnUrl);
  });

  it('should not update treatment date when it is already defined & feature toggle is set', () => {
    const router = [];
    const from = '2010-03-04';
    const locations = [getLocation({ from, treatmentDate: '2020-04' })];
    const props = { toggle: true, locations };
    const formData = getData(props);
    onFormLoaded({ formData, returnUrl, router });
    expect(formData).to.deep.equal({
      ...getData(props),
      locations: [getLocation({ from, treatmentDate: '2020-04' })],
    });
    expect(router[0]).to.eq(returnUrl);
  });

  it('should set no date when evidence date and treatment date are undefined & feature toggle is set', () => {
    const router = [];
    const props = { toggle: true, locations: [{}] };
    const formData = getData(props);
    onFormLoaded({ formData, returnUrl, router });
    expect(formData).to.deep.equal({
      ...getData(props),
      locations: [{ noDate: true, treatmentDate: '' }],
    });
    expect(router[0]).to.eq(returnUrl);
  });

  it('should redirect when redirect flag is not set & feature toggle is set', () => {
    sessionStorage.setItem(HAS_REDIRECTED, 'true');
    const router = [];
    const props = { toggle: true, locations: [{}], redirected: false };
    const formData = getData(props);
    onFormLoaded({ formData, returnUrl, router });
    expect(formData).to.deep.equal({
      ...getData(props),
      locations: [{ noDate: true, treatmentDate: '' }],
    });
    expect(router[0]).to.eq('/housing-risk');
    expect(sessionStorage.getItem(HAS_REDIRECTED)).to.eq('true');
  });
});
