import { expect } from 'chai';
import sinon from 'sinon';
import * as apiModule from '~/platform/utilities/api';
import * as recordEventModule from '~/platform/monitoring/record-event';
import environment from '~/platform/utilities/environment';

import {
  fetchDebts,
  fetchCopays,
  DEBTS_FETCH_INITIATED,
  DEBTS_FETCH_SUCCESS,
  DEBTS_FETCH_FAILURE,
  COPAYS_FETCH_INITIATED,
  COPAYS_FETCH_SUCCESS,
  COPAYS_FETCH_FAILURE,
} from '../../actions/debts';

describe('/actions/debts', () => {
  let apiRequestStub;
  let recordEventStub;
  let dispatchSpy;
  let oldAppName;

  beforeEach(() => {
    apiRequestStub = sinon.stub(apiModule, 'apiRequest');
    recordEventStub = sinon.stub(recordEventModule, 'default');
    dispatchSpy = sinon.spy();
    oldAppName = global.window.appName;
    global.window.appName = 'test-app';
  });

  afterEach(() => {
    apiRequestStub.restore();
    recordEventStub.restore();
    global.window.appName = oldAppName;
  });

  describe('fetchDebts', () => {
    it('should dispatch DEBTS_FETCH_INITIATED action', () => {
      apiRequestStub.resolves({ debts: [] });
      fetchDebts()(dispatchSpy);
      expect(dispatchSpy.firstCall.args[0].type).to.equal(
        DEBTS_FETCH_INITIATED,
      );
    });

    it('should call apiRequest with query parameter when debtsCount is true', async () => {
      apiRequestStub.resolves({ debtsCount: 5 });
      await fetchDebts(true)(dispatchSpy);
      expect(apiRequestStub.calledOnce).to.be.true;
      expect(apiRequestStub.firstCall.args[0]).to.equal(
        `${environment.API_URL}/v0/debts?countOnly=true`,
      );
    });

    it('should call apiRequest without query parameter when debtsCount is false', async () => {
      apiRequestStub.resolves({ debts: [] });
      await fetchDebts(false)(dispatchSpy);
      expect(apiRequestStub.calledOnce).to.be.true;
      expect(apiRequestStub.firstCall.args[0]).to.equal(
        `${environment.API_URL}/v0/debts`,
      );
    });

    it('should call apiRequest without query parameter when debtsCount is not provided (defaults to false)', async () => {
      apiRequestStub.resolves({ debts: [] });
      await fetchDebts()(dispatchSpy);
      expect(apiRequestStub.calledOnce).to.be.true;
      expect(apiRequestStub.firstCall.args[0]).to.equal(
        `${environment.API_URL}/v0/debts`,
      );
    });

    it('should dispatch DEBTS_FETCH_FAILURE when response contains errors', async () => {
      const errors = [{ code: '500', detail: 'Server error' }];
      apiRequestStub.resolves({ errors });
      await fetchDebts()(dispatchSpy);

      expect(dispatchSpy.callCount).to.equal(2);
      expect(dispatchSpy.secondCall.args[0].type).to.equal(DEBTS_FETCH_FAILURE);
      expect(dispatchSpy.secondCall.args[0].errors).to.deep.equal(errors);
      expect(recordEventStub.calledOnce).to.be.true;
      expect(recordEventStub.firstCall.args[0]).to.deep.equal({
        event: 'api_call',
        'error-key': 'server error',
        'api-name': 'GET debts',
        'api-status': 'failed',
      });
    });

    it('should dispatch DEBTS_FETCH_SUCCESS with debtsCount when debtsCount is true and response has debtsCount', async () => {
      const debtsCount = 10;
      apiRequestStub.resolves({ debtsCount });
      await fetchDebts(true)(dispatchSpy);

      expect(dispatchSpy.callCount).to.equal(2);
      expect(dispatchSpy.secondCall.args[0].type).to.equal(DEBTS_FETCH_SUCCESS);
      expect(dispatchSpy.secondCall.args[0].debts).to.deep.equal([]);
      expect(dispatchSpy.secondCall.args[0].debtsCount).to.equal(debtsCount);
      expect(recordEventStub.calledOnce).to.be.true;
      expect(recordEventStub.firstCall.args[0]).to.deep.equal({
        event: 'api_call',
        'api-name': 'GET debts',
        'api-status': 'successful',
      });
    });

    it('should dispatch DEBTS_FETCH_SUCCESS with filtered debts when debtsCount is false', async () => {
      const debts = [
        { id: 'debt1', amount: 100 },
        { id: 'debt2', amount: 200 },
      ];
      apiRequestStub.resolves({ debts });
      await fetchDebts(false)(dispatchSpy);

      expect(dispatchSpy.callCount).to.equal(2);
      expect(dispatchSpy.secondCall.args[0].type).to.equal(DEBTS_FETCH_SUCCESS);
      expect(dispatchSpy.secondCall.args[0].debts).to.deep.equal([
        { id: 0, amount: 100 },
        { id: 1, amount: 200 },
      ]);
      expect(recordEventStub.calledOnce).to.be.true;
      expect(recordEventStub.firstCall.args[0]).to.deep.equal({
        event: 'api_call',
        'api-name': 'GET debts',
        'api-status': 'successful',
      });
    });

    it('should dispatch DEBTS_FETCH_FAILURE in catch block when apiRequest throws an error', async () => {
      const error = new Error('Network error');
      apiRequestStub.rejects(error);
      await fetchDebts()(dispatchSpy);

      expect(dispatchSpy.callCount).to.equal(2);
      expect(dispatchSpy.secondCall.args[0].type).to.equal(DEBTS_FETCH_FAILURE);
      expect(dispatchSpy.secondCall.args[0].errors).to.deep.equal([error]);
      expect(recordEventStub.calledOnce).to.be.true;
      expect(recordEventStub.firstCall.args[0]).to.deep.equal({
        event: 'api_call',
        'error-key': 'internal error',
        'api-name': 'GET debts',
        'api-status': 'failed',
      });
    });

    it('should pass correct headers and options to apiRequest', async () => {
      apiRequestStub.resolves({ debts: [] });
      await fetchDebts()(dispatchSpy);

      expect(apiRequestStub.calledOnce).to.be.true;
      const options = apiRequestStub.firstCall.args[1];
      expect(options.method).to.equal('GET');
      expect(options.credentials).to.equal('include');
      expect(options.headers['Content-Type']).to.equal('application/json');
      expect(options.headers['X-Key-Inflection']).to.equal('camel');
      expect(options.headers['Source-App-Name']).to.equal('test-app');
    });
  });

  describe('fetchCopays', () => {
    it('should dispatch COPAYS_FETCH_INITIATED action', () => {
      apiRequestStub.resolves({ data: [] });
      fetchCopays()(dispatchSpy);
      expect(dispatchSpy.firstCall.args[0].type).to.equal(
        COPAYS_FETCH_INITIATED,
      );
    });

    it('should dispatch COPAYS_FETCH_FAILURE when response contains errors', async () => {
      const errors = [{ code: '500', detail: 'Server error' }];
      apiRequestStub.resolves({ errors });
      await fetchCopays()(dispatchSpy);

      expect(dispatchSpy.callCount).to.equal(2);
      expect(dispatchSpy.secondCall.args[0].type).to.equal(
        COPAYS_FETCH_FAILURE,
      );
      expect(dispatchSpy.secondCall.args[0].errors).to.deep.equal(errors);
      expect(recordEventStub.calledOnce).to.be.true;
      expect(recordEventStub.firstCall.args[0]).to.deep.equal({
        event: 'api_call',
        'error-key': 'server error',
        'api-name': 'GET copays',
        'api-status': 'failed',
      });
    });

    it('should handle null data using nullish coalescing operator', async () => {
      apiRequestStub.resolves({ data: null });
      await fetchCopays()(dispatchSpy);

      expect(dispatchSpy.callCount).to.equal(2);
      expect(dispatchSpy.secondCall.args[0].type).to.equal(
        COPAYS_FETCH_SUCCESS,
      );
      expect(dispatchSpy.secondCall.args[0].copays).to.deep.equal([]);
    });

    it('should handle undefined data using nullish coalescing operator', async () => {
      apiRequestStub.resolves({ data: undefined });
      await fetchCopays()(dispatchSpy);

      expect(dispatchSpy.callCount).to.equal(2);
      expect(dispatchSpy.secondCall.args[0].type).to.equal(
        COPAYS_FETCH_SUCCESS,
      );
      expect(dispatchSpy.secondCall.args[0].copays).to.deep.equal([]);
    });

    it('should filter statements where pHAmtDue > 0', async () => {
      const statements = [
        {
          pSFacilityNum: '123',
          pSStatementDateOutput: '01/15/2024',
          pHAmtDue: 100,
        },
        {
          pSFacilityNum: '456',
          pSStatementDateOutput: '03/15/2024',
          pHAmtDue: 50,
        },
        {
          pSFacilityNum: '789',
          pSStatementDateOutput: '04/15/2024',
          pHAmtDue: -10,
        },
        {
          pSFacilityNum: '999',
          pSStatementDateOutput: '02/15/2024',
          pHAmtDue: 0,
        },
      ];
      apiRequestStub.resolves({ data: statements });
      await fetchCopays()(dispatchSpy);

      expect(dispatchSpy.callCount).to.equal(2);
      expect(dispatchSpy.secondCall.args[0].type).to.equal(
        COPAYS_FETCH_SUCCESS,
      );
      // Should filter out items where pHAmtDue <= 0
      // After sorting by date (descending): 04/15, 03/15, 02/15, 01/15
      // After filtering pHAmtDue > 0: only 04/15 (789, -10) and 02/15 (999, 0) are removed
      // So we should have: 03/15 (456, 50) and 01/15 (123, 100)
      const { copays } = dispatchSpy.secondCall.args[0];
      expect(copays.length).to.equal(2);
      // After sorting descending, 03/15 comes before 01/15
      expect(copays[0].pHAmtDue).to.equal(50);
      expect(copays[1].pHAmtDue).to.equal(100);
      expect(recordEventStub.calledOnce).to.be.true;
      expect(recordEventStub.firstCall.args[0]).to.deep.equal({
        event: 'api_call',
        'api-name': 'GET copays',
        'api-status': 'successful',
      });
    });

    it('should use uniqBy to filter statements by pSFacilityNum', async () => {
      const statements = [
        {
          pSFacilityNum: '123',
          pSStatementDateOutput: '01/15/2024',
          pHAmtDue: 100,
        },
        {
          pSFacilityNum: '123',
          pSStatementDateOutput: '02/15/2024',
          pHAmtDue: 200,
        },
        {
          pSFacilityNum: '456',
          pSStatementDateOutput: '03/15/2024',
          pHAmtDue: 50,
        },
      ];
      apiRequestStub.resolves({ data: statements });
      await fetchCopays()(dispatchSpy);

      expect(dispatchSpy.callCount).to.equal(2);
      const { copays } = dispatchSpy.secondCall.args[0];
      // After sorting by date (descending): 03/15 (456), 02/15 (123), 01/15 (123) - removed by uniqBy
      // uniqBy keeps the first occurrence after sorting, so 02/15 (123) is kept, 01/15 (123) is removed
      // So the order after sorting and uniqBy is: 03/15 (456), 02/15 (123)
      const facilityNums = copays.map(c => c.pSFacilityNum);
      expect(facilityNums).to.deep.equal(['456', '123']);
    });

    it('should sort statements by date using sortStatementsByDate', async () => {
      const statements = [
        {
          pSFacilityNum: '123',
          pSStatementDateOutput: '03/15/2024',
          pHAmtDue: 100,
        },
        {
          pSFacilityNum: '456',
          pSStatementDateOutput: '01/15/2024',
          pHAmtDue: 50,
        },
        {
          pSFacilityNum: '789',
          pSStatementDateOutput: '02/15/2024',
          pHAmtDue: 75,
        },
      ];
      apiRequestStub.resolves({ data: statements });
      await fetchCopays()(dispatchSpy);

      expect(dispatchSpy.callCount).to.equal(2);
      const { copays } = dispatchSpy.secondCall.args[0];
      // Should be sorted by date descending (newest first)
      expect(copays[0].pSStatementDateOutput).to.equal('03/15/2024');
      expect(copays[1].pSStatementDateOutput).to.equal('02/15/2024');
      expect(copays[2].pSStatementDateOutput).to.equal('01/15/2024');
    });

    it('should dispatch COPAYS_FETCH_FAILURE in catch block when apiRequest throws an error', async () => {
      const error = new Error('Network error');
      apiRequestStub.rejects(error);
      await fetchCopays()(dispatchSpy);

      expect(dispatchSpy.callCount).to.equal(2);
      expect(dispatchSpy.secondCall.args[0].type).to.equal(
        COPAYS_FETCH_FAILURE,
      );
      expect(dispatchSpy.secondCall.args[0].errors).to.deep.equal([error]);
      expect(recordEventStub.calledOnce).to.be.true;
      expect(recordEventStub.firstCall.args[0]).to.deep.equal({
        event: 'api_call',
        'error-key': 'internal error',
        'api-name': 'GET copays',
        'api-status': 'failed',
      });
    });

    it('should pass correct headers and options to apiRequest', async () => {
      apiRequestStub.resolves({ data: [] });
      await fetchCopays()(dispatchSpy);

      expect(apiRequestStub.calledOnce).to.be.true;
      expect(apiRequestStub.firstCall.args[0]).to.equal(
        `${environment.API_URL}/v0/medical_copays`,
      );
      const options = apiRequestStub.firstCall.args[1];
      expect(options.method).to.equal('GET');
      expect(options.credentials).to.equal('include');
      expect(options.headers['Content-Type']).to.equal('application/json');
      expect(options.headers['X-Key-Inflection']).to.equal('camel');
      expect(options.headers['Source-App-Name']).to.equal('test-app');
    });
  });
});
