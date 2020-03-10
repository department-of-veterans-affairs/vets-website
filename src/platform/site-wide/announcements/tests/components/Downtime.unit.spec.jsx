// Dependencies.
import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
// Relative imports.
import Downtime from '../../components/Downtime';

describe('Downtime Messaging <Downtime />', () => {
  it('should render', () => {
    // Derive props.
    const downtimeExpiresAt = moment()
      .add(1, 'hours')
      .add(30, 'minutes')
      .toISOString();
    const dismiss = sinon.stub();
    const props = {
      announcement: { downtimeExpiresAt },
      dismiss,
    };

    // Shallow render the component.
    const wrapper = shallow(<Downtime {...props} />);

    // Find the component.
    const promoBannerComponent = wrapper.find('PromoBanner');

    // Call `dismiss` props.
    promoBannerComponent.props().onClose();

    // Test `dismiss` prop.
    expect(dismiss.called).to.be.true;

    wrapper.unmount();
  });
});
