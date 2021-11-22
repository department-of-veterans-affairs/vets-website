import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import AdditionalResources from '../../../components/content/AdditionalResources';

describe('<AdditionalResources>', () => {
  it('should render', () => {
    const wrapper = shallow(<AdditionalResources />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });

  it('should use non vet tec classes', () => {
    const wrapper = shallow(<AdditionalResources />);

    expect(wrapper.find('.additional-resources-responsive')).to.not.be
      .undefined;
    expect(wrapper.find('AdditionalResourcesLinks').props().vetTec).to.be.false;

    wrapper.unmount();
  });

  it('should display vet tec logo', () => {
    const wrapper = shallow(<AdditionalResources vetTec />);

    expect(wrapper.find('.vettec-logo-additional-resources')).to.not.be
      .undefined;
    expect(wrapper.find('.additional-resources-vettec')).to.not.be.undefined;
    expect(wrapper.find('AdditionalResourcesLinks').props().vetTec).to.be.true;

    wrapper.unmount();
  });

  it('should display header as h2 with h4 font', () => {
    const wrapper = shallow(<AdditionalResources vetTec />);

    expect(wrapper.find('h2.vads-u-font-size--h4')).to.not.be.undefined;
    expect(wrapper.find('h2.vads-u-font-size--h4').text()).to.equal(
      'Additional resources',
    );

    wrapper.unmount();
  });
});
