// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import FindVaResults from '../../components/FindVaResults';

describe('Find VA Results <FindVaResults>', () => {
  it('should render', () => {
    const tree = shallow(<FindVaResults />);

    expect(tree.find('SearchForm')).to.exist;
    tree.unmount();
  });
});
