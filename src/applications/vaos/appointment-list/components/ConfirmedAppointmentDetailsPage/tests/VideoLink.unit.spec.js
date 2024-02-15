import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import moment from 'moment';
import MockDate from 'mockdate';
import VideoLink from '../VideoLink';

describe('VideoVisitInstructions', () => {
  it('renders join appoinment link 30 minutes prior to start time', () => {
    const appointment = {
      location: {
        vistaId: '983',
        locationId: '983',
      },
      start: moment().subtract(30, 'minutes'),
      videoData: {
        url: 'test.com',
      },
    };
    const props = { appointment };
    const wrapper = render(<VideoLink {...props} />);
    expect(wrapper.queryByText('Join appointment')).to.exist;
    expect(wrapper.container.querySelector('.usa-button')).to.exist;
    expect(wrapper.container.querySelector('.usa-button-disabled')).to.not
      .exist;
    // fireEvent.click returns false if event is cancelable, and at least one of the event
    // handlers which received event called Event.preventDefault(). Otherwise true.
    // We do not expect preventDefault() to be called if the link is active.
    expect(fireEvent.click(wrapper.container.querySelector('.usa-button'))).to
      .be.true;
  });
  it('renders join appoinment link 240 minutes after start time', () => {
    const appointment = {
      location: {
        vistaId: '983',
        locationId: '983',
      },
      start: moment(),
      videoData: {
        url: 'test.com',
      },
    };
    const props = { appointment };
    MockDate.set(moment().subtract(240, 'minutes'));
    const wrapper = render(<VideoLink {...props} />);

    expect(wrapper.queryByText('Join appointment')).to.exist;
    expect(wrapper.container.querySelector('.usa-button')).to.exist;
    expect(wrapper.container.querySelector('.usa-button-disabled')).to.not
      .exist;
    // fireEvent.click returns false if event is cancelable, and at least one of the event
    // handlers which received event called Event.preventDefault(). Otherwise true.
    // We do not expect preventDefault() to be called if the link is active.
    expect(fireEvent.click(wrapper.container.querySelector('.usa-button'))).to
      .be.true;
    MockDate.reset();
  });
  it('renders disabled join appoinment link 35 minutes prior to start time', () => {
    const appointment = {
      location: {
        vistaId: '983',
        locationId: '983',
      },
      start: moment().subtract(35, 'minutes'),
      videoData: {
        url: 'test.com',
      },
    };
    const props = { appointment };
    const wrapper = render(<VideoLink {...props} />);
    expect(wrapper.queryByText('Join appointment')).to.exist;
    expect(wrapper.container.querySelector('.usa-button')).to.exist;
    expect(wrapper.container.querySelector('.usa-button-disabled')).to.exist;
  });
  it('renders disabled join appoinment link 4 hours after start time', () => {
    const appointment = {
      location: {
        vistaId: '983',
        locationId: '983',
      },
      start: moment(),
      videoData: {
        url: 'test.com',
      },
    };
    const props = { appointment };
    MockDate.set(moment().subtract(241, 'minutes'));
    const wrapper = render(<VideoLink {...props} />);

    expect(wrapper.queryByText('Join appointment')).to.exist;
    expect(wrapper.container.querySelector('.usa-button')).to.exist;
    expect(wrapper.container.querySelector('.usa-button-disabled')).to.exist;
    MockDate.reset();
  });
  it('call preventDefault function', () => {
    const appointment = {
      location: {
        vistaId: '983',
        locationId: '983',
      },
      start: moment().subtract(35, 'minutes'),
      videoData: {
        url: 'test.com',
      },
    };
    const props = { appointment };
    const wrapper = render(<VideoLink {...props} />);
    expect(wrapper.queryByText('Join appointment')).to.exist;
    expect(wrapper.container.querySelector('.usa-button')).to.exist;
    expect(wrapper.container.querySelector('.usa-button-disabled')).to.exist;

    // fireEvent.click returns false if event is cancelable, and at least one of the event
    // handlers which received event called Event.preventDefault(). Otherwise true.
    // We expect preventDefault() to be called if the link is disabled.
    expect(fireEvent.click(wrapper.container.querySelector('.usa-button'))).to
      .be.false;
  });
});
