import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Dashboard from '../containers/Dashboard';
import LandingPage from '../containers/LandingPage';

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

describe('Dashboard', () => {
  it('should render navigation', () => {
    const wrapper = shallow(<Dashboard />);

    expect(wrapper.find('.nav').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render notifications', () => {
    const wrapper = shallow(<Dashboard />);

    expect(wrapper.find('.notif').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render primary tasks area', () => {
    const wrapper = shallow(<Dashboard />);

    expect(wrapper.find('.primary').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render sidebar', () => {
    const wrapper = shallow(<Dashboard />);

    expect(wrapper.find('.left').length).to.equal(1);
    wrapper.unmount();
  });
});
