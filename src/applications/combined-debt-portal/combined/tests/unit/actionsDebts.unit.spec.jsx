import { expect } from 'chai';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';
import * as apiModule from 'platform/utilities/api';
import * as environmentModule from 'platform/utilities/environment';
import * as recordEventModule from 'platform/monitoring/record-event';
import {
  DEBTS_FETCH_INITIATED,
  DEBTS_FETCH_SUCCESS,
  DEBTS_FETCH_FAILURE,
  DEBTS_SET_ACTIVE_DEBT,
  DEBT_LETTERS_FETCH_INITIATED,
  DEBT_LETTERS_FETCH_SUCCESS,
  DEBT_LETTERS_FETCH_FAILURE,
  fetchDebtLetters,
  fetchDebtLettersVBMS,
  setActiveDebt,
} from '../../actions/debts';

describe('debts actions', () => {
  let sandbox;
  let dispatch;
  let apiRequestStub;
  let recordEventStub;
  let sentryCaptureMessageStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    dispatch = sandbox.spy();
    apiRequestStub = sandbox.stub(apiModule, 'apiRequest');
    recordEventStub = sandbox.stub(recordEventModule, 'default');
    sentryCaptureMessageStub = sandbox.stub(Sentry, 'captureMessage');
    sandbox
      .stub(Sentry, 'withScope')
      .callsFake(cb => cb({ setExtra: sandbox.stub() }));
    sandbox
      .stub(environmentModule, 'default')
      .value({ API_URL: 'http://api.example.com' });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('fetchDebtLetters', () => {
    it('should dispatch DEBTS_FETCH_INITIATED and DEBTS_FETCH_SUCCESS on successful fetch', async () => {
      const fakeResponse = {
        debts: [
          { deductionCode: '30', currentAr: 100 },
          { deductionCode: '44', currentAr: 200 },
        ],
        hasDependentDebts: false,
      };
      apiRequestStub.resolves(fakeResponse);

      await fetchDebtLetters(dispatch, true);

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: DEBTS_FETCH_INITIATED,
      });
      expect(dispatch.lastCall.args[0]).to.deep.equal({
        type: DEBTS_FETCH_SUCCESS,
        debts: fakeResponse.debts,
        hasDependentDebts: false,
      });
      expect(
        recordEventStub.calledWith({
          event: 'bam-get-veteran-dmc-info-successful',
          'veteran-has-dependent-debt': false,
        }),
      ).to.be.true;
      expect(
        recordEventStub.calledWith({
          event: 'bam-cards-retrieved',
          'number-of-current-debt-cards': 2,
        }),
      ).to.be.true;
    });

    it('should dispatch DEBTS_FETCH_FAILURE on fetch error', async () => {
      const error = new Error('API Error');
      apiRequestStub.rejects(error);

      await fetchDebtLetters(dispatch, true);

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: DEBTS_FETCH_INITIATED,
      });
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: DEBTS_FETCH_FAILURE,
        errors: undefined,
      });
      expect(
        recordEventStub.calledWith({
          event: 'bam-get-veteran-dmc-info-failed',
        }),
      ).to.be.true;
      expect(sentryCaptureMessageStub.calledOnce).to.be.true;
    });

    it('should not fetch VBMS debt letters if hasDependentDebts is true', async () => {
      const fakeResponse = {
        debts: [{ deductionCode: '30', currentAr: 100 }],
        hasDependentDebts: true,
      };
      apiRequestStub.resolves(fakeResponse);

      await fetchDebtLetters(dispatch, true);

      expect(dispatch.calledTwice).to.be.true; // Only INITIATED and SUCCESS, no VBMS fetch
    });

    it('should handle 500 server errors', async () => {
      const serverError = {
        status: 500,
        detail: 'Internal server error',
      };
      apiRequestStub.rejects({ errors: [serverError] });

      await fetchDebtLetters(dispatch, true);

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: DEBTS_FETCH_INITIATED,
      });
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: DEBTS_FETCH_FAILURE,
        errors: [serverError],
      });
      expect(sentryCaptureMessageStub.calledOnce).to.be.true;
    });

    it('should handle 403 forbidden errors', async () => {
      const forbiddenError = {
        status: 403,
        detail: 'Forbidden - insufficient permissions',
      };
      apiRequestStub.rejects({ errors: [forbiddenError] });

      await fetchDebtLetters(dispatch, true);

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: DEBTS_FETCH_INITIATED,
      });
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: DEBTS_FETCH_FAILURE,
        errors: [forbiddenError],
      });
      expect(sentryCaptureMessageStub.calledOnce).to.be.true;
    });

    it('should handle 404 not found errors', async () => {
      const notFoundError = {
        status: 404,
        detail: 'Resource not found',
      };
      apiRequestStub.rejects({ errors: [notFoundError] });

      await fetchDebtLetters(dispatch, true);

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: DEBTS_FETCH_INITIATED,
      });
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: DEBTS_FETCH_FAILURE,
        errors: [notFoundError],
      });
      expect(sentryCaptureMessageStub.calledOnce).to.be.true;
    });

    it('should handle 401 unauthorized errors', async () => {
      const unauthorizedError = {
        status: 401,
        detail: 'Unauthorized - authentication required',
      };
      apiRequestStub.rejects({ errors: [unauthorizedError] });

      await fetchDebtLetters(dispatch, true);

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: DEBTS_FETCH_INITIATED,
      });
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: DEBTS_FETCH_FAILURE,
        errors: [unauthorizedError],
      });
      expect(sentryCaptureMessageStub.calledOnce).to.be.true;
    });

    it('should handle 503 service unavailable errors', async () => {
      const serviceUnavailableError = {
        status: 503,
        detail: 'Service temporarily unavailable',
      };
      apiRequestStub.rejects({ errors: [serviceUnavailableError] });

      await fetchDebtLetters(dispatch, true);

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: DEBTS_FETCH_INITIATED,
      });
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: DEBTS_FETCH_FAILURE,
        errors: [serviceUnavailableError],
      });
      expect(sentryCaptureMessageStub.calledOnce).to.be.true;
    });
  });

  describe('fetchDebtLettersVBMS', () => {
    it('should dispatch DEBT_LETTERS_FETCH_INITIATED and DEBT_LETTERS_FETCH_SUCCESS on successful fetch', async () => {
      const fakeResponse = [
        { typeDescription: 'DMC - Letter 1', receivedAt: '2021-01-01' },
        { typeDescription: 'Letter 2', receivedAt: '2021-01-02' },
      ];
      apiRequestStub.resolves(fakeResponse);

      await fetchDebtLettersVBMS()(dispatch);

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: DEBT_LETTERS_FETCH_INITIATED,
      });
      const secondCallArgs = dispatch.secondCall.args[0];
      expect(secondCallArgs.type).to.equal(DEBT_LETTERS_FETCH_SUCCESS);
      expect(secondCallArgs.debtLinks).to.have.lengthOf(2);
      expect(secondCallArgs.debtLinks[0]).to.include({
        typeDescription: 'Letter 1',
        receivedAt: '2021-01-01',
      });
      expect(secondCallArgs.debtLinks[0].date).to.be.an.instanceOf(Date);
      expect(secondCallArgs.debtLinks[1]).to.deep.equal({
        typeDescription: 'Letter 2',
        receivedAt: '2021-01-02',
      });
    });

    it('should dispatch DEBT_LETTERS_FETCH_FAILURE on fetch error', async () => {
      const error = new Error('API Error');
      apiRequestStub.rejects(error);

      await fetchDebtLettersVBMS()(dispatch);

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: DEBT_LETTERS_FETCH_INITIATED,
      });
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: DEBT_LETTERS_FETCH_FAILURE,
      });
      expect(
        recordEventStub.calledWith({
          event: 'bam-get-veteran-vbms-info-failed',
        }),
      ).to.be.true;
      expect(sentryCaptureMessageStub.calledOnce).to.be.true;
    });
  });

  describe('setActiveDebt', () => {
    it('should create an action to set the active debt', () => {
      const debt = { id: 1, amount: 100 };
      const expectedAction = {
        type: DEBTS_SET_ACTIVE_DEBT,
        debt,
      };
      expect(setActiveDebt(debt)).to.deep.equal(expectedAction);
    });
  });

  it('should handle 500 server errors', async () => {
    const error = { status: 500, detail: 'Internal server error' };
    apiRequestStub.rejects(error);

    await fetchDebtLettersVBMS()(dispatch);

    expect(dispatch.firstCall.args[0]).to.deep.equal({
      type: DEBT_LETTERS_FETCH_INITIATED,
    });
    expect(dispatch.secondCall.args[0]).to.deep.equal({
      type: DEBT_LETTERS_FETCH_FAILURE,
    });
    expect(sentryCaptureMessageStub.calledOnce).to.be.true;
  });

  it('should handle 403 forbidden errors', async () => {
    const error = {
      status: 403,
      detail: 'Forbidden - insufficient permissions',
    };
    apiRequestStub.rejects(error);

    await fetchDebtLettersVBMS()(dispatch);

    expect(dispatch.firstCall.args[0]).to.deep.equal({
      type: DEBT_LETTERS_FETCH_INITIATED,
    });
    expect(dispatch.secondCall.args[0]).to.deep.equal({
      type: DEBT_LETTERS_FETCH_FAILURE,
    });
    expect(sentryCaptureMessageStub.calledOnce).to.be.true;
  });

  it('should handle 404 not found errors', async () => {
    const error = { status: 404, detail: 'Resource not found' };
    apiRequestStub.rejects(error);

    await fetchDebtLettersVBMS()(dispatch);

    expect(dispatch.firstCall.args[0]).to.deep.equal({
      type: DEBT_LETTERS_FETCH_INITIATED,
    });
    expect(dispatch.secondCall.args[0]).to.deep.equal({
      type: DEBT_LETTERS_FETCH_FAILURE,
    });
    expect(sentryCaptureMessageStub.calledOnce).to.be.true;
  });

  it('should handle 401 unauthorized errors', async () => {
    const error = {
      status: 401,
      detail: 'Unauthorized - authentication required',
    };
    apiRequestStub.rejects(error);

    await fetchDebtLettersVBMS()(dispatch);

    expect(dispatch.firstCall.args[0]).to.deep.equal({
      type: DEBT_LETTERS_FETCH_INITIATED,
    });
    expect(dispatch.secondCall.args[0]).to.deep.equal({
      type: DEBT_LETTERS_FETCH_FAILURE,
    });
    expect(sentryCaptureMessageStub.calledOnce).to.be.true;
  });

  it('should handle 503 service unavailable errors', async () => {
    const error = { status: 503, detail: 'Service temporarily unavailable' };
    apiRequestStub.rejects(error);

    await fetchDebtLettersVBMS()(dispatch);

    expect(dispatch.firstCall.args[0]).to.deep.equal({
      type: DEBT_LETTERS_FETCH_INITIATED,
    });
    expect(dispatch.secondCall.args[0]).to.deep.equal({
      type: DEBT_LETTERS_FETCH_FAILURE,
    });
    expect(sentryCaptureMessageStub.calledOnce).to.be.true;
  });
});
