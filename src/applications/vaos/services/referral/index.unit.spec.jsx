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

  it('getPatientReferralById calls the correct endpoint and returns data', async () => {
    requestStub.resolves({ data: { id: 'abc' } });

    const result = await services.getPatientReferralById('abc');

    expect(
      requestStub.calledWith('/vaos/v2/referrals/abc', {
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
      draftApppointmentId: 'd1',
      referralNumber: 'r1',
      slotId: 's1',
      networkId: 'n1',
      providerServiceId: 'p1',
    };
    const expectedBody = JSON.stringify({
      id: 'd1',
      referralNumber: 'r1',
      slotId: 's1',
      networkId: 'n1',
      providerServiceId: 'p1',
    });

    requestStub.resolves({ data: { success: true } });

    const result = await services.postReferralAppointment(input);

    expect(
      requestStub.calledWith('/vaos/v2/appointments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expectedBody,
      }),
    ).to.be.true;

    expect(result).to.deep.equal({ success: true });
  });

  it('getAppointmentInfo calls the correct endpoint and returns data', async () => {
    requestStub.resolves({ data: { appointment: { id: 'a1' } } });

    const result = await services.getAppointmentInfo('a1');

    expect(
      requestStub.calledWith('/vaos/v2/eps_appointments/a1', {
        method: 'GET',
      }),
    ).to.be.true;

    expect(result).to.deep.equal({ appointment: { id: 'a1' } });
  });
});
