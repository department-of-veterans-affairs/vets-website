import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { IntroPage } from '../../containers/IntroPage';
import { SERVICE_AVAILABILITY_STATES } from '../../utils/constants';

describe('<IntroPage/>', () => {
  const getServiceAvailability = sinon.spy();

  beforeEach(() => {
    getServiceAvailability.reset();
  });

  const defaultProps = {
    getServiceAvailability,
    serviceAvailability: SERVICE_AVAILABILITY_STATES.up,
  };

  it('should call getServiceAvailability()', () => {
    const wrapper = shallow(<IntroPage {...defaultProps} />);
    expect(getServiceAvailability.callCount).to.equal(1);
    wrapper.unmount();
  });

  it('should render a LoadingIndicator', () => {
    const wrapper = shallow(
      <IntroPage
        {...defaultProps}
        serviceAvailability={SERVICE_AVAILABILITY_STATES.pending}
      />,
    );
    expect(wrapper.find('LoadingIndicator')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('should render a success Alert when downtime is not scheduled to start soon', () => {
    const oneHourAsSeconds = 60 * 60;
    const wrapper = shallow(
      <IntroPage {...defaultProps} uptimeRemaining={oneHourAsSeconds} />,
      { store: {} },
    );
    expect(wrapper.find('AlertBox[status="success"]').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render a warning Alert when downtime is scheduled to start soon', () => {
    const halfHourAsSeconds = 30 * 60;
    const wrapper = shallow(
      <IntroPage {...defaultProps} uptimeRemaining={halfHourAsSeconds} />,
    );
    expect(wrapper.find('AlertBox[status="warning"]').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render an error Alert when GIBS status down', () => {
    const wrapper = shallow(
      <IntroPage
        {...defaultProps}
        serviceAvailability={SERVICE_AVAILABILITY_STATES.down}
      />,
    );
    expect(wrapper.find('AlertBox[status="error"]').length).to.equal(1);
    wrapper.unmount();
  });
});
