import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { GetStartedContent } from '../../../../components/IntroductionPage/GetStarted';

describe('hca <GetStartedContent>', () => {
  const defaultProps = {
    route: {
      formConfig: {
        prefillEnabled: false,
        savedFormMessages: {},
        downtime: {},
      },
      pageList: [],
    },
    showLoginAlert: true,
    toggleLoginModal: sinon.spy(),
  };

  describe('when the component renders', () => {
    it('should render the static content', () => {
      const wrapper = shallow(<GetStartedContent {...defaultProps} />);
      expect(wrapper.find('ProcessTimeline')).to.have.length(1);
      expect(wrapper.find('OMBInfo')).to.have.length(1);
      wrapper.unmount();
    });
  });

  describe('when user is not logged in', () => {
    it('should render the correct number of login alerts', () => {
      const wrapper = shallow(<GetStartedContent {...defaultProps} />);
      expect(wrapper.find('va-alert')).to.have.length(2);
      wrapper.unmount();
    });

    it('should render the correct number of `Start Application` buttons', () => {
      const wrapper = shallow(<GetStartedContent {...defaultProps} />);
      expect(wrapper.find('Connect(SaveInProgressIntro)')).to.have.length(1);
      wrapper.unmount();
    });
  });

  describe('when user is logged in', () => {
    const props = { ...defaultProps, showLoginAlert: false };

    it('should not render login alerts', () => {
      const wrapper = shallow(<GetStartedContent {...props} />);
      expect(wrapper.find('va-alert')).to.have.length(0);
      wrapper.unmount();
    });

    it('should render the correct number of `Start Application` buttons', () => {
      const wrapper = shallow(<GetStartedContent {...props} />);
      expect(wrapper.find('Connect(SaveInProgressIntro)')).to.have.length(2);
      wrapper.unmount();
    });
  });

  describe('when user attempts to sign in', () => {
    const { toggleLoginModal } = defaultProps;
    it('should call the `toggleLoginModal` action', () => {
      expect(toggleLoginModal.callCount).to.equal(0);
      const wrapper = shallow(<GetStartedContent {...defaultProps} />);
      wrapper.find('[data-testid="hca-login-alert-button"]').simulate('click');
      expect(toggleLoginModal.callCount).to.equal(1);
      wrapper.unmount();
    });
  });
});
