// Dependencies.
import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
// Relative imports.
import PrePreDowntime from '../../components/PrePreDowntime';

describe('Downtime Messaging <PrePreDowntime />', () => {
  it('should render', () => {
    // Derive props.
    const downtimeStartsAt = moment()
      .add(1, 'hour')
      .toISOString();
    const downtimeExpiresAt = moment()
      .add(1, 'hours')
      .add(30, 'minutes')
      .toISOString();
    const dismiss = sinon.stub();
    const props = {
      announcement: { downtimeStartsAt, downtimeExpiresAt },
      dismiss,
    };

    // Shallow render the component.
    const wrapper = shallow(<PrePreDowntime {...props} />);

    // Find the component.
    const promoBannerComponent = wrapper.find('PromoBanner');

    // Call `dismiss` props.
    promoBannerComponent.props().onClose();

    // Test `dismiss` prop.
    expect(dismiss.called).to.be.true;

    wrapper.unmount();
  });
});
