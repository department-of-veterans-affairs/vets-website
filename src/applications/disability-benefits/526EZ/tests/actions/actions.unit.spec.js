import { expect } from 'chai';
import sinon from 'sinon';

import { mockFetch, mockApiRequest, resetFetch } from '../../../../../platform/testing/unit/helpers.js';

import {
  getLatestTimestamp,
  getITFsByStatus,
  PRESTART_STATUS_SET,
  PRESTART_DATA_SET,
  PRESTART_STATE_RESET,
  PRESTART_DISPLAY_RESET,
  PRESTART_STATUSES,
  PRESTART_VERIFICATION_TYPES,
  ITF_STATUSES,
  setPrestartStatus,
  setPrestartData,
  resetPrestartState,
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
    intentToFile: []
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
  describe('getLatestTimestamp', () => {
    it('should return the most recent timestamp in a list of timestamps', () => {
      const timestamps = ['2015-03-30T16:19:09.000+00:00', '2016-03-30T16:19:09.000+00:00'];
      const latestTimestamp = getLatestTimestamp(timestamps);
      expect(latestTimestamp).to.equal('2016-03-30T16:19:09.000+00:00');
    });
  });
  describe('getITFsByStatus', () => {
    it('should return a list of ITFs filtered by a given status', () => {
      expect(getITFsByStatus(existingData.attributes.intentToFile, ITF_STATUSES.active).length).to.equal(1);
    });
  });
  describe('setPrestartStatus', () => {
    it('should return action', () => {
      const status = PRESTART_STATUSES.succeeded;
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
  describe('resetPrestartState', () => {
    it('should return action', () => {
      const action = resetPrestartState();

      expect(action.type).to.equal(PRESTART_STATE_RESET);
    });
  });
  describe('resetPrestartDisplay', () => {
    it('should return action', () => {
      const action = resetPrestartDisplay();

      expect(action.type).to.equal(PRESTART_DISPLAY_RESET);
    });
  });
  describe('handleCheckSuccess', () => {
    it('should return true if no existing ITFs are retrieved', () => {
      const dispatch = sinon.spy();

      expect(handleCheckSuccess(noData, dispatch)).to.be.true;
    });
    it('should return true if no expired or active ITFs are retrieved', () => {
      const dispatch = sinon.spy();

      expect(handleCheckSuccess(incompleteData, dispatch)).to.be.true;
    });
    it('should set previousExpirationDate and return true if retrieved ITFs include expired but not active ITFs', () => {
      const dispatch = sinon.spy();

      expect(handleCheckSuccess(expiredData, dispatch)).to.be.true;
      expect(dispatch.calledWith(setPrestartData({ previousExpirationDate: '2016-03-30T16:19:09.000+00:00' }))).to.be.true;
    });
    it('should set succeeded status and return false if active ITFs are retrieved', () => {
      const dispatch = sinon.spy();

      expect(handleCheckSuccess(existingData, dispatch)).to.be.false;
      expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.succeeded))).to.be.true;
      expect(dispatch.calledWith(setPrestartData({ currentExpirationDate: '2019-04-10T15:12:34.000+00:00' }))).to.be.true;
    });
  });
  describe('handleCheckFailure', () => {
    it('should set failed status and return false', () => {
      const dispatch = sinon.spy();

      expect(handleCheckFailure(dispatch)).to.be.false;
      expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.failed))).to.be.true;
    });
  });
  describe('handleSubmitSuccess', () => {
    it('should dispatch status and data', () => {
      const dispatch = sinon.spy();

      handleSubmitSuccess(createdData, dispatch);
      expect(dispatch.calledWith(setPrestartData({ currentExpirationDate: '2019-04-10T15:12:34.000+00:00' }))).to.be.true;
      expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.succeeded))).to.be.true;
    });
  });
  describe('handleSubmitFailure', () => {
    it('should dispatch error status', () => {
      const dispatch = sinon.spy();

      handleSubmitFailure(dispatch);
      expect(dispatch.calledWith(setPrestartStatus(PRESTART_STATUSES.failed))).to.be.true;
    });
  });
  describe('checkITFRequest', () => {
    afterEach(resetFetch);
    it('should handle success', (done) => {
      const dispatch = sinon.spy();
      mockApiRequest({ data: existingData });
      const thunk = checkITFRequest;
      const verificationType = PRESTART_VERIFICATION_TYPES.retrieve;
      const status = PRESTART_STATUSES.succeeded;

      thunk(dispatch).then((result) => {
        expect(dispatch.calledWith(setPrestartData({ verificationType }))).to.be.true;
        expect(dispatch.calledWith(setPrestartData({ currentExpirationDate: '2019-04-10T15:12:34.000+00:00' }))).to.be.true;
        expect(dispatch.calledWith(setPrestartStatus(status))).to.be.true;
        expect(result).to.be.false;
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('should handle error', (done) => {
      mockFetch(new Error('No network connection'), false);
      const dispatch = sinon.spy();
      const thunk = checkITFRequest;
      const verificationType = PRESTART_VERIFICATION_TYPES.retrieve;
      const status = PRESTART_STATUSES.failed;


      thunk(dispatch).then((result) => {
        expect(dispatch.calledWith(setPrestartData({ verificationType }))).to.be.true;
        expect(dispatch.calledWith(setPrestartStatus(status))).to.be.true;
        expect(result).to.equal(false);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
  describe('submitITFRequest', () => {
    afterEach(resetFetch);
    it('should handle success', (done) => {
      mockApiRequest({ data: createdData });
      const dispatch = sinon.spy();
      const thunk = submitITFRequest;
      const successStatus = PRESTART_STATUSES.succeeded;
      const verificationType = PRESTART_VERIFICATION_TYPES.create;

      thunk(dispatch).then(() => {
        expect(dispatch.calledWith(setPrestartData({ verificationType }))).to.be.true;
        expect(dispatch.calledWith(setPrestartData({ currentExpirationDate: '2019-04-10T15:12:34.000+00:00' }))).to.be.true;
        expect(dispatch.calledWith(setPrestartStatus(successStatus))).to.be.true;
        done();
      }).catch((err) => {
        done(err);
      });
    });
    it('should handle error', (done) => {
      mockFetch(new Error('No network connection'), false);
      const dispatch = sinon.spy();
      const thunk = submitITFRequest;
      const errorStatus = PRESTART_STATUSES.failed;
      const verificationType = PRESTART_VERIFICATION_TYPES.create;

      thunk(dispatch).then(() => {
        expect(dispatch.calledWith(setPrestartData({ verificationType }))).to.be.true;
        expect(dispatch.calledWith(setPrestartStatus(errorStatus))).to.be.true;
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
  xdescribe('verifyIntentToFile', () => { // TODO: enable once user testing mocks are removed
    afterEach(() => resetFetch());

    it('dispatches a pending status', (done) => {
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
