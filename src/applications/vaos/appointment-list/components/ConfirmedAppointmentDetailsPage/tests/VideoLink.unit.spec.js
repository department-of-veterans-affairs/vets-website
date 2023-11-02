import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import moment from 'moment';
import VideoLink from '../VideoLink';

describe('VideoVisitInstructions', () => {
  it('renders join appoinment link', () => {
    const appointment = {
      start: moment(),
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
  });
  it('renders disabled join appoinment link 35 minutes prior to start time', () => {
    const appointment = {
      start: moment().add(35, 'm'),
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
      start: moment().subtract(241, 'm'),
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
});
