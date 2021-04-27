import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import SearchForm from '../../components/SearchForm';

describe('<SearchForm>', () => {
  it('should render', () => {
    const tree = shallow(<SearchForm />);
    expect(tree).to.not.eq(null);
    tree.unmount();
  });

  it('should display name controls', () => {
    const tree = shallow(<SearchForm />);
    expect(tree.find(`input`).length).to.eq(1);
    expect(tree.find(`button`).length).to.eq(1);
    expect(tree.find(`select`).length).to.eq(0);
    tree.unmount();
  });

  it('should display location controls', () => {
    const tree = mount(<SearchForm />);
    tree
      .find('.search-tab')
      .at(1)
      .simulate('click');
    expect(tree.find(`input`).length).to.eq(1);
    expect(tree.find(`button`).length).to.eq(1);
    expect(tree.find(`select`).length).to.eq(1);
    tree.unmount();
  });
});
