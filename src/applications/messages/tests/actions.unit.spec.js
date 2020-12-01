import { expect } from 'chai';
import sinon from 'sinon';

import { mockApiRequest, resetFetch } from 'platform/testing/unit/helpers';

import { fetchInquiries, FETCH_INQUIRIES_SUCCESS } from '../actions';

describe('fetchInquiries', () => {
  const mockData = {
    inquiries: [
      {
        subject: 'Prosthetics',
        confirmationNumber: '000-010',
        status: 'OPEN',
        creationTimestamp: '2020-11-01T14:58:00',
        lastActiveTimestamp: '2020-11-04T13:00:00',
        _links: {
          thread: {
            href: '/v1/user/{:user-id}/inquiry/000-010',
          },
        },
      },
    ],
  };

  beforeEach(() => {
    mockApiRequest(mockData, true);
  });

  afterEach(() => {
    resetFetch();
  });

  it('dispatches FETCH_INQUIRIES_SUCCESS when GET succeeds', async () => {
    const dispatch = sinon.spy();
    await fetchInquiries()(dispatch);
    const action = dispatch.firstCall.args[0];
    expect(action.type).to.equal(FETCH_INQUIRIES_SUCCESS);
    action.data.forEach(inquiry => {
      expect(inquiry).to.include.all.keys(
        'subject',
        'confirmationNumber',
        'status',
        'dateLastUpdated',
      );
    });
  });
});
