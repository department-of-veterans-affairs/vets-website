// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
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
      firstIssuedOn: '2020-12-22',
      formName: 'VA10192',
      id: 'VA10192',
      lastRevisionOn: '2020-12-22',
      pages: 3,
      sha256: '5fe171299ece147e8b456961a38e17f1391026f26e9e170229317bc95d9827b',
      title: 'Information for Pre-Complaint Processing',
      type: 'va_form',
      url: 'https://www.va.gov/vaforms/va/pdf/VA10192.pdf',
      idLabel: <span>VA10192</span>,
      titleLabel: <span>Information for Pre-Complaint Processing</span>,
      descriptionLabel: <span>Description</span>,
      availableOnlineLabel: <span>N/A</span>,
    }));

    const tree = shallow(<SearchResults results={results} />);

    expect(tree.find('SortableTable')).to.have.lengthOf(1);
    expect(tree.find('Pagination')).to.have.lengthOf(1);

    tree.unmount();
  });
});
