import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { LoginContainer } from 'platform/user/authentication/components';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import SignInModal from 'platform/user/authentication/components/SignInModal';

const defaultProps = {
  visible: true,
  onClose: () => {},
};

describe('SignInModal', () => {
  it('should render Modal and LoginContainer by default', () => {
    const component = shallow(<SignInModal {...defaultProps} />);
    expect(component.exists(Modal)).to.be.true;
    expect(component.exists(LoginContainer)).to.be.true;
    component.unmount();
  });
});
