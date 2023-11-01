import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import TotalRatedDisabilities from '../../components/TotalRatedDisabilities';

describe('<TotalRatedDisabilities />', () => {
  it('Should Render', () => {
    const wrapper = shallow(
      <TotalRatedDisabilities
        loading={false}
        error={false}
        totalDisabilityRating={80}
      />,
    );
    expect(wrapper.find('va-featured-content')).to.exist;
    wrapper.unmount();
  });

  it('displays a loading indicator while loading', () => {
    const wrapper = shallow(
      <TotalRatedDisabilities
        loading
        error={false}
        totalDisabilityRating={80}
      />,
    );
    expect(wrapper.find('.loading-indicator-container')).to.exist;
    wrapper.unmount();
  });

  it('displays an error message when there is a 500 error prop', () => {
    const wrapper = shallow(
      <TotalRatedDisabilities
        loading={false}
        error={500}
        totalDisabilityRating={null}
      />,
    );

    expect(wrapper.find('.usa-alert-error')).to.exist;
    wrapper.unmount();
  });

  it('displays a no rating message when there is a 400 error prop', () => {
    const wrapper = shallow(
      <TotalRatedDisabilities
        loading={false}
        error={400}
        totalDisabilityRating={null}
      />,
    );

    expect(wrapper.find('.usa-alert-error')).to.exist;
    wrapper.unmount();
  });
});
