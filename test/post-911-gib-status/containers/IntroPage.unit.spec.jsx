import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { IntroPage } from '../../../src/js/post-911-gib-status/containers/IntroPage';
import { SERVICE_UP_STATES } from '../../../src/js/post-911-gib-status/utils/constants';

describe('<IntroPage/>', () => {
  const getServiceUp = sinon.spy();

  beforeEach(() => {
    getServiceUp.reset();
  });

  const defaultProps = {
    getServiceUp,
    serviceUp: SERVICE_UP_STATES.up
  };

  it('should call getServiceUp()', () => {
    shallow(<IntroPage {...defaultProps}/>);
    expect(getServiceUp.callCount).to.equal(1);
  });

  it('should render a LoadingIndicator', () => {
    const wrapper = shallow(<IntroPage {...defaultProps} serviceUp={SERVICE_UP_STATES.pending}/>);
    expect(wrapper.find('LoadingIndicator')).to.have.lengthOf(1);
  });

  it('should render a link to /status', () => {
    const wrapper = shallow(<IntroPage {...defaultProps}/>);
    expect(wrapper.find('Link').first().props().to).to.equal('status');
  });

  it('should render an alert', () => {
    const wrapper = shallow(<IntroPage {...defaultProps} serviceUp={SERVICE_UP_STATES.down}/>);
    expect(wrapper.find('.usa-alert')).to.have.lengthOf(1);
  });
});
