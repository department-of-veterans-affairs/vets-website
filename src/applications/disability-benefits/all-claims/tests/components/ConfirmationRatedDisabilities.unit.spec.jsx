import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ConfirmationRatedDisabilities from '../../components/ConfirmationRatedDisabilities';

describe('ConfirmationRatedDisabilities', () => {
  it('should render correctly with selected rated disabilities', () => {
    const formData = {
      ratedDisabilities: [
        { name: 'Condition 1', 'view:selected': true, ratingPercentage: 30 },
        { name: 'Condition 2', 'view:selected': false, ratingPercentage: 50 },
      ],
    };
    const wrapper = shallow(
      <ConfirmationRatedDisabilities formData={formData} />,
    );
    expect(wrapper.find('h4').length).to.equal(1);
    expect(wrapper.text()).to.include('Condition 1');
    expect(wrapper.text()).to.include(
      'claiming an increase from current 30% rating',
    );
    expect(wrapper.text()).to.not.include('Condition 2');
    wrapper.unmount();
  });

  it('should render nothing when no rated disabilities are selected', () => {
    const formData = {
      ratedDisabilities: [
        { name: 'Condition 1', 'view:selected': false, ratingPercentage: 30 },
        { name: 'Condition 2', 'view:selected': false, ratingPercentage: 50 },
      ],
    };
    const wrapper = shallow(
      <ConfirmationRatedDisabilities formData={formData} />,
    );
    expect(wrapper.find('h4').length).to.equal(0);
    wrapper.unmount();
  });

  it('should render nothing when formData is empty', () => {
    const wrapper = shallow(<ConfirmationRatedDisabilities formData={{}} />);
    expect(wrapper.find('h4').length).to.equal(0);
    wrapper.unmount();
  });
});
