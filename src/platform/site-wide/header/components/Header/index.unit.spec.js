// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { Header } from '.';

describe('Header <Header>', () => {
  it('renders content', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper.find(`BrowserDeprecationMessage`)).to.have.lengthOf(1);
    expect(wrapper.find(`HeaderBanners`)).to.have.lengthOf(1);
    expect(wrapper.find(`MainHeaderContent`)).to.have.lengthOf(1);
    expect(wrapper.find(`DropdownMenu`)).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
