import { expect } from 'chai';

import { SELECTED, LEGACY_TYPE } from '../../constants';
import {
  appStateSelector,
  calculateIndexOffset,
  getIssueDate,
  getIssueName,
  getIssueNameAndDate,
  getLegacyAppealsLength,
  getIssuesListItems,
  getSelected,
  getSelectedCount,
  hasDuplicates,
  hasSomeSelected,
  issuesNeedUpdating,
  processContestableIssues,
  returnUniqueIssues,
  someSelected,
} from '../../utils/issues';

describe('getIssueName', () => {
  it('should return undefined', () => {
    expect(getIssueName()).to.be.undefined;
  });
  it('should return a contestable issue name', () => {
    expect(
      getIssueName({ attributes: { ratingIssueSubjectText: 'test' } }),
    ).to.eq('test');
  });
  it('should return an added issue name', () => {
    expect(getIssueName({ issue: 'test2' })).to.eq('test2');
  });
});

describe('getIssueDate', () => {
  it('should return undefined', () => {
    expect(getIssueDate()).to.eq('');
  });
  it('should return a contestable issue date', () => {
    expect(
      getIssueDate({ attributes: { approxDecisionDate: '2021-01-01' } }),
    ).to.eq('2021-01-01');
  });
  it('should return an added issue name', () => {
    expect(getIssueDate({ decisionDate: '2021-02-01' })).to.eq('2021-02-01');
  });
});

describe('getIssueNameAndDate', () => {
  it('should return empty string', () => {
    expect(getIssueNameAndDate()).to.equal('');
  });
  it('should return a contestable issue name', () => {
    expect(
      getIssueNameAndDate({
        attributes: {
          ratingIssueSubjectText: 'test',
          approxDecisionDate: '2021-01-01',
        },
      }),
    ).to.eq('test2021-01-01');
  });
  it('should return an added issue name', () => {
    expect(
      getIssueNameAndDate({ issue: 'test2', decisionDate: '2021-02-02' }),
    ).to.eq('test22021-02-02');
  });
});

