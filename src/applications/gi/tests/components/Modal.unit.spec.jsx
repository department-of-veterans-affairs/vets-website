import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import Modal from '../../components/Modal';

describe('<Modal/>', () => {
  it('should render', () => {
    const wrapper = shallow(<Modal />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
  function MockhandleDocumentKeyDown(wrapper, keyCode, shiftKey = undefined) {
    const eventMock = {
      preventDefault: sinon.stub(),
      keyCode,
      shiftKey,
    };
    const handleCloseSpy = sinon.spy(wrapper.instance(), 'handleClose');
    wrapper.instance().handleDocumentKeyDown(eventMock);
    handleCloseSpy.restore();
  }
  it('should call handleClose when ESCAPE_KEY is pressed', () => {
    const wrapper = shallow(<Modal onClose={() => {}} focusSelector />);
    MockhandleDocumentKeyDown(wrapper, 27);

    const handleCloseMock = {
      called: true,
      mockFn() {
        this.called = true;
      },
    };
    wrapper.instance().handleClose = handleCloseMock.mockFn;
    expect(handleCloseMock.called).to.be.true;
    wrapper.unmount();
  });

  it('should call handleClose when TAB_KEY is pressed', () => {
    const wrapper = shallow(<Modal onClose={() => {}} focusSelector />);

    MockhandleDocumentKeyDown(wrapper, 9, true);
    expect(wrapper.state('isTabbingBackwards')).to.equal(true);

    wrapper.unmount();
  });

  it('should set isTabbingBackwards to false when TAB_KEY is pressed without shiftKey', () => {
    const wrapper = shallow(<Modal onClose={() => {}} focusSelector />);
    MockhandleDocumentKeyDown(wrapper, 9, false);
    expect(wrapper.state('isTabbingBackwards')).to.equal(false);
    wrapper.unmount();
  });

  it('should calls onClose if props.visible is true and event.target is not contained within the component', () => {
    const onCloseStub = sinon.stub();
    const elementMock = {
      contains: sinon.stub().returns(false),
    };
    const wrapper = shallow(
      <Modal
        onClose={() => {
          onCloseStub();
        }}
        focusSelector
        visible
        element
      />,
    );
    wrapper.instance().element = elementMock;
    const notContainedTarget = document.createElement('div');
    wrapper.instance().handleDocumentClicked({ target: notContainedTarget });

    expect(onCloseStub.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should call applyFocusToFirstModalElement when not tabbing backwards', () => {
    const spyApplyFocusToFirst = sinon.spy(
      Modal.prototype,
      'applyFocusToFirstModalElement',
    );
    const spyApplyFocusToLast = sinon.spy(
      Modal.prototype,
      'applyFocusToLastModalElement',
    );
    let mockElement = {};
    const props = {
      onClose: () => {},
      focusSelector: 'focus-selector',
      visible: true,
      element: '',
    };
    const wrapper = shallow(<Modal {...props} />);
    Object.defineProperty(mockElement, 'contains', {
      value: sinon.stub().returns(true),
      writable: true,
      configurable: true,
    });

    Object.defineProperty(mockElement, 'querySelector', {
      value: sinon.stub().returns([]),
      writable: true,
      configurable: true,
    });
    Object.defineProperty(mockElement, 'querySelectorAll', {
      value: sinon.stub().returns([]),
      writable: true,
      configurable: true,
    });
    const mockEvent = {
      target: {},
      stopPropagation: sinon.spy(),
    };
    wrapper.instance().element = mockElement;
    wrapper.setState({ isTabbingBackwards: false });
    wrapper.instance().applyFocusToLastModalElement();
    wrapper.instance().handleDocumentFocus({
      target: {},
      stopPropagation: () => {},
    });
    expect(spyApplyFocusToFirst.calledOnce).to.be.true;
    expect(spyApplyFocusToLast.called).to.be.true;
    expect(
      sinon.assert.calledWith(mockElement.querySelectorAll, 'focus-selector'),
    );
    mockElement = {};
    Object.defineProperty(mockElement, 'contains', {
      value: sinon.stub().returns(false),
      writable: true,
      configurable: true,
    });
    Object.defineProperty(mockElement, 'querySelectorAll', {
      value: sinon.stub().returns([]),
      writable: true,
      configurable: true,
    });
    wrapper.instance().element = mockElement;
    wrapper.setState({ isTabbingBackwards: true });
    wrapper.instance().handleDocumentFocus(mockEvent, mockElement);
    expect(sinon.assert.calledTwice(spyApplyFocusToLast));
    expect(mockEvent.stopPropagation.calledOnce).to.be.true;
    wrapper.setState({ isTabbingBackwards: false });
    wrapper.update();
    expect(sinon.assert.calledOnce(spyApplyFocusToFirst));
    spyApplyFocusToFirst.restore();
    spyApplyFocusToLast.restore();
    wrapper.unmount();
  });
  it('focuses the target if it is a button', () => {
    const props = {
      onClose: () => {},
      focusSelector: 'focus-selector',
      visible: true,
      element: '',
    };
    const wrapper = shallow(<Modal {...props} />);
    const mockEvent = {
      target: {
        matches: sinon.stub().returns(true),
        focus: sinon.spy(),
      },
    };

    wrapper.instance().handeFocusOnSafariFirefox(mockEvent);

    expect(mockEvent.target.matches.calledWith('button')).to.be.true;
    expect(mockEvent.target.focus.calledOnce).to.be.true;
    wrapper.unmount();
  });
  it('calls setupModal when visible prop changes from false to true', () => {
    const wrapper = mount(<Modal visible={false} />);
    const spySetupModal = sinon.spy(wrapper.instance(), 'setupModal');
    wrapper.setProps({ visible: true });
    expect(spySetupModal.calledOnce).to.be.true;
    wrapper.unmount();
  });
});
