import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import moment from 'moment-timezone';
import VideoLink from '../VideoLink';

describe('VAOS Component: VideoLink', () => {
  it('renders join appoinment link', () => {
    const now = moment();
    const appointment = {
      location: {
        vistaId: '983',
        locationId: '983',
      },
      localStartTime: moment.tz(now, 'America/Anchorage').add(240, 'minutes'),
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
  it('renders disabled join appoinment link 35 minutes prior to start time', () => {
    const now = moment();
    const appointment = {
      location: {
        vistaId: '983',
        locationId: '983',
      },
      localStartTime: moment
        .tz(now, 'America/New_York')
        .subtract(35, 'minutes'),
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
    const now = moment();
    const appointment = {
      location: {
        vistaId: '983',
        locationId: '983',
      },
      localStartTime: moment(now).add(242, 'minutes'),
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
  it('call preventDefault function', () => {
    const now = moment();
    const appointment = {
      location: {
        vistaId: '983',
        locationId: '983',
      },
      localStartTime: moment(now).subtract(35, 'minutes'),
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