describe('getLegacyAppealsLength', () => {
  it('should return no legacy issues', () => {
    const issues = [{ type: '' }, { type: '' }];
    expect(getLegacyAppealsLength()).to.eq(0);
    expect(getLegacyAppealsLength([])).to.eq(0);
    expect(getLegacyAppealsLength(issues)).to.eq(0);
    expect(
      getLegacyAppealsLength([{ type: LEGACY_TYPE, attributes: {} }]),
    ).to.eq(0);
  });

  it('should return 3 legacy issues', () => {
    expect(
      getLegacyAppealsLength([
        { type: '' },
        { type: '' },
        { type: LEGACY_TYPE, attributes: { issues: ['', '', ''] } },
      ]),
    ).to.eq(3);
    expect(
      getLegacyAppealsLength([
        { type: '' },
        { type: '' },
        { type: LEGACY_TYPE, attributes: { issues: ['', '', ''] } },
        // unlikely to have multiple legacy type entries
        { type: LEGACY_TYPE, attributes: { issues: [''] } },
      ]),
    ).to.eq(4);
  });
});

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
  const testIssues = (contestedIssues, additionalIssues) =>
    hasSomeSelected({ contestedIssues, additionalIssues });
  it('should return true for issues that have some selected values', () => {
    expect(testIssues([{ [SELECTED]: true }], [{}])).to.be.true;
    expect(testIssues([{}], [{ [SELECTED]: true }, {}])).to.be.true;
    expect(testIssues([{}], [{}, {}, { [SELECTED]: true }])).to.be.true;
    expect(
      testIssues([{}, { [SELECTED]: true }], [{}, {}, { [SELECTED]: true }]),
    ).to.be.true;
  });
  it('should return false for no selected issues', () => {
    expect(hasSomeSelected()).to.be.false;
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

describe('getSelected,  getSelectedCount, & getIssuesListItems', () => {
  it('should return an empty array', () => {
    expect(getSelected()).to.deep.equal([]);
    expect(getSelectedCount()).to.eq(0);
    expect(getIssuesListItems().length).to.eq(0);
  });
  it('should return selected contestable issues', () => {
    const data = {
      contestedIssues: [
        { type: 'no', [SELECTED]: false },
        { type: 'ok', [SELECTED]: true },
      ],
    };
    expect(getSelected(data)).to.deep.equal([
      { type: 'ok', [SELECTED]: true, index: 0 },
    ]);
    expect(getSelectedCount(data, data.additionalIssues)).to.eq(1);
    expect(getIssuesListItems(data).length).to.eq(1);
  });
  it('should return selected additional issues', () => {
    const data = {
      additionalIssues: [
        { type: 'no', [SELECTED]: false },
        { type: 'ok', [SELECTED]: true },
      ],
    };
    expect(getSelected(data)).to.deep.equal([
      { type: 'ok', [SELECTED]: true, index: 0 },
    ]);
    expect(getSelectedCount(data, data.additionalIssues)).to.eq(1);
    expect(getIssuesListItems(data).length).to.eq(1);
  });
  it('should return all selected issues', () => {
    const data = {
      contestedIssues: [
        { type: 'no1', [SELECTED]: false },
        { type: 'ok1', [SELECTED]: true },
      ],
      additionalIssues: [
        { type: 'no2', [SELECTED]: false },
        { type: 'ok2', [SELECTED]: true },
      ],
    };
    expect(getSelected(data)).to.deep.equal([
      { type: 'ok1', [SELECTED]: true, index: 0 },
      { type: 'ok2', [SELECTED]: true, index: 1 },
    ]);
    expect(getSelectedCount(data, data.additionalIssues)).to.eq(2);
    expect(getIssuesListItems(data).length).to.eq(2);
  });
});

describe('hasDuplicates', () => {
  const contestedIssues = [
    {
      attributes: {
        ratingIssueSubjectText: 'test',
        approxDecisionDate: '2021-01-01',
      },
    },
  ];

  it('should be false with no duplicate additional issues', () => {
    const result = hasDuplicates();
    expect(result).to.be.false;
  });
  it('should be false when there are duplicate contestable issues', () => {
    const result = hasDuplicates({
      contestedIssues: [contestedIssues[0], contestedIssues[0]],
    });
    expect(result).to.be.false;
  });
  it('should be false when there are no duplicate issues (only date differs)', () => {
    const result = hasDuplicates({
      contestedIssues,
      additionalIssues: [{ issue: 'test', decisionDate: '2021-01-02' }],
    });
    expect(result).to.be.false;
  });
  it('should be true when there is a duplicate additional issue', () => {
    const result = hasDuplicates({
      contestedIssues,
      additionalIssues: [{ issue: 'test', decisionDate: '2021-01-01' }],
    });
    expect(result).to.be.true;
  });
  it('should be true when there is are multiple duplicate additional issues', () => {
    const result = hasDuplicates({
      contestedIssues,
      additionalIssues: [
        { issue: 'test2', decisionDate: '2021-02-01' },
        { issue: 'test2', decisionDate: '2021-02-01' },
      ],
    });
    expect(result).to.be.true;
  });
});

describe('returnUniqueIssues', () => {
  const issues = [
    { attributes: { issue: 'test', decisionDate: '2023-01-01' } },
    { attributes: { issue: 'test', decisionDate: '2023-01-02' } },
    { attributes: { issue: 'test', decisionDate: '2023-01-03' } },
  ];
  it('should return an empty array', () => {
    expect(returnUniqueIssues([])).to.deep.equal([]);
  });
  it('should return same issues', () => {
    expect(returnUniqueIssues(issues)).to.deep.equal(issues);
  });
  it('should return only unique issues', () => {
    const duplicates = [
      { attributes: { issue: 'test', decisionDate: '2023-01-01' } },
      { attributes: { issue: 'test', decisionDate: '2023-01-02' } },
      { attributes: { issue: 'test', decisionDate: '2023-01-01' } },
      { attributes: { issue: 'test', decisionDate: '2023-01-03' } },
      { attributes: { issue: 'test', decisionDate: '2023-01-03' } },
      { attributes: { issue: 'test', decisionDate: '2023-01-02' } },
      { attributes: { issue: 'test', decisionDate: '2023-01-01' } },
    ];
    expect(returnUniqueIssues(duplicates)).to.deep.equal(issues);
  });
});

describe('processContestableIssues', () => {
  const getIssues = dates =>
    dates.map(date => ({
      attributes: { ratingIssueSubjectText: 'a', approxDecisionDate: date },
    }));
  const getDates = dates =>
    dates.map(date => date.attributes.approxDecisionDate);

  it('should return an empty array with undefined issues', () => {
    expect(processContestableIssues()).to.deep.equal([]);
    expect(processContestableIssues([{}])).to.deep.equal([]);
    expect(getDates(processContestableIssues())).to.deep.equal([]);
  });
  it('should filter out issues missing a title', () => {
    const issues = getIssues(['2020-02-01', '2020-03-01', '2020-01-01']);
    issues[0].attributes.ratingIssueSubjectText = '';
    const result = processContestableIssues(issues);
    expect(getDates(result)).to.deep.equal(['2020-03-01', '2020-01-01']);
  });
  it('should return partial data', () => {
    expect(
      processContestableIssues([
        { attributes: { ratingIssueSubjectText: '1', approxDecisionDate: '' } },
        { attributes: { ratingIssueSubjectText: '2', approxDecisionDate: '' } },
      ]),
    ).to.deep.equal([
      {
        attributes: {
          ratingIssueSubjectText: '1',
          description: '',
          approxDecisionDate: '',
        },
      },
      {
        attributes: {
          ratingIssueSubjectText: '2',
          description: '',
          approxDecisionDate: '',
        },
      },
    ]);
  });

  it('should sort issues spanning months with newest date first', () => {
    const dates = ['2020-02-01', '2020-03-01', '2020-01-01'];
    const result = processContestableIssues(getIssues(dates));
    expect(getDates(result)).to.deep.equal([
      '2020-03-01',
      '2020-02-01',
      '2020-01-01',
    ]);
  });
  it('should sort issues spanning a year & months with newest date first', () => {
    const dates = ['2021-01-31', '2020-12-01', '2021-02-02', '2021-02-01'];
    const result = processContestableIssues(getIssues(dates));
    expect(getDates(result)).to.deep.equal([
      '2021-02-02',
      '2021-02-01',
      '2021-01-31',
      '2020-12-01',
    ]);
  });
  it('should filter out duplicate issues', () => {
    const issues = getIssues(['2020-02-01', '2020-03-01', '2020-02-01']);
    const result = processContestableIssues(issues);
    expect(getDates(result)).to.deep.equal(['2020-03-01', '2020-02-01']);
  });
});

describe('calculateIndexOffset', () => {
  it('should return an offset value', () => {
    expect(calculateIndexOffset(2, 2)).to.eq(0);
    expect(calculateIndexOffset(4, 2)).to.eq(2);
    expect(calculateIndexOffset(5, 4)).to.eq(1);
  });
});

describe('issuesNeedUpdating', () => {
  const createEntry = (
    ratingIssueSubjectText = '',
    approxDecisionDate = '2000-01-01',
  ) => ({
    attributes: {
      ratingIssueSubjectText,
      approxDecisionDate,
    },
  });
  it('should return false with empty data', () => {
    expect(issuesNeedUpdating()).to.be.false;
    expect(issuesNeedUpdating([])).to.be.false;
    expect(issuesNeedUpdating([{}])).to.be.false;
  });
  it('should return true if array lengths are different', () => {
    expect(issuesNeedUpdating([createEntry()], [createEntry('a')])).to.be.true;
    expect(
      issuesNeedUpdating(
        [createEntry('a')],
        [createEntry('a'), createEntry('b')],
      ),
    ).to.be.true;
    expect(
      issuesNeedUpdating(
        [createEntry('a'), createEntry('b')],
        [createEntry('a')],
      ),
    ).to.be.true;
  });
  it('should return true if content is different', () => {
    expect(
      issuesNeedUpdating(
        [createEntry('test'), createEntry('test2')],
        [createEntry('test'), createEntry('test2', '2001-01-01')],
      ),
    ).to.be.true;
    expect(
      issuesNeedUpdating(
        [createEntry('test'), createEntry('test3')],
        [createEntry('test'), createEntry('test', '2001-01-01')],
      ),
    ).to.be.true;
  });
  it('should return false if arrays are the same, or same after removing duplicates', () => {
    expect(
      issuesNeedUpdating(
        [createEntry('test'), createEntry('test2')],
        [createEntry('test'), createEntry('test2')],
      ),
    ).to.be.false;
    expect(
      issuesNeedUpdating(
        [
          createEntry('test'),
          createEntry('test'),
          createEntry('test2'),
          createEntry('test2'),
        ],
        [createEntry('test'), createEntry('test2')],
      ),
    ).to.be.false;
  });

  it('should sort full data and return false', () => {
    const existing = [
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'issue 5',
          approxDecisionDate: '2023-05-05',
          decisionIssueId: 5,
          ratingIssueReferenceId: '5',
          ratingDecisionReferenceId: '5',
          ratingIssuePercentNumber: '50',
        },
        'view:selected': false,
      },
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'issue 4',
          approxDecisionDate: '2023-04-04',
          decisionIssueId: 4,
          ratingIssueReferenceId: '4',
        },
        'view:selected': false,
      },
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'issue 3',
          approxDecisionDate: '2023-03-03',
          ratingIssueReferenceId: '3',
          ratingDecisionReferenceId: '3',
        },
        'view:selected': false,
      },
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'issue 2',
          approxDecisionDate: '2023-02-02',
          decisionIssueId: 2,
          ratingDecisionReferenceId: '2',
        },
        'view:selected': false,
      },
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'issue 1',
          approxDecisionDate: '2023-01-01',
          decisionIssueId: 1,
          ratingIssuePercentNumber: '1',
        },
        'view:selected': false,
      },
    ];
    const loaded = [
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'issue 3',
          approxDecisionDate: '2023-03-03',
          ratingIssueReferenceId: '3',
          ratingDecisionReferenceId: '3',
          description: '',
        },
        'view:selected': false,
      },
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'issue 2',
          approxDecisionDate: '2023-02-02',
          decisionIssueId: 2,
          ratingIssueReferenceId: '2',
          description: '',
        },
        'view:selected': false,
      },
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'issue 5',
          approxDecisionDate: '2023-05-05',
          decisionIssueId: 50,
          ratingIssuePercentNumber: '5',
          description: '',
        },
        'view:selected': true,
      },
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'issue 1',
          approxDecisionDate: '2023-01-01',
          decisionIssueId: 1,
          ratingIssueReferenceId: '1',
          ratingDecisionReferenceId: '1',
          ratingIssuePercentNumber: '10',
          description: '',
        },
        'view:selected': false,
      },
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'issue 4',
          approxDecisionDate: '2023-04-04',
          decisionIssueId: 4,
          ratingDecisionReferenceId: '4',
          description: '',
        },
        'view:selected': false,
      },
    ];
    expect(issuesNeedUpdating(loaded, existing)).to.be.false;
  });
});

describe('appStateSelector', () => {
  const getIssues = (contestedIssues, additionalIssues) => ({
    state: { form: { data: { contestedIssues, additionalIssues } } },
    result: { contestedIssues, additionalIssues },
  });
  it('should return empty array if data is undefined', () => {
    expect(appStateSelector({})).to.deep.equal(getIssues([], []).result);
  });
  it('should pull issues from state', () => {
    const data1 = getIssues([], [1, 2, 3]);
    expect(appStateSelector(data1.state)).to.deep.equal(data1.result);
    const data2 = getIssues([1, 2, 3], []);
    expect(appStateSelector(data2.state)).to.deep.equal(data2.result);
    const data3 = getIssues([1, 2], [3, 4, 5]);
    expect(appStateSelector(data3.state)).to.deep.equal(data3.result);
  });
});
