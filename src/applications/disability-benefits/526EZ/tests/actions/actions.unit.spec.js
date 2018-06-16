import { expect } from 'chai';
import sinon from 'sinon';

import { mockFetch, resetFetch } from '../../../../../platform/testing/unit/helpers.js';

import {
  PRESTART_STATUS_SET,
  PRESTART_MESSAGE_SET,
  PRESTART_DATA_SET,
  PRESTART_RESET,
  PRESTART_DISPLAY_RESET,
  PRESTART_STATUSES,
  PRESTART_MESSAGES,
  setPrestartStatus,
  setPrestartMessage,
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

function setFetchResponse(data) {
  const response = {};
  response.ok = true;
  response.data = data;
  response.headers = {
    get: () => 'application/json' // for use by isJson in apiRequest
  };
  response.json = () => Promise.resolve(data);
  mockFetch(response);
}


describe('ITF retrieve / submit actions:', () => {
  describe('setPrestartStatus', () => {
    it('should return action', () => {
      const status = PRESTART_STATUSES.succeeded;
      const action = setPrestartStatus(status);

      expect(action.type).to.equal(PRESTART_STATUS_SET);
      expect(action.status).to.equal(status);
    });
  });
  describe('setPrestartMessage', () => {
    it('should return action', () => {
      const message = PRESTART_MESSAGES.retrieved;
      const action = setPrestartMessage(message);

      expect(action.type).to.equal(PRESTART_MESSAGE_SET);
      expect(action.message).to.equal(message);
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

      expect(handleCheckSuccess(noData, dispatch)).to.equal(PRESTART_MESSAGES.none);
    });
    it('should return none if no expired or active ITFs are retrieved', () => {
      const dispatch = sinon.spy();

      expect(handleCheckSuccess(incompleteData, dispatch)).to.equal(PRESTART_MESSAGES.none);
    });
    it('should return expired if retrieved ITFs include expired but not active ITFs', () => {
      const dispatch = sinon.spy();

      expect(handleCheckSuccess(expiredData, dispatch)).to.equal(PRESTART_MESSAGES.expired);
      expect(dispatch.calledWith(setPrestartData({ previousExpirationDate: '2016-03-30T16:19:09.000+00:00' }))).to.be.true;
    });
    it('should return retrieved if active ITFs are retrieved', () => {
      const dispatch = sinon.spy();

      expect(handleCheckSuccess(existingData, dispatch)).to.equal(PRESTART_MESSAGES.retrieved);
      expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.succeeded))).to.be.true;
      expect(dispatch.calledWith(setPrestartData({ currentExpirationDate: '2019-04-10T15:12:34.000+00:00' }))).to.be.true;
    });
  });
  describe('handleCheckFailure', () => {
    it('should return notRetrievedNew if check fails for a new form', () => {
      const dispatch = sinon.spy();

      expect(handleCheckFailure(new Error('fake error'), false, dispatch)).to.equal(PRESTART_MESSAGES.notRetrievedNew);
      expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.failed))).to.be.true;
    });
    it('should return notRetrievedSaved if check fails for a saved form', () => {
      const dispatch = sinon.spy();

      expect(handleCheckFailure(new Error('fake error'), true, dispatch)).to.equal(PRESTART_MESSAGES.notRetrievedSaved);
      expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.failed))).to.be.true;
    });
  });
  describe('handleSubmitSuccess', () => {
    it('should dispatch status, message and prestartData', () => {
      const dispatch = sinon.spy();

      handleSubmitSuccess(createdData, PRESTART_MESSAGES.created, dispatch);
      expect(dispatch.calledWith(setPrestartMessage(PRESTART_MESSAGES.created))).to.be.true;
      expect(dispatch.calledWith(setPrestartData({ currentExpirationDate: '2019-04-10T15:12:34.000+00:00' }))).to.be.true;
      expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.succeeded))).to.be.true;
    });
  });
  describe('handleSubmitFailure', () => {
    it('should dispatch error status and message', () => {
      const dispatch = sinon.spy();

      handleSubmitFailure(createdData, PRESTART_MESSAGES.notCreated, dispatch);
      expect(dispatch.calledWith(setPrestartMessage(PRESTART_MESSAGES.notCreated))).to.be.true;
      expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.failed))).to.be.true;
    });
  });
  describe('checkITFRequest', () => {
    afterEach(() => resetFetch());
    it('should handle success', (done) => {
      const dispatch = sinon.spy();
      setFetchResponse({
        data: existingData
      });
      const thunk = checkITFRequest;
      const successMessage = PRESTART_MESSAGES.retrieved;
      thunk(dispatch).then((result) => {
        expect(dispatch.calledWith(setPrestartData({ currentExpirationDate: '2019-04-10T15:12:34.000+00:00' }))).to.be.true;
        expect(result).to.equal(successMessage);
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('should handle error', (done) => {
      mockFetch(new Error('No network connection'), false);
      const dispatch = sinon.spy();
      const hasSavedForm = true;
      const thunk = checkITFRequest;
      const errorMessage = PRESTART_MESSAGES.notRetrievedSaved;

      thunk(dispatch, hasSavedForm).then((result) => {
        expect(result).to.equal(errorMessage);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
  describe('submitITFRequest', () => {
    afterEach(() => resetFetch());
    it('should handle success', (done) => {
      setFetchResponse({
        data: createdData
      });
      const dispatch = sinon.spy();
      const thunk = submitITFRequest;
      const successMessage = PRESTART_MESSAGES.created;
      const errorMessage = PRESTART_MESSAGES.notCreated;
      thunk(dispatch, successMessage, errorMessage).then(() => {
        expect(dispatch.calledWith(setPrestartMessage(successMessage, '2019-04-10T15:12:34.000+00:00'))).to.be.true;
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('should handle error', (done) => {
      mockFetch(new Error('No network connection'), false);
      const dispatch = sinon.spy();
      const thunk = submitITFRequest;
      const successMessage = PRESTART_MESSAGES.renewed;
      const errorMessage = PRESTART_MESSAGES.notRenewed;

      thunk(dispatch, successMessage, errorMessage).then(() => {
        expect(dispatch.calledWith(setPrestartMessage(errorMessage))).to.be.true;
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
  });
});
