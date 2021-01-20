// Dependencies.
import { expect } from 'chai';

// Relative imports
import { sortTheResults } from '../../helpers';
import { deriveLatestIssue } from '../../components/SearchResult';
import { INITIAL_SORT_STATE, SORT_OPTIONS } from '../../constants';

describe('Find VA Forms helpers', () => {
  const results = [
    {
      id: 'VA10192',
      attributes: {
        firstIssuedOn: '2014-10-17',
        formName: 'VA10192',
        title: 'Information for Pre-Complaint Processing',
        url: 'https://www.va.gov/vaforms/va/pdf/VA10192.pdf',
        lastRevisionOn: '2021-12-22',
      },
    },
    {
      id: 'VA10192',
      attributes: {
        firstIssuedOn: '1988-10-17',
        formName: 'VA10192',
        title: 'Information for Pre-Complaint Processing',
        url: 'https://www.va.gov/vaforms/va/pdf/VA10192.pdf',
        lastRevisionOn: '1999-05-20',
      },
    },
    {
      id: 'VA10192',
      attributes: {
        firstIssuedOn: '2005-10-17',
        formName: 'VA10192',
        title: 'Information for Pre-Complaint Processing',
        url: 'https://www.va.gov/vaforms/va/pdf/VA10192.pdf',
        lastRevisionOn: '2002-08-20',
      },
    },
    {
      id: 'VA10192',
      attributes: {
        firstIssuedOn: '2005-10-10',
        formName: 'VA10192',
        title: 'Information for Pre-Complaint Processing',
        url: 'https://www.va.gov/vaforms/va/pdf/VA10192.pdf',
        lastRevisionOn: '2010-06-15',
      },
    },
  ];

  it('sorts helper sorts the results by latest (newest) date correctly', () => {
    const sortedResultsNodesTextByLatestRevisionNewest = [
      '12-22-2021',
      '06-15-2010',
      '10-17-2005',
      '05-20-1999',
    ];

    const sortedResultsByNewestRevisionDate = results
      .sort((a, b) => sortTheResults(INITIAL_SORT_STATE, a, b))
      .map(form =>
        deriveLatestIssue(
          form?.attributes?.firstIssuedOn,
          form?.attributes?.lastRevisionOn,
        ),
      );

    // DEFAULT SORT 'Last Updated (Newest)'
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
      .sort((a, b) => sortTheResults(SORT_OPTIONS[1], a, b))
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
});
