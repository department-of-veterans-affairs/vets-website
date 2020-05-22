import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import createCommonStore from 'platform/startup/store';
import { Modals } from '../../containers/Modals';
import reducer from '../../reducers';

const defaultProps = createCommonStore(reducer).getState();

describe('<Modals>', () => {
  it('should render', () => {
    const wrapper = shallow(<Modals {...defaultProps} />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });

  describe('Section 103 modal', () => {
    const props = {
      ...defaultProps,
      modals: {
        displaying: 'section103',
      },
    };

    it('should render', () => {
      const wrapper = shallow(<Modals {...props} />);
      expect(wrapper.html()).to.contain('Protection against late VA payments');
      wrapper.unmount();
    });

    it('should track link click', () => {
      const wrapper = mount(<Modals {...props} />);
      wrapper
        .find('a')
        .at(0)
        .simulate('click');
      const recordedEvent = global.window.dataLayer[0];
      expect(recordedEvent.event).to.eq('gibct-modal-link-click');
      wrapper.unmount();
    });
  });
});
