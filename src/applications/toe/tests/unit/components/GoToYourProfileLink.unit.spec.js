import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import GoToYourProfileLink from '../../../components/GoToYourProfileLink';

describe('render email view component', () => {
  it('should render email address within Form Data', () => {
    const wrapper = shallow(<GoToYourProfileLink />);
    expect(wrapper.text()).to.include('Go to your profile');
    wrapper.unmount();
  });
});
