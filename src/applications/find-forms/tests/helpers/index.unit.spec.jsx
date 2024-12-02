import { expect } from 'chai';
import { sortTheResults } from '../../helpers';
import { deriveLatestIssue } from '../../components/SearchResult';
import { FAF_SORT_OPTIONS } from '../../constants';

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

  it('leaves the results unsorted from API on initial load', () => {
    const sortedResultsNodeTextByTitleInitial = [
      'AA10192 form 1',
      'BA10192 form 2',
      'CA10192 form 3',
      'DA10192 form 4',
    ];

    const sortedResultsByAlphabet = results
      .sort((a, b) => sortTheResults(FAF_SORT_OPTIONS[1], a, b))
      .map(form => `${form?.attributes?.formName} ${form?.attributes?.title}`);

    // Sort By 'Closest Match'
    expect(sortedResultsByAlphabet).to.eql(sortedResultsNodeTextByTitleInitial);
  });

  it('sorts helper sorts the results form title correctly by ALPHABET (A-Z) Ascending', () => {
    const sortedResultsNodeTextByTitleAscending = [
      'AA10192 form 1',
      'BA10192 form 2',
      'CA10192 form 3',
      'DA10192 form 4',
    ];

    const sortedResultsByAlphabet = results
      .sort((a, b) => sortTheResults(FAF_SORT_OPTIONS[1], a, b))
      .map(form => `${form?.attributes?.formName} ${form?.attributes?.title}`);

    // Sort By 'ALPHABET (A-Z) Ascending'
    expect(sortedResultsByAlphabet).to.eql(
      sortedResultsNodeTextByTitleAscending,
    );
  });

  it('sorts helper sorts the results by latest (newest) date correctly', () => {
    const sortedResultsNodesTextByLatestRevisionNewest = [
      'December 2021',
      'June 2010',
      'October 2005',
      'May 1999',
    ];

    const sortedResultsByNewestRevisionDate = results
      .sort((a, b) => sortTheResults(FAF_SORT_OPTIONS[3], a, b))
      .map(form =>
        deriveLatestIssue(
          form?.attributes?.firstIssuedOn,
          form?.attributes?.lastRevisionOn,
        ),
      );

    // Sort By 'Last updated (newest)'
    expect(sortedResultsByNewestRevisionDate).to.eql(
      sortedResultsNodesTextByLatestRevisionNewest,
    );
  });

  it('sorts helper sorts the results by oldest date correctly', () => {
    const sortedResultsNodesTextByLatestRevisionOldest = [
      'May 1999',
      'October 2005',
      'June 2010',
      'December 2021',
    ];

    const sortedResultsByOldestRevisionDate = results
      .sort((a, b) => sortTheResults(FAF_SORT_OPTIONS[4], a, b))
      .map(form =>
        deriveLatestIssue(
          form?.attributes?.firstIssuedOn,
          form?.attributes?.lastRevisionOn,
        ),
      );

    // SORT BY 'Last updated (oldest)'
    expect(sortedResultsByOldestRevisionDate).to.eql(
      sortedResultsNodesTextByLatestRevisionOldest,
    );
  });
});
