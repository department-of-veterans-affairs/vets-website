import { expect } from 'chai';
import sinon from 'sinon';

import { mockApiRequest } from 'platform/testing/unit/helpers';

import {
  transformInquiries,
  fetchInquiries,
  FETCH_INQUIRIES_SUCCESS,
} from '../actions';

function buildInquiryApiResponse(overrides = {}) {
  return {
    subject: 'Prosthetics',
    confirmationNumber: '000-010',
    status: 'OPEN',
    creationTimestamp: '2020-11-01T14:58:00+01:00',
    lastActiveTimestamp: '2020-11-04T13:00:00+02:00',
    links: {
      thread: {
        href: '/v1/user/{:user-id}/inquiry/000-010',
      },
    },
    ...overrides,
  };
}

describe('transformInquiries', () => {
  it('formats dateLastUpdated', () => {
    const mockData = [
      buildInquiryApiResponse({
        lastActiveTimestamp: '2020-11-04T13:00:00+02:00',
      }),
    ];
    const result = transformInquiries(mockData);

    expect(result[0].dateLastUpdated).to.eql('November 4, 2020');
  });

  it('formats status', () => {
    const mockData = [
      buildInquiryApiResponse({
        status: 'OPEN',
      }),
    ];
    const result = transformInquiries(mockData);

    expect(result[0].status).to.eql('Open');
  });

  it('sorts inquiries by last active date, most recent first', () => {
    const mockData = [
      buildInquiryApiResponse({
        subject: 'Oldest',
        lastActiveTimestamp: '2020-11-04T13:00:00+02:00',
      }),
      buildInquiryApiResponse({
        subject: 'Newest',
        lastActiveTimestamp: '2020-12-01T13:00:00+02:00',
      }),
      buildInquiryApiResponse({
        subject: 'Middle',
        lastActiveTimestamp: '2020-11-20T13:00:00+02:00',
      }),
    ];
    const result = transformInquiries(mockData).map(inquiry => inquiry.subject);

    expect(result).to.eql(['Newest', 'Middle', 'Oldest']);
  });
});

describe('fetchInquiries', () => {
  const mockData = {
    inquiries: [buildInquiryApiResponse()],
  };

  beforeEach(() => {
    mockApiRequest(mockData, true);
  });

  it('dispatches FETCH_INQUIRIES_SUCCESS when GET succeeds', async () => {
    const dispatch = sinon.spy();
    await fetchInquiries()(dispatch);
    const action = dispatch.firstCall.args[0];
    expect(action.type).to.equal(FETCH_INQUIRIES_SUCCESS);
    expect(action.data[0]).to.include.all.keys(
      'subject',
      'confirmationNumber',
      'status',
      'dateLastUpdated',
    );
  });
});
