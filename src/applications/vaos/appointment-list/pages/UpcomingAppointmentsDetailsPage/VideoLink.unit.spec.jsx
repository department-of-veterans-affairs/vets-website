import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import { addMinutes, subMinutes } from 'date-fns';
import { formatInTimeZone, zonedTimeToUtc } from 'date-fns-tz';
import React from 'react';
import VideoLink from './VideoLink';
import { DATE_FORMATS } from '../../../utils/constants';

describe('VAOS Component: VideoLink', () => {
  it('renders join appoinment link', () => {
    const now = zonedTimeToUtc(
      addMinutes(new Date(), 240),
      'America/Anchorage',
    );
    const appointment = {
      location: {
        vistaId: '983',
        locationId: '983',
      },
      start: formatInTimeZone(
        now,
        'America/Anchorage',
        DATE_FORMATS.ISODateTime,
      ),
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
    const now = zonedTimeToUtc(subMinutes(new Date(), 35), 'America/New_York');
    const appointment = {
      location: {
        vistaId: '983',
        locationId: '983',
      },
      start: formatInTimeZone(
        now,
        'America/New_York',
        DATE_FORMATS.ISODateTime,
      ),
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
    const now = zonedTimeToUtc(addMinutes(new Date(), 242));
    const appointment = {
      location: {
        vistaId: '983',
        locationId: '983',
      },
      start: now,
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
    const now = subMinutes(new Date(), 35);
    const appointment = {
      location: {
        vistaId: '983',
        locationId: '983',
      },
      start: now,
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
