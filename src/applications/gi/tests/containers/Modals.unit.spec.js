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

  it('should render section 103 content', () => {
    const wrapper = shallow(
      <Modals {...defaultProps} modals={{ displaying: 'section103' }} />,
    );
    expect(wrapper.html()).to.contain('Protection against late VA payments');
    wrapper.unmount();
  });

  it('should track section 103 link click', () => {
    const wrapper = mount(
      <Modals {...defaultProps} modals={{ displaying: 'section103' }} />,
    );
    wrapper
      .find('a')
      .at(0)
      .simulate('click');
    const recordedEvent = global.window.dataLayer[0];
    expect(recordedEvent.event).to.eq('gibct-modal-link-click');
    wrapper.unmount();
  });
});
