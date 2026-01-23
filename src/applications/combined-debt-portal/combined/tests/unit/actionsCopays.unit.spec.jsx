import { expect } from 'chai';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';
import * as apiModule from 'platform/utilities/api';
import * as medicalCentersModule from 'platform/utilities/medical-centers/medical-centers';
import {
  MCP_STATEMENTS_FETCH_INIT,
  MCP_STATEMENTS_FETCH_SUCCESS,
  MCP_STATEMENTS_FETCH_FAILURE,
  mcpStatementsFetchInit,
  getAllCopayStatements,
} from '../../actions/copays';

describe('copays actions', () => {
  let sandbox;
  let dispatch;
  let apiRequestStub;
  let getMedicalCenterNameByIDStub;
  let sentryCaptureMessageStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    dispatch = sandbox.spy();
    apiRequestStub = sandbox.stub(apiModule, 'apiRequest');
    getMedicalCenterNameByIDStub = sandbox.stub(
      medicalCentersModule,
      'getMedicalCenterNameByID',
    );
    sentryCaptureMessageStub = sandbox.stub(Sentry, 'captureMessage');
    sandbox
      .stub(Sentry, 'withScope')
      .callsFake(cb => cb({ setExtra: sandbox.stub() }));
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('mcpStatementsFetchInit', () => {
    it('should create an action to initiate fetching statements', () => {
      const expectedAction = {
        type: MCP_STATEMENTS_FETCH_INIT,
      };
      expect(mcpStatementsFetchInit()).to.deep.equal(expectedAction);
    });
  });

  describe('getAllCopayStatements', () => {
    it('should dispatch FETCH_INIT and FETCH_SUCCESS actions when fetch succeeds', async () => {
      const fakeData = [
        {
          station: {
            facilitYNum: '123',
            city: 'NEW YORK',
          },
        },
      ];
      apiRequestStub.resolves({ data: fakeData });
      getMedicalCenterNameByIDStub.returns('Fake Medical Center');

      await getAllCopayStatements(dispatch);

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: MCP_STATEMENTS_FETCH_INIT,
      });
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: MCP_STATEMENTS_FETCH_SUCCESS,
        response: [
          {
            station: {
              facilitYNum: '123',
              city: 'New York',
              facilityName: 'Fake Medical Center',
            },
          },
        ],
      });
    });

    it('should handle missing station information', async () => {
      const fakeData = [{ id: 1 }]; // Missing station info
      apiRequestStub.resolves({ data: fakeData });

      await getAllCopayStatements(dispatch);

      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: MCP_STATEMENTS_FETCH_SUCCESS,
        response: [{ id: 1 }],
      });
    });

    it('should handle null values in station information', async () => {
      const fakeData = [
        {
          id: 1,
          station: {
            facilitYNum: null,
            city: null,
          },
        },
      ];
      apiRequestStub.resolves({ data: fakeData });
      getMedicalCenterNameByIDStub.returns(null);

      await getAllCopayStatements(dispatch);

      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: MCP_STATEMENTS_FETCH_SUCCESS,
        response: [
          {
            id: 1,
            station: {
              facilitYNum: null,
              city: '',
              facilityName: null,
            },
          },
        ],
      });
    });

    it('should handle network errors', async () => {
      const networkError = { detail: 'Network error' };
      apiRequestStub.rejects({ errors: [networkError] });

      await getAllCopayStatements(dispatch);

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: MCP_STATEMENTS_FETCH_INIT,
      });
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: MCP_STATEMENTS_FETCH_FAILURE,
        error: networkError,
      });
      expect(sentryCaptureMessageStub.calledOnce).to.be.true;
      expect(sentryCaptureMessageStub.firstCall.args[0]).to.equal(
        'medical_copays failed: Network error',
      );
    });
  });

  describe('getAllCopayStatements with various inputs', () => {
    it('should correctly transform city names', async () => {
      const fakeData = [
        {
          station: {
            facilitYNum: '123',
            city: 'NEW YORK CITY',
          },
        },
      ];
      apiRequestStub.resolves({ data: fakeData });
      getMedicalCenterNameByIDStub.returns('NYC Medical Center');

      await getAllCopayStatements(dispatch);

      expect(dispatch.secondCall.args[0].response[0].station.city).to.equal(
        'New York City',
      );
    });

    it('should handle empty city names', async () => {
      const fakeData = [
        {
          station: {
            facilitYNum: '123',
            city: '',
          },
        },
      ];
      apiRequestStub.resolves({ data: fakeData });
      getMedicalCenterNameByIDStub.returns('Some Medical Center');

      await getAllCopayStatements(dispatch);

      expect(dispatch.secondCall.args[0].response[0].station.city).to.equal('');
    });

    it('should handle single word city names', async () => {
      const fakeData = [
        {
          station: {
            facilitYNum: '123',
            city: 'WASHINGTON',
          },
        },
      ];
      apiRequestStub.resolves({ data: fakeData });
      getMedicalCenterNameByIDStub.returns('Washington Medical Center');

      await getAllCopayStatements(dispatch);

      expect(dispatch.secondCall.args[0].response[0].station.city).to.equal(
        'Washington',
      );
    });
  });
});
