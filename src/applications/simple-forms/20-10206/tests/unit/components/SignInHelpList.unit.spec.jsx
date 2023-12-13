import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SignInHelpList from '../../../components/SignInHelpList';

describe('SignInHelpList', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SignInHelpList />);
  });
  afterEach(() => {
    wrapper.unmount();
  });

  it('renders the list', () => {
    expect(wrapper.find('ul')).to.have.lengthOf(1);
  });

  it('renders the correct number of list items', () => {
    expect(wrapper.find('li')).to.have.lengthOf(3);
  });

  it('renders the correct retention period', () => {
    expect(wrapper.text()).to.include('60 days');
  });

  it('renders the correct app type', () => {
    expect(wrapper.text()).to.include('request');
  });

  it('renders the recommendation for ID.me and Login.gov', () => {
    expect(wrapper.text()).to.include('ID.me');
    expect(wrapper.text()).to.include('Login.gov');
  });
});
