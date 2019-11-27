// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { SearchForm } from '../../containers/SearchForm';

describe('Find VA Forms <SearchForm>', () => {
  it('should render', () => {
    const tree = shallow(<SearchForm />);
    const input = tree.find('input');

    expect(input.length).to.be.equal(1);
    tree.unmount();
  });
});
