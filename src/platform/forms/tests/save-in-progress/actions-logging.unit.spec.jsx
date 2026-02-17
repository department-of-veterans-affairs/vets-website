import { expect } from 'chai';
import sinon from 'sinon';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { server, rest } from '../mock-sip-handlers';
import * as datadogUtilities from '../../../monitoring/Datadog/utilities';

import { fetchInProgressForm } from '../../save-in-progress/actions';
import { inProgressApi } from '../../helpers';

const getState = () => ({
  form: { trackingPrefix: 'test', pages: {} },
});

const formId = VA_FORM_IDS.FORM_10_10EZ;

const setupGet = (response, status = 200) => {
  server.use(
    rest.get(inProgressApi(formId), (req, res, ctx) =>
      res(ctx.status(status), ctx.json(response)),
    ),
  );
};

const successData = {
  formData: { field: 'value' },
  metadata: { version: 0, prefill: true },
};

const brokenMigration = [
  () => {
    throw new Error('Migration broke');
  },
];

describe('Save-in-progress Datadog logging', () => {
  let ddStub;
  let warnStub;
  let localhostStub;

  beforeEach(() => {
    ddStub = sinon.stub(datadogUtilities, 'dataDogLogger');
    warnStub = sinon.stub(console, 'warn');
  });

  afterEach(() => {
    ddStub.restore();
    warnStub.restore();
    if (localhostStub) {
      localhostStub.restore();
      localhostStub = null;
    }
  });

  it('logs to Datadog when migration throws', () => {
    setupGet(successData);
    const dispatch = sinon.spy();

    return fetchInProgressForm(formId, brokenMigration)(
      dispatch,
      getState,
    ).then(() => {
      expect(ddStub.calledOnce).to.be.true;
      const args = ddStub.firstCall.args[0];
      expect(args.message).to.equal('vets_sip_error_migration');
      expect(args.status).to.equal('error');
      expect(args.error).to.be.an.instanceOf(Error);
      expect(args.attributes).to.have.property('metadata');
    });
  });

  it('logs to Datadog when prefillTransformer throws', () => {
    setupGet(successData);
    const dispatch = sinon.spy();

    return fetchInProgressForm(formId, {}, true, () => {
      throw new Error('Prefill broke');
    })(dispatch, getState).then(() => {
      expect(ddStub.called).to.be.true;
      expect(ddStub.firstCall.args[0].message).to.equal(
        'vets_sip_error_migration',
      );
      expect(ddStub.firstCall.args[0].error.message).to.equal('Prefill broke');
    });
  });

  it('shows console.warn on localhost', () => {
    localhostStub = sinon.stub(environment, 'isLocalhost').returns(true);
    setupGet(successData);
    const dispatch = sinon.spy();

    return fetchInProgressForm(formId, brokenMigration)(
      dispatch,
      getState,
    ).then(() => {
      expect(warnStub.called).to.be.true;
      expect(warnStub.firstCall.args[0]).to.include('SiP');
    });
  });

  it('does NOT show console.warn in non-localhost environments', () => {
    localhostStub = sinon.stub(environment, 'isLocalhost').returns(false);
    setupGet(successData);
    const dispatch = sinon.spy();

    return fetchInProgressForm(formId, brokenMigration)(
      dispatch,
      getState,
    ).then(() => {
      expect(warnStub.called).to.be.false;
      expect(ddStub.called).to.be.true;
    });
  });

  it('logs to Datadog on network error', () => {
    server.use(
      rest.get(inProgressApi(formId), (req, res) =>
        res.networkError('SIP Network Error'),
      ),
    );
    const dispatch = sinon.spy();

    return fetchInProgressForm(formId, {})(dispatch, getState).then(() => {
      const call = ddStub
        .getCalls()
        .find(c => c.args[0].message === 'vets_sip_error_fetch');
      expect(call).to.exist;
      expect(call.args[0].status).to.equal('error');
    });
  });

  it('does NOT log to Datadog on successful load', () => {
    setupGet(successData);
    const dispatch = sinon.spy();

    return fetchInProgressForm(formId, {})(dispatch, getState).then(() => {
      expect(ddStub.called).to.be.false;
    });
  });
});
