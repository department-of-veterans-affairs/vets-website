import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { AdditionalResourcesLinks } from '../../../components/content/AdditionalResourcesLinks';

const expectHrefAndText = (element, href, text) => {
  expect(element.text()).to.equal(text);
  expect(element.props().href).to.equal(href);
};

describe('<AdditionalResourcesLinks>', () => {
  it('should render', () => {
    const wrapper = shallow(<AdditionalResourcesLinks />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });

  it('should display non vet tec links', () => {
    const wrapper = shallow(<AdditionalResourcesLinks />);
    const link1 = wrapper.find('a').at(0);
    const link2 = wrapper.find('a').at(1);
    const link3 = wrapper.find('a').at(2);
    const link4 = wrapper.find('a').at(3);

    expectHrefAndText(
      link1,
      'https://va.careerscope.net/gibill',
      'Get started with CareerScope',
    );
    expectHrefAndText(
      link2,
      'https://www.benefits.va.gov/gibill/choosing_a_school.asp',
      'Get help choosing a school',
    );
    expectHrefAndText(
      link3,
      '/education/submit-school-feedback',
      'Submit a complaint through our Feedback System',
    );
    expectHrefAndText(
      link4,
      '/education/how-to-apply/',
      'Apply for education benefits',
    );
    wrapper.unmount();
  });

  it('should display vet tec links', () => {
    const wrapper = shallow(<AdditionalResourcesLinks vetTec />);

    const link1 = wrapper.find('a').at(0);
    const link2 = wrapper.find('a').at(1);
    const link3 = wrapper.find('a').at(2);
    const link4 = wrapper.find('a').at(3);

    expectHrefAndText(
      link1,
      'https://va.careerscope.net/gibill',
      'Get started with CareerScope',
    );
    expectHrefAndText(
      link2,
      '/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/',
      'Learn more about VET TEC',
    );
    expectHrefAndText(
      link3,
      '/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994/introduction',
      'Apply for VET TEC',
    );
    expectHrefAndText(
      link4,
      '/education/submit-school-feedback',
      'Submit a complaint through our Feedback System',
    );

    wrapper.unmount();
  });
});
