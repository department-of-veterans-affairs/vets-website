import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import SessionTimeoutModal from 'platform/user/authentication/components/SessionTimeoutModal';

const defaultProps = {
  isLoggedIn: true,
  onExtendSession: sinon.spy(),
  signOut: sinon.spy(),
  authenticatedWithOAuth: false,
};

describe('SessionTimeoutModal', () => {
  it('should render Modal', () => {
    const component = shallow(<SessionTimeoutModal {...defaultProps} />);
    const modalWebComponent = component.find('Modal');
    const buttons = component.find('button');
    expect(modalWebComponent.exists()).to.be.true;
    expect(buttons.length).to.eql(2);
    component.unmount();
  });
});
