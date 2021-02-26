import { expect } from 'chai';

import { getCurrentAppointmentId } from '../index';

describe('health care questionnaire -- utils -- get current id from url or window', () => {
  it('window is undefined', () => {
    const id = getCurrentAppointmentId(undefined);
    expect(id).to.be.null;
  });
  it('is in url', () => {
    const window = {
      location: {
        search: '?id=12345',
      },
    };
    const id = getCurrentAppointmentId(window);
    expect(id).to.equal('12345');
  });
  it('is in storage', () => {
    const window = {
      location: {
        search: '',
      },
      sessionStorage: {
        getItem: () => JSON.stringify({ appointmentId: '67890' }),
      },
    };
    const id = getCurrentAppointmentId(window);
    expect(id).to.equal('67890');
  });
  it('url is prioritized over session', () => {
    const window = {
      location: {
        search: '?id=12345',
      },
      sessionStorage: {
        getItem: () => JSON.stringify({ appointmentId: '67890' }),
      },
    };
    const id = getCurrentAppointmentId(window);
    expect(id).to.equal('12345');
  });
  it('id is not found', () => {
    const window = {
      location: {
        search: '',
      },
      sessionStorage: {
        getItem: () => JSON.stringify({}),
      },
    };
    const id = getCurrentAppointmentId(window);
    expect(id).to.be.null;
  });
});
