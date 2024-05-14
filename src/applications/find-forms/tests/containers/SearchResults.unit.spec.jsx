import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import times from 'lodash/times';
import { INITIAL_SORT_STATE } from '../../constants';
import {
  SearchResults,
  MAX_PAGE_LIST_LENGTH,
} from '../../containers/SearchResults';

describe('Find VA Forms <SearchResults>', () => {
  const results = times(MAX_PAGE_LIST_LENGTH + 1, () => ({
    id: 'VA10192',
    attributes: {
      formName: 'VA10192',
      title: 'Information for Pre-Complaint Processing',
      url: 'https://www.va.gov/vaforms/va/pdf/VA10192.pdf',
      lastRevisionOn: '2020-12-22',
    },
  }));

  it('renders a loading indicator', () => {
    const tree = shallow(<SearchResults fetching />);

    const loadingIndicator = tree.find('va-loading-indicator');
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

  it('should have a Modal detailing PDF information for download trouble', () => {
    const tree = mount(
      <SearchResults
        startIndex={0}
        results={results}
        updateSortByPropertyName={sinon.stub()}
        showPDFInfoVersionOne
        sortByPropertyName={INITIAL_SORT_STATE}
      />,
    );
    expect(tree.html()).to.include('<div class="pdf-alert-modal');
    tree.unmount();
  });

  it('renders a table and pagination', () => {
    const tree = shallow(
      <SearchResults
        startIndex={0}
        results={results}
        updateSortByPropertyName={sinon.stub()}
        sortByPropertyName={INITIAL_SORT_STATE}
      />,
    );

    expect(tree.find('SearchResult')).to.have.lengthOf(MAX_PAGE_LIST_LENGTH);
    expect(tree.html()).to.include('<va-pagination');
    tree.unmount();
  });
});
