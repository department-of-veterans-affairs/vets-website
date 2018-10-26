import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';

import {
  mockApiRequest,
  mockMultipleApiRequests,
} from '../../../../../platform/testing/unit/helpers';

import { ConfirmationPoll } from '../../components/ConfirmationPoll';
import { submissionStatuses } from '../../constants';

const originalFetch = global.fetch;

const pendingResponse = {
  shouldResolve: true,
  response: {
    data: {
      attributes: {
        transactionStatus: submissionStatuses.pending,
      },
    },
  },
};

const successResponse = {
  shouldResolve: true,
  response: {
    data: {
      attributes: {
        transactionStatus: submissionStatuses.succeeded,
        metadata: {
          claimId: '123abc',
        },
      },
    },
  },
};

const failureResponse = {
  shouldResolve: true,
  response: {
    data: {
      attributes: {
        transactionStatus: submissionStatuses.failed,
      },
    },
  },
};

describe('ConfirmationPoll', () => {
  const defaultProps = {
    jobId: '12345',
    fullName: { first: 'asdf', last: 'fdsa' },
    disabilities: [],
    submittedAt: Date.now(),
  };

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should make an api call after mounting', () => {
    mockApiRequest(successResponse.response);
    shallow(<ConfirmationPoll />);
    expect(global.fetch.calledOnce).to.be.true;
  });

  it('should continue to make api calls until the response is not pending', done => {
    mockMultipleApiRequests([
      pendingResponse,
      pendingResponse,
      successResponse,
      failureResponse,
    ]);
    // TODO: Figure out why this is causing an error in the console even though the test passes
    //  It may have something to do with unmounting the component before a `setState` goes through
    mount(<ConfirmationPoll pollRate={10} />);
    // Should stop after the first success
    setTimeout(() => {
      expect(global.fetch.callCount).to.equal(3);
      done();
    }, 50);
  });

  it('should render the confirmation page', done => {
    mockApiRequest(successResponse.response);
    const tree = shallow(<ConfirmationPoll {...defaultProps} pollRate={10} />);
    setTimeout(() => {
      // Without this update, it wasn't catching the last render even though the function was running first
      tree.update();
      const confirmationPage = tree.find('ConfirmationPage');
      expect(confirmationPage.length).to.equal(1);
      expect(confirmationPage.first().props()).to.eql({
        submissionStatus: submissionStatuses.succeeded,
        claimId: '123abc',
        jobId: defaultProps.jobId,
        fullName: defaultProps.fullName,
        disabilities: defaultProps.disabilities,
        submittedAt: defaultProps.submittedAt,
      });
      done();
    }, 500);
  });
});
