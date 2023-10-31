import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { focusElement } from 'platform/utilities/ui';
import LearnMoreLabel from '../../components/LearnMoreLabel';

describe('<LearnMoreLabel/>', () => {
  it('should render', () => {
    const wrapper = shallow(<LearnMoreLabel />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });

  it('should bold text', () => {
    const wrapper = shallow(<LearnMoreLabel bold />);
    expect(wrapper.find('strong')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('then should call focus with labelFor and record an event on click', () => {
    const focusMock = sinon.stub(focusElement, 'focus');
    const recordEventMock = sinon.stub(window, 'recordEvent');
    const wrapper = shallow(<LearnMoreLabel labelFor="test" />);
    wrapper
      .find('span.vads-u-margin--0.vads-u-display--inline-block')
      .first()
      .simulate('click');
    expect(focusMock.calledWith('test')).to.be.false;
    expect(
      recordEventMock.calledWith({
        event: 'cta-button-click',
        'button-click': 'testAriaLabel',
        'button-type': 'link',
      }),
    ).to.be.false;
    focusMock.restore();
    recordEventMock.restore();
    wrapper.unmount();
  });
});
