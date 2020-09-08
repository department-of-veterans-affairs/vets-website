// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { SearchPage } from './index';

describe('Search Page <SearchPage>', () => {
  it('renders what we expect', () => {
    const tree = shallow(<SearchPage />);
    const text = tree.text();

    // Expect there to be:
    expect(text).to.include('Find apps to use');
    expect(text).to.include(
      'you can link to your personal VA data, like health or service records.',
    );
    expect(text).to.include('Have questions about connected apps?');
    expect(text).to.include(
      'Get answers to frequently asked questions about how connected',
    );
    expect(text).to.include('Go to connected apps FAQs');
    expect(text).to.include('Last updated ');

    tree.unmount();
  });
});
