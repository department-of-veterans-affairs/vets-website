import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { mockApiRequest, mockMultipleApiRequests } from '../../../../../platform/testing/unit/helpers';

import ConfirmationPoll, { submissionStatuses } from '../../components/ConfirmationPoll';

const originalFetch = global.fetch;

const pendingResponse = {
  shouldResolve: true,
  response: { status: submissionStatuses.pending }
};
const successResponse = {
  shouldResolve: true,
  response: {
    status: submissionStatuses.succeeded,
    confirmationNumber: '123abc'
  }
};
const failureResponse = {
  shouldResolve: true,
  response: { status: submissionStatuses.failed }
};

describe('ConfirmationPoll', () => {
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should make an api call after mounting', () => {
    mockApiRequest(successResponse);
    shallow(<ConfirmationPoll/>);
    expect(global.fetch.calledOnce).to.be.true;
  });

  it('should continue to make api calls until the response is not pending', (done) => {
    mockMultipleApiRequests([pendingResponse, pendingResponse, successResponse, failureResponse]);
    shallow(<ConfirmationPoll pollRate={10}/>);
    // Should stop after the first success
    setTimeout(() => {
      expect(global.fetch.callCount).to.equal(3);
      done();
    }, 50);
  });

  it('should render a pending message', () => {});
  it('should render a retry message', () => {});
  it('should render a success message', () => {});
  it('should render a failure message', () => {});
});
