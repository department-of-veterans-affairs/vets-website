import { expect } from 'chai';

import { getAppointmentIdFromUrl } from '../index';

describe('health care questionnaire -- utils -- get id from url in window', () => {
  it('window is undefined', () => {
    const id = getAppointmentIdFromUrl(undefined);
    expect(id).to.be.null;
  });
  it('location is undefined', () => {
    const result = getAppointmentIdFromUrl({});
    expect(result).to.be.null;
  });
  it('not url params', () => {
    const result = getAppointmentIdFromUrl({
      location: {
        search: '',
      },
    });
    expect(result).to.be.null;
  });
  it('id is not in url', () => {
    const result = getAppointmentIdFromUrl({
      location: {
        search: '?NotId=195bc02c0518870fc6b1e302cfc326b6',
      },
    });
    expect(result).to.be.null;
  });
  it('id is in url', () => {
    const result = getAppointmentIdFromUrl({
      location: {
        search: '?id=195bc02c0518870fc6b1e302cfc326b6',
      },
    });
    expect(result).to.equal('195bc02c0518870fc6b1e302cfc326b6');
  });
});
