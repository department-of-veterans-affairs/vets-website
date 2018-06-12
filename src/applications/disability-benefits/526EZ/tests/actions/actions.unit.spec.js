import { expect } from 'chai';
import sinon from 'sinon';

import { mockFetch, resetFetch } from '../../../../../platform/testing/unit/helpers.js';

import {
  PRESTART_STATUS_SET,
  PRESTART_STATUS_RESET,
  PRESTART_DISPLAY_RESET,
  PRESTART_STATUSES,
  setPrestartStatus,
  resetPrestartStatus,
  resetPrestartDisplay,
  checkITFRequest,
  submitITFRequest,
  verifyIntentToFile
} from '../../actions';

function setFetchResponse(stub, data) {
  const response = {};
  response.ok = true;
  response.data = data;
  response.headers = {
    get: () => 'application/json' // for use by isJson in apiRequest
  };
  response.json = () => Promise.resolve(data);
  stub.resolves(response);
}

import existingData from '../itfData';

const noData = {
  id: '',
  type: 'evss_intent_to_file_intent_to_files_responses',
  attributes: {
    intentToFile: null
  }
};
const expiredData = {
  id: '',
  type: 'evss_intent_to_file_intent_to_files_responses',
  attributes: {
    intentToFile: [
      {
        id: '2510',
        creationDate: '2015-03-30T16:19:09.000+00:00',
        expirationDate: '2016-03-30T16:19:09.000+00:00',
        participantId: 600043186,
        source: 'EBN',
        status: 'expired',
        type: 'compensation'
      }
    ]
  }
};
const createdData = {
  id: '',
  type: 'evss_intent_to_file_intent_to_files_responses',
  attributes: {
    intentToFile: {
      id: '166837',
      creationDate: '2018-04-10T15:12:36.000+00:00',
      expirationDate: '2019-04-10T15:12:34.000+00:00',
      participantId: 600043186,
      source: 'EBN',
      status: 'active',
      type: 'compensation'
    }
  }
};

describe('ITF retrieve / submit actions:', () => {
  describe('setPrestartStatus', () => {
    it('should return action', () => {
      const status = PRESTART_STATUSES.retrieved;
      const data = '2019-04-10T15:12:34.000+00:00';
      const action = setPrestartStatus(status, data);

      expect(action.type).to.equal(PRESTART_STATUS_SET);
      expect(action.status).to.equal(status);
      expect(action.data).to.equal('2019-04-10T15:12:34.000+00:00');
    });
  });
  describe('resetPrestartStatus', () => {
    it('should unset status', () => {
      const action = resetPrestartStatus();

      expect(action.type).to.equal(PRESTART_STATUS_RESET);
    });
  });
  describe('resetPrestartDisplay', () => {
    it('should unset display', () => {
      const action = resetPrestartDisplay();

      expect(action.type).to.equal(PRESTART_DISPLAY_RESET);
    });
  });
  describe('checkITFRequest', () => {
    afterEach(() => resetFetch());
    it('should return "retrieved" ITF status and data with an existing ITF', (done) => {
      const dispatch = sinon.spy();
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: existingData
      });
      const thunk = checkITFRequest;
      thunk(dispatch).then((result) => {
        expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.retrieved, '2019-04-10T15:12:34.000+00:00'))).to.be.true;
        expect(result).to.equal(PRESTART_STATUSES.retrieved);
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('should return "none" ITF status and data without an existing ITF', (done) => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: noData
      });
      const dispatch = sinon.spy();

      const thunk = checkITFRequest;

      thunk(dispatch).then((result) => {
        expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.none))).to.be.true;
        expect(result).to.equal(PRESTART_STATUSES.none);
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('should return "expired" ITF status and data with an expired ITF', (done) => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: expiredData
      });
      const dispatch = sinon.spy();

      const thunk = checkITFRequest;

      thunk(dispatch).then((result) => {
        expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.expired, '2016-03-30T16:19:09.000+00:00'))).to.be.true;
        expect(result).to.equal(PRESTART_STATUSES.expired);
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('should return "notRetrievedSaved" ITF status when request fails for users resuming an existing form', (done) => {
      mockFetch(new Error('No network connection'), false);
      const dispatch = sinon.spy();
      const hasSavedForm = true;
      const thunk = checkITFRequest;

      thunk(dispatch, hasSavedForm).then((result) => {
        expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.notRetrievedSaved))).to.be.true;
        expect(result).to.equal(PRESTART_STATUSES.notRetrievedSaved);
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('should return "notRetrievedNew" ITF status when request fails for users starting new forms', (done) => {
      mockFetch(new Error('No network connection'), false);
      const dispatch = sinon.spy();
      const hasSavedForm = false;
      const thunk = checkITFRequest;

      thunk(dispatch, hasSavedForm).then((result) => {
        expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.notRetrievedNew))).to.be.true;
        expect(result).to.equal(PRESTART_STATUSES.notRetrievedNew);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
  describe('submitITFRequest', () => {
    afterEach(() => resetFetch());
    it('should return "created" ITF status and data with a successful ITF submission', (done) => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: createdData
      });
      const dispatch = sinon.spy();
      const thunk = submitITFRequest;

      thunk(dispatch, PRESTART_STATUSES.created, PRESTART_STATUSES.notCreated).then((result) => {
        expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.created, '2019-04-10T15:12:34.000+00:00'))).to.be.true;
        expect(result).to.equal(PRESTART_STATUSES.created);
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('should return "notCreated" ITF status and with a failed ITF submission', (done) => {
      mockFetch(new Error('No network connection'), false);
      const dispatch = sinon.spy();
      const thunk = submitITFRequest;

      thunk(dispatch, PRESTART_STATUSES.renewed, PRESTART_STATUSES.notRenewed).then((result) => {
        expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.notRenewed))).to.be.true;
        expect(result).to.equal(PRESTART_STATUSES.notRenewed);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
  describe('verifyIntentToFile', () => {
    afterEach(() => resetFetch());

    it('dispatches a pending', (done) => {
      mockFetch();
      const thunk = verifyIntentToFile();
      const dispatch = sinon.spy();

      thunk(dispatch).then(() => {
        expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.pending))).to.be.true;
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('returns true on "received" status', (done) => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: existingData
      });
      const thunk = verifyIntentToFile();
      const dispatch = sinon.spy();

      thunk(dispatch).then((result) => {
        expect(result).to.be.true;
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('returns false on error', (done) => {
      mockFetch(new Error('No network connection'), false);
      const thunk = verifyIntentToFile();
      const dispatch = sinon.spy();

      thunk(dispatch).then((result) => {
        expect(result).to.be.false;
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('returns true on "renewed" status', (done) => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: expiredData
      });
      setFetchResponse(global.fetch.onSecondCall(), {
        data: createdData
      });
      const thunk = verifyIntentToFile();
      const dispatch = sinon.spy();

      thunk(dispatch).then((result) => {
        expect(result).to.be.true;
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('returns false on error', (done) => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: expiredData
      });
      setFetchResponse(global.fetch.onSecondCall(), new Error('fake error'), false);
      const hasSavedForm = true;
      const thunk = verifyIntentToFile(hasSavedForm);
      const dispatch = sinon.spy();

      thunk(dispatch).then((result) => {
        expect(result).to.be.false;
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
});

