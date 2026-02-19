import { expect } from 'chai';
import sinon from 'sinon';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { server, rest } from '../mock-sip-handlers';

import {
  fetchInProgressForm,
  migrateFormData,
  LOAD_STATUSES,
  SET_PREFILL_UNFILLED,
} from '../../save-in-progress/actions';
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
  let warnStub;

  beforeEach(() => {
    warnStub = sinon.stub(console, 'warn');
  });

  afterEach(() => {
    warnStub.restore();
  });

  it('isLocalhost guard prevents console.warn in non-localhost env', () => {
    const wouldWarn = environment.isLocalhost() && !window.Cypress;
    expect(wouldWarn).to.equal(false);
  });

  it('migrateFormData throws with broken migration', () => {
    const dataToMigrate = {
      formId,
      formData: { field: 'value' },
      metadata: { version: 0 },
    };

    expect(() => migrateFormData(dataToMigrate, brokenMigration)).to.throw(
      'Migration broke',
    );
  });

  it('dispatches invalidData when migration throws', () => {
    setupGet(successData);
    const dispatch = sinon.spy();

    return fetchInProgressForm(formId, brokenMigration)(
      dispatch,
      getState,
    ).then(() => {
      const statusCall = dispatch
        .getCalls()
        .find(c => c.args[0]?.status === LOAD_STATUSES.invalidData);
      expect(statusCall).to.exist;
    });
  });

  it('dispatches prefillComplete when prefillTransformer throws', () => {
    setupGet(successData);
    const dispatch = sinon.spy();

    return fetchInProgressForm(formId, {}, true, () => {
      throw new Error('Prefill broke');
    })(dispatch, getState).then(() => {
      const prefillCall = dispatch
        .getCalls()
        .find(c => c.args[0]?.type === SET_PREFILL_UNFILLED);
      expect(prefillCall).to.exist;
    });
  });

  it('does NOT console.warn when not on localhost', () => {
    setupGet(successData);
    const dispatch = sinon.spy();

    return fetchInProgressForm(formId, brokenMigration)(
      dispatch,
      getState,
    ).then(() => {
      expect(warnStub.called).to.be.false;
    });
  });

  it('does NOT console.warn on successful load', () => {
    setupGet(successData);
    const dispatch = sinon.spy();

    return fetchInProgressForm(formId, {})(dispatch, getState).then(() => {
      expect(warnStub.called).to.be.false;
    });
  });
});
