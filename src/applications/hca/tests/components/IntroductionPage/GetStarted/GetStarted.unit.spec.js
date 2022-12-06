import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { GetStartedContent } from '../../../../components/IntroductionPage/GetStarted';

describe('hca <GetStartedContent>', () => {
  let toggleLoginModalSpy;
  let defaultProps = {};

  beforeEach(() => {
    toggleLoginModalSpy = sinon.spy();
    defaultProps = {
      route: {
        formConfig: {},
        pageList: [],
      },
      showLoginAlert: true,
      toggleLoginModal: toggleLoginModalSpy,
    };
  });

  describe('default behavior', () => {
    it('renders all of the static content', () => {
      const wrapper = shallow(<GetStartedContent {...defaultProps} />);
      expect(wrapper.find('ProcessTimeline')).to.have.length(1);
      expect(wrapper.find('OMBInfo')).to.have.length(1);
      wrapper.unmount();
    });

    it('renders login alerts', () => {
      const wrapper = shallow(<GetStartedContent {...defaultProps} />);
      expect(wrapper.find('va-alert')).to.have.length(2);
      wrapper.unmount();
    });
  });

  describe('when user attempts to sign in', () => {
    it('calls the toggleLoginModal prop', () => {
      expect(toggleLoginModalSpy.callCount).to.equal(0);
      const wrapper = shallow(<GetStartedContent {...defaultProps} />);
      wrapper.find('[data-testid="login-alert-button"]').simulate('click');
      expect(toggleLoginModalSpy.callCount).to.equal(1);
      wrapper.unmount();
    });
  });

  describe('when user is logged in', () => {
    it('does not render login alerts', () => {
      const props = { ...defaultProps, showLoginAlert: false };
      const wrapper = shallow(<GetStartedContent {...props} />);
      expect(wrapper.find('va-alert')).to.have.length(0);
      wrapper.unmount();
    });
  });
});
