// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { Header } from '.';

describe('Header <Header>', () => {
  it('renders content', () => {
    const wrapper = shallow(<Header showMegaMenu showNavLogin />);
    expect(wrapper.text()).to.include('New header');
    wrapper.unmount();
  });
});
