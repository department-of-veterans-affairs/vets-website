import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LandingPage from '../../containers/LandingPage';

describe('Landing Page', () => {
  it('should render hero wrapper', () => {
    const wrapper = shallow(<LandingPage />);

    expect(wrapper.find('.homepage-hero__wrapper').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render welcome headline', () => {
    const wrapper = shallow(<LandingPage />);

    expect(wrapper.find('.homepage-hero__welcome-headline').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render create account container', () => {
    const wrapper = shallow(<LandingPage />);

    expect(wrapper.find('.homepage-hero__container').length).to.equal(1);
    wrapper.unmount();
  });
});
