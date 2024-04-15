import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import VideoVisitProvider from '../VideoVisitProvider';

const appointmentData = {
  status: 'Booked',
};

describe('VAOS Component: VideoVisitProvider', () => {
  it('should return null', () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isPastAppointment: true,
      },
      videoData: {
        providers: [],
      },
    };

    const props = { appointment };
    const wrapper = render(<VideoVisitProvider {...props} />);
    expect(wrapper.queryByText('You met with')).to.not.exist;
  });
  it('should return you met with text and provider name', () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isPastAppointment: true,
      },
      videoData: {
        providers: [
          {
            name: {
              firstName: ['Test', 'PhD'],
              lastName: 'Provider',
            },
            display: 'Test,PhD Provider',
          },
        ],
      },
    };

    const props = { appointment };
    const wrapper = render(<VideoVisitProvider {...props} />);
    expect(wrapper.queryByText('You met with')).to.exist;
    expect(wrapper.queryByText('Test,PhD Provider')).to.exist;
  });
  it("should return you'll be meeting with text and provider name", () => {
    const appointment = {
      ...appointmentData,
      vaos: {
        isPastAppointment: false,
      },
      videoData: {
        providers: [
          {
            name: {
              firstName: ['Test', 'PhD'],
              lastName: 'Provider',
            },
            display: 'Test,PhD Provider',
          },
        ],
      },
    };

    const props = { appointment };
    const wrapper = render(<VideoVisitProvider {...props} />);
    expect(
      wrapper.getByText('You’ll be meeting with', {
        exact: true,
        selector: 'h2',
      }),
    ).to.exist;
    expect(wrapper.queryByText('Test,PhD Provider')).to.exist;
  });
});
