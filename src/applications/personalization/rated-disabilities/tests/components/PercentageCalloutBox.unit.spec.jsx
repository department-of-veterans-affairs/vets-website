import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import PercentageCalloutBox from '../../components/PercentageCalloutBox';

describe('<PercentageCalloutBox />', () => {
  it('Should Render', () => {
    const wrapper = shallow(
      <PercentageCalloutBox value={80} isPercentage label="This is my label" />,
    );

    expect(
      wrapper
        .find('div')
        .first()
        .hasClass('vads-u-background-color--gray-lightest'),
    ).to.be.true;
    wrapper.unmount();
  });

  it('should show a number based on the value prop', () => {
    const wrapper = shallow(<PercentageCalloutBox value={80} />);

    expect(wrapper.find('.total-rating').text()).to.contain('80');
    wrapper.unmount();
  });

  it('should show the label based on the label prop', () => {
    const wrapper = shallow(<PercentageCalloutBox label="This is my label" />);

    expect(wrapper.find('.total-label').text()).to.contain('This is my label');
    wrapper.unmount();
  });

  it('should show a percentage sign if the isPercentage prop is set to true', () => {
    const wrapper = shallow(<PercentageCalloutBox isPercentage />);

    expect(wrapper.find('.total-rating').text()).to.contain('%');
    wrapper.unmount();
  });
});
