// Dependencies.
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import times from 'lodash/times';
// Relative imports.
import {
  SearchResults,
  MAX_PAGE_LIST_LENGTH,
} from '../../containers/SearchResults';

describe('Find VA Forms <SearchResults>', () => {
  it('renders a loading indicator', () => {
    const tree = shallow(<SearchResults fetching />);

    const loadingIndicator = tree.find('LoadingIndicator');
    expect(loadingIndicator).to.have.lengthOf(1);

    tree.unmount();
  });

  it('renders an error alert box', () => {
    const tree = shallow(<SearchResults error="test" />);

    expect(tree.html()).to.include('test');
    expect(tree.html()).to.include('Something went wrong');

    tree.unmount();
  });

  it('renders nothing', () => {
    const tree = shallow(<SearchResults />);

    expect(tree.isEmptyRender()).to.be.true;

    tree.unmount();
  });

  it('renders no results', () => {
    const tree = shallow(<SearchResults results={[]} />);

    expect(tree.html()).to.include('No results');

    tree.unmount();
  });

  it('renders a table and pagination', () => {
    const results = times(MAX_PAGE_LIST_LENGTH + 1, () => ({
      id: 'VA10192',
      attributes: {
        formName: 'VA10192',
        title: 'Information for Pre-Complaint Processing',
        url: 'https://www.va.gov/vaforms/va/pdf/VA10192.pdf',
        lastRevisionOn: '2020-12-22',
      },
    }));

    const tree = shallow(
      <SearchResults
        startIndex={0}
        results={results}
        updateHowToSort={sinon.stub()}
        showFindFormsResultsLinkToFormDetailPages
      />,
    );

    expect(tree.find('SearchResult')).to.have.lengthOf(MAX_PAGE_LIST_LENGTH);
    expect(tree.find('Pagination')).to.have.lengthOf(1);

    tree.unmount();
  });

  it('sorts the results by date correctly', () => {
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

    const sortedResultsNodesTextByLatestRevisionNewest = [
      'Form last updated: 12-22-2021',
      'Form last updated: 06-15-2010',
      'Form last updated: 10-17-2005',
      'Form last updated: 05-20-1999',
    ];

    const sortedResultsNodesTextByLatestRevisionOldest = [
      'Form last updated: 05-20-1999',
      'Form last updated: 10-17-2005',
      'Form last updated: 06-15-2010',
      'Form last updated: 12-22-2021',
    ];

    const tree = mount(
      <SearchResults
        startIndex={0}
        results={results}
        updateHowToSort={sinon.stub()}
        showFindFormsResultsLinkToFormDetailPages
      />,
    );

    expect(tree.find('SearchResult')).to.have.lengthOf(4);
    expect(tree.find('.vsa-from-last-updated')).to.have.lengthOf(4);
    // Select Widget Exists.
    expect(tree.find('.vas-select-widget select')).to.have.lengthOf(1);

    // SORTING OPTIONS
    // index 0 === 'Last Updated (Newest)'
    // index 1 === 'Last Updated (Oldest)'

    // select all dates and see if the dates match an expected order.
    // DEFAULT SORT 'Last Updated (Newest)'
    const newestUpdatedDates = tree
      .find('.vsa-from-last-updated')
      .map(node => node.text());
    expect(newestUpdatedDates).to.eql(
      sortedResultsNodesTextByLatestRevisionNewest,
    );

    tree
      .find('.vas-select-widget select')
      .at(0)
      .simulate('change', {
        target: {
          value: 'Last Updated (Oldest)',
          name: 'Last Updated (Oldest)',
        },
      });

    // select all dates and see if the dates match an expected order.
    // SORT BY 'Last Updated (Oldest)'
    const oldestUpdatedDates = tree
      .find('.vsa-from-last-updated')
      .map(node => node.text());
    expect(oldestUpdatedDates).to.eql(
      sortedResultsNodesTextByLatestRevisionOldest,
    );

    tree.unmount();
  });
});
