import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import CallToActionWidget from 'applications/static-pages/cta-widget';
import { CTA_WIDGET_TYPES } from 'applications/static-pages/cta-widget/ctaWidgets';
import ServiceAvailabilityBanner from '../../../containers/ServiceAvailabilityBanner';

describe('<ServiceAvailabilityBanner />', () => {
  it('should render the CallToActionWidget with the VRE appId', () => {
    const wrapper = shallow(<ServiceAvailabilityBanner />);
    const callToActionWidget = wrapper.find(CallToActionWidget);

    expect(callToActionWidget).to.have.lengthOf(1);
    expect(callToActionWidget.prop('appId')).to.equal(
      CTA_WIDGET_TYPES.TRACK_YOUR_VRE_BENEFITS,
    );

    wrapper.unmount();
  });
});
