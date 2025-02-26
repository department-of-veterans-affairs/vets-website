import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import * as recordEventModule from 'platform/monitoring/record-event';
import * as scrollToTopModule from 'platform/utilities/ui/scrollToTop';

import BackToTop from '../../components/BackToTop';

describe('<BackToTop>', () => {
  let originalScrollToTop;
  let scrollToTopSpy;
  let orginalRecordEvent;
  let recordEvenetSpy;

  it('should render', () => {
    const tree = shallow(<BackToTop compare={{ open: true }} />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });

  // Test for resize and scroll event listener on mount in the useEffect
  it('should add resize and scroll event listener on mount', () => {
    const addEventListenerSpy = sinon.spy(window, 'addEventListener');

    const tree = mount(
      <BackToTop
        compare={{ open: false }}
        parentId="someId"
        profilePageHeaderId="id"
        smallScreen={false}
      />,
    );
    expect(addEventListenerSpy.called).to.be.true;
    addEventListenerSpy.restore();
    tree.unmount();
  });

  // test for handleScroll
  it('should update state when handleScroll is called', () => {
    const setScrolled = sinon.spy();
    sinon.stub(React, 'useState').returns([false, setScrolled]);
    const wrapper = mount(
      <BackToTop
        compare={{ open: false }}
        parentId="someId"
        profilePageHeaderId="id"
        smallScreen={false}
      />,
    );

    window.dispatchEvent(new Event('scroll'));

    setTimeout(() => {
      expect(setScrolled.calledWith(true)).to.be.false;
      React.useState.restore();
    }, 0);
    wrapper.unmount();
  });

  // Test for Using an useEffect to correctly access the value of compareOpen
  it('should handle the useEffect logic correctly', () => {
    const placeholderRef = { current: document.createElement('div') };
    const getElementByIdStub = sinon.stub(document, 'getElementById');
    getElementByIdStub.returns(placeholderRef);
    const getBoundingClientRectSpy = sinon.stub();
    placeholderRef.getBoundingClientRect = getBoundingClientRectSpy;
    const wrapper = mount(
      <BackToTop
        smallScreen
        compare={{ open: true }}
        profilePageHeaderId="profile-header"
        compareOpen={false}
        scrolled={false}
        placeholder={placeholderRef}
      />,
    );
    expect(wrapper.find('.back-to-top-container')).to.exist;
    getElementByIdStub.restore();
    wrapper.unmount();
  });

  // Test for onClick
  it('updates backToTopContainerStyle on resize when floating is true and parent element exists', () => {
    originalScrollToTop = scrollToTopModule.default;
    orginalRecordEvent = recordEventModule.default;
    scrollToTopSpy = sinon.spy();
    scrollToTopModule.default = scrollToTopSpy;
    recordEvenetSpy = sinon.spy();
    recordEventModule.default = recordEvenetSpy;

    const wrapper = shallow(
      <BackToTop
        compare={{ open: true }}
        profilePageHeaderId="profile-header"
        compareOpen={false}
      />,
    );

    wrapper.find('button').simulate('click');
    expect(scrollToTopSpy.calledOnce).to.be.true;
    expect(scrollToTopSpy.calledOnce).to.be.true;
    scrollToTopModule.default = originalScrollToTop;
    recordEventModule.default = orginalRecordEvent;
    wrapper.unmount();
  });
  it('should not display floating style on small screens when compare is open', () => {
    const wrapper = mount(<BackToTop smallScreen compare={{ open: true }} />);
    const floatingStyle = wrapper.find('.back-to-top-floating');
    expect(floatingStyle.length).to.equal(0);
    wrapper.unmount();
  });
  it('should display floating style if scrolled and not a small screen', () => {
    const getBoundingClientRectStub = sinon.stub().returns({ bottom: -1 });
    global.document.getElementById = sinon
      .stub()
      .returns({ getBoundingClientRect: getBoundingClientRectStub });

    const wrapper = mount(
      <BackToTop smallScreen={false} compare={{ open: false }} />,
    );
    global.window.dispatchEvent(new Event('scroll'));
    wrapper.update();

    const floatingStyle = wrapper.find('.back-to-top-floating');
    expect(floatingStyle.length).to.equal(0);
    wrapper.unmount();
  });
  it('should focus on h1 element inside profilePageHeaderId when Back to Top is clicked', () => {
    const profilePageHeaderId = 'profile-header';
    const mockFocus = sinon.spy();
    const headerDiv = document.createElement('div');
    headerDiv.id = profilePageHeaderId;
    const h1Element = document.createElement('h1');
    h1Element.focus = mockFocus;
    headerDiv.appendChild(h1Element);
    document.body.appendChild(headerDiv);

    const wrapper = mount(
      <BackToTop
        parentId="someId"
        profilePageHeaderId={profilePageHeaderId}
        compare={{ open: false }}
        smallScreen={false}
      />,
    );
    wrapper.find('button').simulate('click');
    expect(mockFocus.calledOnce).to.be.true;
    document.body.removeChild(headerDiv);
    wrapper.unmount();
  });
});
