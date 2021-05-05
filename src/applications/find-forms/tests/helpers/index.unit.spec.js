// Dependencies.
import { expect } from 'chai';

// Relative imports
import {
  sortTheResults,
  regexpDashAdder,
  correctSearchTerm,
} from '../../helpers';
import { deriveLatestIssue } from '../../components/SearchResult';
import { INITIAL_SORT_STATE, SORT_OPTIONS } from '../../constants';

describe('Find VA Forms helpers', () => {
  const results = [
    {
      id: 'VA10192',
      attributes: {
        firstIssuedOn: '2014-10-17',
        formName: 'AA10192',
        title: 'form 1',
        url: 'https://www.va.gov/vaforms/va/pdf/VA10192.pdf',
        lastRevisionOn: '2021-12-22',
      },
    },
    {
      id: 'VA10192',
      attributes: {
        firstIssuedOn: '1988-10-17',
        formName: 'BA10192',
        title: 'form 2',
        url: 'https://www.va.gov/vaforms/va/pdf/VA10192.pdf',
        lastRevisionOn: '1999-05-20',
      },
    },
    {
      id: 'VA10192',
      attributes: {
        firstIssuedOn: '2005-10-17',
        formName: 'CA10192',
        title: 'form 3',
        url: 'https://www.va.gov/vaforms/va/pdf/VA10192.pdf',
        lastRevisionOn: '2002-08-20',
      },
    },
    {
      id: 'VA10192',
      attributes: {
        firstIssuedOn: '2005-10-10',
        formName: 'DA10192',
        title: 'form 4',
        url: 'https://www.va.gov/vaforms/va/pdf/VA10192.pdf',
        lastRevisionOn: '2010-06-15',
      },
    },
  ];

  it('sorts helper sorts the results form title correctly', () => {
    const sortedResultsNodeTextByTitleAscending = [
      'AA10192 form 1',
      'BA10192 form 2',
      'CA10192 form 3',
      'DA10192 form 4',
    ];

    const sortedResultsByAlphabet = results
      .sort((a, b) => sortTheResults(INITIAL_SORT_STATE, a, b))
      .map(form => `${form?.attributes?.formName} ${form?.attributes?.title}`);

    // Sort By 'ALPHABET (A-Z) Ascending'
    expect(sortedResultsByAlphabet).to.eql(
      sortedResultsNodeTextByTitleAscending,
    );
  });

  it('sorts helper sorts the results by latest (newest) date correctly', () => {
    const sortedResultsNodesTextByLatestRevisionNewest = [
      '12-22-2021',
      '06-15-2010',
      '10-17-2005',
      '05-20-1999',
    ];

    const sortedResultsByNewestRevisionDate = results
      .sort((a, b) => sortTheResults(SORT_OPTIONS[2], a, b))
      .map(form =>
        deriveLatestIssue(
          form?.attributes?.firstIssuedOn,
          form?.attributes?.lastRevisionOn,
        ),
      );

    // Sort By 'Last Updated (Newest)'
    expect(sortedResultsByNewestRevisionDate).to.eql(
      sortedResultsNodesTextByLatestRevisionNewest,
    );
  });

  it('sorts helper sorts the results by oldest date correctly', () => {
    const sortedResultsNodesTextByLatestRevisionOldest = [
      '05-20-1999',
      '10-17-2005',
      '06-15-2010',
      '12-22-2021',
    ];

    const sortedResultsByOldestRevisionDate = results
      .sort((a, b) => sortTheResults(SORT_OPTIONS[3], a, b))
      .map(form =>
        deriveLatestIssue(
          form?.attributes?.firstIssuedOn,
          form?.attributes?.lastRevisionOn,
        ),
      );

    // SORT BY 'Last Updated (Oldest)'
    expect(sortedResultsByOldestRevisionDate).to.eql(
      sortedResultsNodesTextByLatestRevisionOldest,
    );
  });

  it('regexpDashAdder adds the dash where it should', () => {
    const transformString = regexpDashAdder('20213', 2);
    expect(transformString).to.eql('20-213');
  });

  const searchQueryAutoCorrectResults = new Map([
    ['va 10-10ez', '10-10EZ'],
    ['form 10-10ez', '10-10EZ'],
    ['10-013L espanol', '10-013L spanish'],
    ['2010207', '20-10207'],
    ['2122a', '21-22A'],
    ['228597', '22-8597'],
    ['266807a', '26-6807A'],
    ['29380', '29-380'],
    ['401330', '40-1330'],
    ['21P', '21P-'],
    ['1010', '10-10'],
    ['1010EZ', '10-10EZ'],
    ['1010 EZ', '10-10EZ'],
    ['10-10 EZ', '10-10EZ'],
  ]);

  searchQueryAutoCorrectResults.forEach((value, key) => {
    it('correctSearchTerm adjusts the term to allow for faulty searches', () => {
      const transformString = correctSearchTerm(key);
      expect(transformString).to.eql(value);
    });
  });
});
