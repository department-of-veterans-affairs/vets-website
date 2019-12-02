import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

// // Relative imports.
import { SearchResults } from '../../containers/SearchResults';

describe('Find VA Forms <SearchResults>', () => {
  it('renders a loading indicator', () => {
    const tree = shallow(<SearchResults fetching />);

    const loadingIndicator = tree.find('LoadingIndicator');
    expect(loadingIndicator).to.have.lengthOf(1);

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

  it('renders a table', () => {
    const results = [{}];
    const tree = shallow(<SearchResults results={results} />);

    expect(tree.find('SortableTable')).to.have.lengthOf(1);

    tree.unmount();
  });
});
