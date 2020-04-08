// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { SearchResultsPage } from './index';

describe('Search Results Page <SearchResultsPage>', () => {
  it('renders what we expect', () => {
    const tree = shallow(<SearchResultsPage />);
    const text = tree.text();

    // Expect there to be:
    expect(text).to.include('Yellow Ribbon school search results');

    // Expect there NOT to be:
    expect(text).to.not.include('Find a Yellow Ribbon school');
    expect(text).to.not.include('Learn more about the Yellow Ribbon Program.');
    expect(text).to.not.include(
      'You may be eligible for Yellow Ribbon program funding if you:',
    );

    tree.unmount();
  });
});
