import { expect } from 'chai';
import sinon from 'sinon';

import { mockApiRequest, resetFetch } from 'platform/testing/unit/helpers';

import {
  processInquiries,
  fetchInquiries,
  FETCH_INQUIRIES_SUCCESS,
} from '../actions';

describe('processInquiries', () => {
  const mockData = [
    {
      subject: 'Prosthetics',
      confirmationNumber: '000-010',
      status: 'OPEN',
      creationTimestamp: '2020-11-01T14:58:00',
      lastActiveTimestamp: '2020-11-04T13:00:00',
      links: {
        thread: {
          href: '/v1/user/{:user-id}/inquiry/000-010',
        },
      },
    },
  ];

  it('formats dateLastUpdated', () => {
    const result = processInquiries(mockData);

    expect(result[0].dateLastUpdated).to.eql('November 4, 2020');
  });

  it('formats status', () => {
    const result = processInquiries(mockData);

    expect(result[0].status).to.eql('Open');
  });
});

describe('fetchInquiries', () => {
  const mockData = {
    inquiries: [
      {
        subject: 'Prosthetics',
        confirmationNumber: '000-010',
        status: 'OPEN',
        creationTimestamp: '2020-11-01T14:58:00',
        lastActiveTimestamp: '2020-11-04T13:00:00',
        links: {
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
