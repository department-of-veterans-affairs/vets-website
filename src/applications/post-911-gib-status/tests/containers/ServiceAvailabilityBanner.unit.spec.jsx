import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import CallToActionWidget from 'applications/static-pages/cta-widget';
import ServiceAvailabilityBanner from '../../containers/ServiceAvailabilityBanner';

describe('<ServiceAvailabilityBanner />', () => {
  it('should render the CallToActionWidget with the appId "gi-bill-benefits"', () => {
    const wrapper = shallow(<ServiceAvailabilityBanner />);
    const callToActionWidget = wrapper.find(CallToActionWidget);

    expect(callToActionWidget).to.have.lengthOf(1);
    expect(callToActionWidget.prop('appId')).to.equal('gi-bill-benefits');

    wrapper.unmount();
  });
});
