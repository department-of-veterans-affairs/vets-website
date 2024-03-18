import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import CancelLink from '../CancelLink';

const appointmentData = {
  start: '2024-07-19T12:00:00Z',
  status: 'Booked',
};

describe('VAOS Component: CancelLink', () => {
  it('renders null when hideCanceledOrPast is true', async () => {
    const initialState = {
      featureToggles: {
        vaOnlineSchedulingCancel: false,
      },
    };
    const appointment = {
      ...appointmentData,
      vaos: {
        isPastAppointment: true,
      },
      status: 'cancelled',
    };
    const props = { appointment };
    const wrapper = renderWithStoreAndRouter(<CancelLink {...props} />, {
      initialState,
    });
    expect(await wrapper.queryByText('Cancel appointment')).to.not.exist;
  });
  it('returns null if date is invalid', async () => {
    const initialState = {
      featureToggles: {
        vaOnlineSchedulingCancel: true,
      },
    };
    const appointment = {
      ...appointmentData,
      vaos: {
        isPastAppointment: false,
      },
      start: null,
    };
    const props = { appointment };
    const wrapper = renderWithStoreAndRouter(<CancelLink {...props} />, {
      initialState,
    });
    expect(await wrapper.queryByText('Cancel appointment')).to.exist;
    expect(await wrapper.queryByText('on July 19, 2024')).to.not.exist;
  });
  it('renders cancel link', async () => {
    const initialState = {
      featureToggles: {
        vaOnlineSchedulingCancel: true,
      },
    };
    const appointment = {
      ...appointmentData,
      vaos: {
        isPastAppointment: false,
      },
    };
    const props = { appointment };
    const wrapper = renderWithStoreAndRouter(<CancelLink {...props} />, {
      initialState,
    });
    expect(await wrapper.getByTestId('cancelButton')).to.exist;
    expect(await wrapper.queryByText('Cancel appointment')).to.exist;
    expect(await wrapper.queryByText('on July 19, 2024')).to.exist;
  });
  it('calls GA event when button is clicked', async () => {
    const initialState = {
      featureToggles: {
        vaOnlineSchedulingCancel: true,
      },
    };
    const appointment = {
      ...appointmentData,
      vaos: {
        isPastAppointment: false,
      },
    };

    const props = { appointment };
    const wrapper = renderWithStoreAndRouter(<CancelLink {...props} f />, {
      initialState,
    });

    fireEvent.click(await wrapper.getByTestId('cancelButton'));
    const event = global.window.dataLayer[0];
    expect(event).to.deep.equal({
      event: 'vaos-cancel-booked-clicked',
    });
  });
});
