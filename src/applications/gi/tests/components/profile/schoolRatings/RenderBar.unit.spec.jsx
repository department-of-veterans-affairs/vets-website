import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import RenderBar from '../../../../components/profile/schoolRatings/RenderBar';

describe('<RenderBar />', () => {
  it('should display the correct label and rating', () => {
    const label = 'Test Label';
    const avgRating = '3.2';
    const wrapper = mount(<RenderBar label={label} avgRating={avgRating} />);

    expect(wrapper.text()).to.include(label);
    expect(wrapper.text()).to.include(`${avgRating} / 4.0`);
    wrapper.unmount();
  });

  it('should display a bar with the correct width based on the rating', () => {
    const avgRating = '2.0';
    const wrapper = shallow(
      <RenderBar label="Test Label" avgRating={avgRating} />,
    );

    const barStyle = wrapper
      .find('.bar.vads-u-background-color--gold-darker')
      .prop('style');
    expect(barStyle).to.have.property('width', '50%');
    wrapper.unmount();
  });

  it('should handle a case where avgRating is not provided', () => {
    const wrapper = shallow(<RenderBar label="Test Label" />);

    const barStyle = wrapper
      .find('.bar.vads-u-background-color--gold-darker')
      .prop('style');
    expect(barStyle).to.have.property('width', '0%');
    wrapper.unmount();
  });
});
