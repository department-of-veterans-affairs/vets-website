// Dependencies.
import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
// Relative imports.
import PreDowntime from '../../components/PreDowntime';

describe('Downtime Messaging <PreDowntime />', () => {
  it('should render', () => {
    // Derive props.
    const downtimeStartsAt = moment()
      .add(1, 'hour')
      .toISOString();
    const dismiss = sinon.stub();
    const props = {
      announcement: { downtimeStartsAt },
      dismiss,
    };

    // Shallow render the component.
    const wrapper = shallow(<PreDowntime {...props} />);

    // Find the component.
    const promoBannerComponent = wrapper.find('PromoBanner');

    // Call `dismiss` props.
    promoBannerComponent.props().onClose();

    // Test `dismiss` prop.
    expect(dismiss.called).to.be.true;

    // Derive minutesRemaining.
    const minutesRemaining = wrapper.state().minutesRemaining;

    // Test `minutesRemaining` state. This should almost always be 59.
    expect(minutesRemaining).to.be.at.least(58);
    expect(minutesRemaining).to.be.at.most(60);

    wrapper.unmount();
  });
});
