import { expect } from 'chai';
import sinon from 'sinon';
import * as api from '@department-of-veterans-affairs/platform-utilities/api';
import environment from 'platform/utilities/environment';
import * as helpers from '../../../helpers';
import {
  CH31_CASE_MILESTONES_FETCH_FAILED,
  CH31_CASE_MILESTONES_FETCH_STARTED,
  CH31_CASE_MILESTONES_FETCH_SUCCEEDED,
} from '../../../constants';
import { submitCh31CaseMilestones } from '../../../actions/ch31-case-milestones';

const formatToday = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
};

describe('ch31-case-milestones actions', () => {
  let apiStub;
  let dispatch;

  beforeEach(() => {
    apiStub = sinon.stub(api, 'apiRequest');
    dispatch = sinon.spy();
  });

  afterEach(() => {
    apiStub.restore();
  });

  it('dispatches STARTED and SUCCEEDED on successful POST', async () => {
    const mockResponse = { data: { foo: 'bar' } };
    apiStub.resolves(mockResponse);

    await submitCh31CaseMilestones({
      milestoneCompletionType: 'TEST_MILESTONE',
    })(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(
      CH31_CASE_MILESTONES_FETCH_STARTED,
    );

    const [url, options] = apiStub.getCall(0).args;
    expect(url).to.equal(`${environment.API_URL}/vre/v0/ch31_case_milestones`);
    expect(options.method).to.equal('POST');
    expect(options.headers['Content-Type']).to.equal('application/json');
    const body = JSON.parse(options.body);
    expect(body.milestones[0].postpone).to.be.false;
    expect(body.milestones[0].milestoneType).to.equal('TEST_MILESTONE');
    expect(body.milestones[0].isMilestoneCompleted).to.be.true;
    expect(body.milestones[0].milestoneCompletionDate).to.equal(formatToday());

    expect(dispatch.getCall(1).args[0].type).to.equal(
      CH31_CASE_MILESTONES_FETCH_SUCCEEDED,
    );
    expect(dispatch.getCall(1).args[0].payload).to.deep.equal(
      mockResponse.data,
    );
  });

  it('dispatches STARTED and FAILED on API error', async () => {
    const error = { status: 400, message: 'Bad request' };
    const getStatusStub = sinon.stub(helpers, 'getStatus').returns(400);
    const extractMessagesStub = sinon
      .stub(helpers, 'extractMessages')
      .returns(['Bad request']);

    apiStub.rejects(error);

    await submitCh31CaseMilestones({
      milestoneCompletionType: 'TEST_MILESTONE',
    })(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(
      CH31_CASE_MILESTONES_FETCH_STARTED,
    );
    expect(dispatch.getCall(1).args[0].type).to.equal(
      CH31_CASE_MILESTONES_FETCH_FAILED,
    );
    expect(dispatch.getCall(1).args[0].error.status).to.equal(400);

    getStatusStub.restore();
    extractMessagesStub.restore();
  });
});
