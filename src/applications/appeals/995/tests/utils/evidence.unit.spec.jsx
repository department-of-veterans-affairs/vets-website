import { expect } from 'chai';
import {
  getIndex,
  getProviderDetailsTitle,
  getProviderModalDeleteTitle,
  evidenceNeedsUpdating,
  removeNonSelectedIssuesFromEvidence,
} from '../../utils/evidence';
import { HAS_VA_EVIDENCE, HAS_PRIVATE_EVIDENCE } from '../../constants';
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

describe('getProviderDetailsTitle', () => {
  describe('va content', () => {
    describe('add mode', () => {
      it('should show correct title with spelled out index', () => {
        expect(getProviderDetailsTitle('add', 1, 'va')).to.contain(
          'What VA or military treatment location should we request records from?',
        );

        expect(getProviderDetailsTitle('add', 3, 'va')).to.contain(
          'What third VA or military treatment location should we request records from?',
        );

        expect(getProviderDetailsTitle('add', 20, 'va')).to.contain(
          'What 20th VA or military treatment location should we request records from?',
        );

        expect(getProviderDetailsTitle('add', 31, 'va')).to.contain(
          'What 31st VA or military treatment location should we request records from?',
        );

        expect(getProviderDetailsTitle('add', 63, 'va')).to.contain(
          'What 63rd VA or military treatment location should we request records from?',
        );
      });
    });

    describe('edit mode', () => {
      it('should the correct title with spelled out index', () => {
        expect(getProviderDetailsTitle('edit', 1, 'va')).to.contain(
          'Edit the first VA or military treatment location',
        );

        expect(getProviderDetailsTitle('edit', 3, 'va')).to.contain(
          'Edit the third VA or military treatment location',
        );

        expect(getProviderDetailsTitle('edit', 20, 'va')).to.contain(
          'Edit the 20th VA or military treatment location',
        );

        expect(getProviderDetailsTitle('edit', 31, 'va')).to.contain(
          'Edit the 31st VA or military treatment location',
        );

        expect(getProviderDetailsTitle('edit', 63, 'va')).to.contain(
          'Edit the 63rd VA or military treatment location',
        );
      });
    });
  });

  describe('non-va content', () => {
    describe('add mode', () => {
      it('should show correct title with spelled out index', () => {
        expect(getProviderDetailsTitle('add', 1, 'nonVa')).to.contain(
          'What location should we request your private provider or VA Vet Center records from?',
        );

        expect(getProviderDetailsTitle('add', 3, 'nonVa')).to.contain(
          'What third location should we request your private provider or VA Vet Center records from?',
        );

        expect(getProviderDetailsTitle('add', 20, 'nonVa')).to.contain(
          'What 20th location should we request your private provider or VA Vet Center records from?',
        );

        expect(getProviderDetailsTitle('add', 31, 'nonVa')).to.contain(
          'What 31st location should we request your private provider or VA Vet Center records from?',
        );

        expect(getProviderDetailsTitle('add', 63, 'nonVa')).to.contain(
          'What 63rd location should we request your private provider or VA Vet Center records from?',
        );
      });
    });

    describe('edit mode', () => {
      it('should the correct title with spelled out index', () => {
        expect(getProviderDetailsTitle('edit', 1, 'nonVa')).to.contain(
          'Edit the first location we should request your private provider or VA Vet Center records from',
        );

        expect(getProviderDetailsTitle('edit', 3, 'nonVa')).to.contain(
          'Edit the third location we should request your private provider or VA Vet Center records from',
        );

        expect(getProviderDetailsTitle('edit', 20, 'nonVa')).to.contain(
          'Edit the 20th location we should request your private provider or VA Vet Center records from',
        );

        expect(getProviderDetailsTitle('edit', 31, 'nonVa')).to.contain(
          'Edit the 31st location we should request your private provider or VA Vet Center records from',
        );

        expect(getProviderDetailsTitle('edit', 63, 'nonVa')).to.contain(
          'Edit the 63rd location we should request your private provider or VA Vet Center records from',
        );
      });
    });
  });
});

describe('getProviderModalDeleteTitle', () => {
  it('should show the modal title with the correct provider or facility name', () => {
    expect(getProviderModalDeleteTitle('South Texas VA Facility')).to.contain(
      'Do you want to keep South Texas VA Facility?',
    );

    expect(getProviderModalDeleteTitle(`General Burns' Hospital`)).to.contain(
      `Do you want to keep General Burns' Hospital?`,
    );

    expect(getProviderModalDeleteTitle('N.E. Baptist Hospital')).to.contain(
      'Do you want to keep N.E. Baptist Hospital?',
    );

    expect(getProviderModalDeleteTitle('')).to.contain(
      'Do you want to keep this location?',
    );

    expect(getProviderModalDeleteTitle(null)).to.contain(
      'Do you want to keep this location?',
    );

    expect(getProviderModalDeleteTitle(undefined)).to.contain(
      'Do you want to keep this location?',
    );

    expect(getProviderModalDeleteTitle({})).to.contain(
      'Do you want to keep this location?',
    );
  });
});
