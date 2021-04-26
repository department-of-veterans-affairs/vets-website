import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SearchForm from '../../components/SearchForm';

describe('<SearchForm>', () => {
  it('should render', () => {
    const tree = shallow(<SearchForm />);
    expect(tree).to.not.eq(null);
    tree.unmount();
  });
});
