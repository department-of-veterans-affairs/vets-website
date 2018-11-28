import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import UserInteractionRecorder from '../../components/UserInteractionRecorder';

describe('<UserInteractionRecorder>', () => {
  let recordEventSpy;
  let component;
  const eventMap = {
    a: 'event-a',
    b: 'event-b',
  };
  beforeEach(() => {
    recordEventSpy = sinon.spy();
    component = mount(
      <UserInteractionRecorder
        eventRecorder={recordEventSpy}
        selectedValue="b"
        trackingEventMap={eventMap}
      />,
    );
  });
  it('does not render anything to the DOM', () => {
    expect(component.children().length).to.equal(0);
  });
  describe('when its props change', () => {
    it('calls the passed-in `recordEvent` function when the new value of selectedValue is in the event map', () => {
      component.setProps({ selectedValue: 'a' });
      expect(recordEventSpy.called).to.be.true;
      expect(recordEventSpy.calledWith('event-a')).to.be.true;
    });

    it('does not call the passed-in `recordEvent` function when the new value of selectedValue is the same as the old value', () => {
      component.setProps({ selectedValue: 'b' });
      expect(recordEventSpy.called).to.be.false;
    });

    it('does not call the passed-in `recordEvent` function when the new value of props.selectedValue is not in the event map', () => {
      component.setProps({ selectedValue: 'z' });
      expect(recordEventSpy.called).to.be.false;
    });
  });
});
