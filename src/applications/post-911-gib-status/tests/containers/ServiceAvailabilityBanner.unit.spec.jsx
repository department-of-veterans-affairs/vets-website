import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { ServiceAvailabilityBanner } from '../../containers/ServiceAvailabilityBanner';
import { SERVICE_AVAILABILITY_STATES } from '../../utils/constants';

describe('<ServiceAvailabilityBanner/>', () => {
  const getServiceAvailability = sinon.spy();

  beforeEach(() => {
    getServiceAvailability.reset();
  });

  const defaultProps = {
    getServiceAvailability,
    serviceAvailability: SERVICE_AVAILABILITY_STATES.up,
  };

  it('should call getServiceAvailability()', () => {
    const wrapper = shallow(<ServiceAvailabilityBanner {...defaultProps} />);
    expect(getServiceAvailability.callCount).to.equal(1);
    wrapper.unmount();
  });

  it('should render a LoadingIndicator', () => {
    const wrapper = shallow(
      <ServiceAvailabilityBanner
        {...defaultProps}
        serviceAvailability={SERVICE_AVAILABILITY_STATES.pending}
      />,
    );
    expect(wrapper.find('va-loading-indicator')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('should render a CTA widget when downtime is not scheduled to start soon', () => {
    const oneHourAsSeconds = 60 * 60;
    const wrapper = shallow(
      <ServiceAvailabilityBanner
        {...defaultProps}
        uptimeRemaining={oneHourAsSeconds}
      />,
      { store: {} },
    );

    expect(wrapper.find('[appId="gi-bill-benefits"]').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render an error Alert when GIBS status down', () => {
    const wrapper = shallow(
      <ServiceAvailabilityBanner
        {...defaultProps}
        serviceAvailability={SERVICE_AVAILABILITY_STATES.down}
      />,
    );
    expect(wrapper.text()).to.contain(
      'The Post-9/11 GI Bill Benefits tool is down for maintenance',
    );
    wrapper.unmount();
  });
});
