import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Modal from '@department-of-veterans-affairs/component-library/Modal';
import SessionTimeoutModal from 'platform/user/authentication/components/SessionTimeoutModal';

const defaultProps = {
  isLoggedIn: true,
  onExtendSession: sinon.spy(),
  signOut: sinon.spy(),
};

describe('SessionTimeoutModal', () => {
  it('should render Modal', () => {
    const component = shallow(<SessionTimeoutModal {...defaultProps} />);
    expect(component.exists(Modal)).to.be.true;
    component.unmount();
  });
});
