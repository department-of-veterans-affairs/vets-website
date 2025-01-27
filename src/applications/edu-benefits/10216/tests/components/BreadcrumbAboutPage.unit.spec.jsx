import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import BreadcrumbAboutPage from '../../components/BreadcrumbAboutPage';

describe('BreadcrumbAboutPage', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<BreadcrumbAboutPage />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
