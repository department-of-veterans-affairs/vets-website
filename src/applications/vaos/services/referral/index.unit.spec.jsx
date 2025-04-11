import { expect } from 'chai';
import sinon from 'sinon';
import * as services from './index';
import * as utils from '../utils';

describe('Referral Services', () => {
  let sandbox;
  let requestStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    requestStub = sandbox.stub(utils, 'apiRequestWithUrl');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('getPatientReferrals calls the correct endpoint and returns data', async () => {
    requestStub.resolves({ data: [{ id: 1 }] });

    const result = await services.getPatientReferrals();

    expect(
      requestStub.calledWith('/vaos/v2/epsApi/referrals', {
        method: 'GET',
      }),
    ).to.be.true;

    expect(result).to.deep.equal([{ id: 1 }]);
  });

  it('getPatientReferralById calls the correct endpoint and returns data', async () => {
    requestStub.resolves({ data: { id: 'abc' } });

    const result = await services.getPatientReferralById('abc');

    expect(
      requestStub.calledWith('/vaos/v2/epsApi/referrals/abc', {
        method: 'GET',
      }),
    ).to.be.true;

    expect(result).to.deep.equal({ id: 'abc' });
  });

  it('getProviderById calls the correct endpoint and returns data', async () => {
    requestStub.resolves({ data: { name: 'Provider A' } });

    const result = await services.getProviderById('prov-id');

    expect(
      requestStub.calledWith('/vaos/v2/epsApi/providerDetails/prov-id', {
        method: 'GET',
      }),
    ).to.be.true;

    expect(result).to.deep.equal({ name: 'Provider A' });
  });

  it('postReferralAppointment sends the correct payload and returns data', async () => {
    const input = {
      referralId: 'r1',
      slotId: 's1',
      draftApppointmentId: 'd1',
    };
    const expectedBody = JSON.stringify(input);

    requestStub.resolves({ data: { success: true } });

    const result = await services.postReferralAppointment(input);

    expect(
      requestStub.calledWith('/vaos/v2/epsApi/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expectedBody,
      }),
    ).to.be.true;

    expect(result).to.deep.equal({ success: true });
  });

  it('postDraftReferralAppointment sends the correct payload and returns data', async () => {
    requestStub.resolves({ data: { draft: true } });

    const result = await services.postDraftReferralAppointment('ref-id-123');

    expect(
      requestStub.calledWith('/vaos/v2/epsApi/draftReferralAppointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralId: 'ref-id-123' }),
      }),
    ).to.be.true;

    expect(result).to.deep.equal({ draft: true });
  });

  it('getAppointmentInfo calls the correct endpoint and returns data', async () => {
    requestStub.resolves({ data: { appointment: { id: 'a1' } } });

    const result = await services.getAppointmentInfo('a1');

    expect(
      requestStub.calledWith('/vaos/v2/epsApi/appointments/a1', {
        method: 'GET',
      }),
    ).to.be.true;

    expect(result).to.deep.equal({ appointment: { id: 'a1' } });
  });
});
