// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import SearchPage from '../../components/SearchPage';
import { App } from './index';

describe('container <App>', () => {
  it('renders what we expect', () => {
    const tree = shallow(<App />);

    // Expect there to be:
    expect(tree.find('Breadcrumbs')).to.have.lengthOf(1);
    expect(tree.find(SearchPage)).to.have.lengthOf(1);

    tree.unmount();
  });
});
