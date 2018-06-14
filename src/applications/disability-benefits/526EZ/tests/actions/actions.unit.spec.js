import { expect } from 'chai';
import sinon from 'sinon';

import { mockFetch, resetFetch } from '../../../../../platform/testing/unit/helpers.js';

import {
  PRESTART_STATUS_SET,
  PRESTART_DATA_SET,
  PRESTART_RESET,
  PRESTART_DISPLAY_RESET,
  PRESTART_STATUSES,
  setPrestartStatus,
  setPrestartData,
  resetPrestartStatus,
  resetPrestartDisplay,
  handleCheckSuccess,
  handleCheckFailure,
  handleSubmitSuccess,
  handleSubmitFailure,
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
const incompleteData = {
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
        status: 'incomplete',
        type: 'compensation'
      },
      {
        id: '2510',
        creationDate: '2015-03-30T16:19:09.000+00:00',
        expirationDate: '2016-03-30T16:19:09.000+00:00',
        participantId: 600043186,
        source: 'EBN',
        status: 'claim_recieved',
        type: 'compensation'
      }
    ]
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
      const action = setPrestartStatus(status);

      expect(action.type).to.equal(PRESTART_STATUS_SET);
      expect(action.status).to.equal(status);
    });
  });
  describe('setPrestartData', () => {
    it('should return action', () => {
      const data = '2019-04-10T15:12:34.000+00:00';
      const action = setPrestartData(data);

      expect(action.type).to.equal(PRESTART_DATA_SET);
      expect(action.data).to.equal('2019-04-10T15:12:34.000+00:00');
    });
  });
  describe('resetPrestart', () => {
    it('should return action', () => {
      const action = resetPrestartStatus();

      expect(action.type).to.equal(PRESTART_RESET);
    });
  });
  describe('resetPrestartDisplay', () => {
    it('should return action', () => {
      const action = resetPrestartDisplay();

      expect(action.type).to.equal(PRESTART_DISPLAY_RESET);
    });
  });
  describe('handleCheckSuccess', () => {
    it('should return none if no existing ITFs are retrieved', () => {
      const dispatch = sinon.spy();

      expect(handleCheckSuccess(noData, dispatch)).to.equal(PRESTART_STATUSES.none);
    });
    it('should return none if no expired or active ITFs are retrieved', () => {
      const dispatch = sinon.spy();

      expect(handleCheckSuccess(incompleteData, dispatch)).to.equal(PRESTART_STATUSES.none);
    });
    it('should return expired if retrieved ITFs include expired but not active ITFs', () => {
      const dispatch = sinon.spy();

      expect(handleCheckSuccess(expiredData, dispatch)).to.equal(PRESTART_STATUSES.expired);
      expect(dispatch.args[0][0]).to.deep.equal(setPrestartData({ previousExpirationDate: '2016-03-30T16:19:09.000+00:00' }));
    });
    it('should return retrieved if active ITFs are retrieved', () => {
      const dispatch = sinon.spy();

      expect(handleCheckSuccess(existingData, dispatch)).to.equal(PRESTART_STATUSES.retrieved);
      expect(dispatch.args[0][0]).to.deep.equal(setPrestartData({ currentExpirationDate: '2019-04-10T15:12:34.000+00:00' }));
    });
  });
  describe('handleCheckFailure', () => {
    it('should return notRetrievedNew if check fails for a new form', () => {
      const dispatch = sinon.spy();

      expect(handleCheckFailure(new Error('fake error'), false, dispatch)).to.equal(PRESTART_STATUSES.notRetrievedNew);
    });
    it('should return notRetrievedSaved if check fails for a saved form', () => {
      const dispatch = sinon.spy();

      expect(handleCheckFailure(new Error('fake error'), true, dispatch)).to.equal(PRESTART_STATUSES.notRetrievedSaved);
    });
  });
  describe('handleSubmitSuccess', () => {
    it('should dispatch successStatus and prestartData', () => {
      const dispatch = sinon.spy();

      handleSubmitSuccess(createdData, PRESTART_STATUSES.created, dispatch);
      expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.created))).to.be.true;
      expect(dispatch.args[0][0]).to.deep.equal(setPrestartData({ currentExpirationDate: '2019-04-10T15:12:34.000+00:00' }));
    });
  });
  describe('handleSubmitFailure', () => {
    it('should dispatch errorStatus', () => {
      const dispatch = sinon.spy();

      handleSubmitFailure(createdData, PRESTART_STATUSES.notCreated, dispatch);
      expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.notCreated))).to.be.true;
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
        expect(dispatch.calledWith(setPrestartData({ currentExpirationDate: '2019-04-10T15:12:34.000+00:00' }))).to.be.true;
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
        expect(dispatch.calledWith(setPrestartData({ previousExpirationDate: '2016-03-30T16:19:09.000+00:00' }))).to.be.true;
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
        expect(result).to.equal(PRESTART_STATUSES.notRetrievedNew);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
  describe('submitITFRequest', () => {
    afterEach(() => resetFetch());
    it('should dispatch "created" ITF status and data with a successful ITF submission', (done) => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: createdData
      });
      const dispatch = sinon.spy();
      const thunk = submitITFRequest;

      thunk(dispatch, PRESTART_STATUSES.created, PRESTART_STATUSES.notCreated).then(() => {
        expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.created, '2019-04-10T15:12:34.000+00:00'))).to.be.true;
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('should dispatch "notCreated" ITF status and with a failed ITF submission', (done) => {
      mockFetch(new Error('No network connection'), false);
      const dispatch = sinon.spy();
      const thunk = submitITFRequest;

      thunk(dispatch, PRESTART_STATUSES.renewed, PRESTART_STATUSES.notRenewed).then(() => {
        expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.notRenewed))).to.be.true;
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
        expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.notRetrievedNew))).to.be.true;

        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
});

