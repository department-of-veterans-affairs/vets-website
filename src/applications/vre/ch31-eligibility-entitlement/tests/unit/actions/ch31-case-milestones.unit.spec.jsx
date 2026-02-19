import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';
import * as api from '@department-of-veterans-affairs/platform-utilities/api';
import environment from 'platform/utilities/environment';
import * as helpers from '../../../helpers';
import {
  CH31_CASE_MILESTONES_FETCH_FAILED,
  CH31_CASE_MILESTONES_FETCH_STARTED,
  CH31_CASE_MILESTONES_FETCH_SUCCEEDED,
} from '../../../constants';
import { submitCh31CaseMilestones } from '../../../actions/ch31-case-milestones';

describe('ch31-case-milestones actions', () => {
  let apiStub;
  let dispatch;
  let user;
  let clock;

  beforeEach(() => {
    apiStub = sinon.stub(api, 'apiRequest');
    dispatch = sinon.spy();
    user = {
      profile: {
        icn: '1234567890V123456',
        accountUuid: 'uuid-abc-123',
      },
    };
    // Freeze time for predictable date
    clock = sinon.useFakeTimers(new Date('2024-01-01T12:00:00Z').getTime());
  });

  afterEach(() => {
    apiStub.restore();
    clock.restore();
  });

  it('dispatches STARTED and SUCCEEDED on successful POST', async () => {
    const mockResponse = { data: { foo: 'bar' } };
    apiStub.resolves(mockResponse);

    await submitCh31CaseMilestones({
      milestoneCompletionType: 'TEST_MILESTONE',
      user,
    })(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(
      CH31_CASE_MILESTONES_FETCH_STARTED,
    );
    expect(apiStub.calledOnce).to.be.true;

    // Check request payload
    const [url, options] = apiStub.getCall(0).args;
    expect(url).to.equal(`${environment.API_URL}/vre/v0/ch31_case_milestones`);
    expect(options.method).to.equal('POST');
    expect(options.headers['Content-Type']).to.equal('application/json');
    const body = JSON.parse(options.body);
    expect(body.icn).to.equal(user.profile.icn);
    expect(body.milestones[0].milestoneType).to.equal('TEST_MILESTONE');
    expect(body.milestones[0].isMilestoneCompleted).to.be.true;
    expect(body.milestones[0].milestoneCompletionDate).to.equal(
      moment().format('YYYY-MM-DD'),
    );
    expect(body.milestones[0].milestoneSubmissionUser).to.equal(
      user.profile.accountUuid,
    );

    // Success action
    expect(dispatch.getCall(1).args[0].type).to.equal(
      CH31_CASE_MILESTONES_FETCH_SUCCEEDED,
    );
    expect(dispatch.getCall(1).args[0].payload).to.deep.equal(
      mockResponse.data,
    );
  });

  it('dispatches STARTED and FAILED on API error with status and messages', async () => {
    const error = { status: 400, message: 'Bad request' };
    const getStatusStub = sinon.stub(helpers, 'getStatus').returns(400);
    const extractMessagesStub = sinon
      .stub(helpers, 'extractMessages')
      .returns(['Bad request']);

    apiStub.rejects(error);

    await submitCh31CaseMilestones({
      milestoneCompletionType: 'TEST_MILESTONE',
      user,
    })(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(
      CH31_CASE_MILESTONES_FETCH_STARTED,
    );
    expect(dispatch.getCall(1).args[0].type).to.equal(
      CH31_CASE_MILESTONES_FETCH_FAILED,
    );
    expect(dispatch.getCall(1).args[0].error.status).to.equal(400);
    expect(dispatch.getCall(1).args[0].error.messages).to.deep.equal([
      'Bad request',
    ]);

    getStatusStub.restore();
    extractMessagesStub.restore();
  });

  it('dispatches FAILED with default message if no messages returned', async () => {
    const error = { status: 500, message: 'Server error' };
    const getStatusStub = sinon.stub(helpers, 'getStatus').returns(500);
    const extractMessagesStub = sinon
      .stub(helpers, 'extractMessages')
      .returns([]);

    apiStub.rejects(error);

    await submitCh31CaseMilestones({
      milestoneCompletionType: 'TEST_MILESTONE',
      user,
    })(dispatch);

    expect(dispatch.getCall(1).args[0].type).to.equal(
      CH31_CASE_MILESTONES_FETCH_FAILED,
    );
    expect(dispatch.getCall(1).args[0].error.status).to.equal(500);
    expect(dispatch.getCall(1).args[0].error.messages).to.deep.equal([
      'Server error',
    ]);

    getStatusStub.restore();
    extractMessagesStub.restore();
  });

  it('dispatches FAILED with "Network error" if no status or message', async () => {
    const error = {};
    const getStatusStub = sinon.stub(helpers, 'getStatus').returns(undefined);
    const extractMessagesStub = sinon
      .stub(helpers, 'extractMessages')
      .returns([]);

    apiStub.rejects(error);

    await submitCh31CaseMilestones({
      milestoneCompletionType: 'TEST_MILESTONE',
      user,
    })(dispatch);

    expect(dispatch.getCall(1).args[0].type).to.equal(
      CH31_CASE_MILESTONES_FETCH_FAILED,
    );
    expect(dispatch.getCall(1).args[0].error.status).to.equal(null);
    expect(dispatch.getCall(1).args[0].error.messages).to.deep.equal([
      'Network error',
    ]);

    getStatusStub.restore();
    extractMessagesStub.restore();
  });
});
