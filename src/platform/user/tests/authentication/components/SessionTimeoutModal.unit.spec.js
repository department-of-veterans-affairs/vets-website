import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { SessionTimeoutModal } from 'platform/user/authentication/components/SessionTimeoutModal';

const defaultProps = {
  isLoggedIn: true,
  initializeProfile: sinon.spy(),
  authenticatedWithOAuth: false,
  serviceName: 'logingov',
};

describe('SessionTimeoutModal', () => {
  it('should render Modal', () => {
    const component = shallow(<SessionTimeoutModal {...defaultProps} />);
    const buttons = component.find('button');

    expect(component).to.have.lengthOf(1);
    expect(buttons.length).to.eql(2);
    component.unmount();
  });
});
