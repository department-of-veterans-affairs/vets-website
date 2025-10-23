import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import BreadcrumbUsedInForm from '../../components/BreadcrumbUsedInForm';

describe('BreadcrumbUsedInForm', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<BreadcrumbUsedInForm />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
