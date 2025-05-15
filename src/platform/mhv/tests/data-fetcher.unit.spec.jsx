import { expect } from 'chai';
import * as sinon from 'sinon';
import * as seiApi from '../self-entered/sei-api';
import {
  getAllSelfEnteredData,
  getSelfEnteredData,
} from '../self-entered/data-fetcher';

describe('data-fetcher', () => {
  let stubs = [];

  afterEach(() => {
    stubs.forEach(s => s.restore());
    stubs = [];
  });

  describe('getAllSelfEnteredData', () => {
    it('should call getSelfEnteredInformation and return its result', async () => {
      const mockData = { some: 'data' };
      stubs.push(
        sinon.stub(seiApi, 'getSelfEnteredInformation').resolves(mockData),
      );

      const result = await getAllSelfEnteredData();
      expect(result).to.deep.equal(mockData);
      expect(seiApi.getSelfEnteredInformation.calledOnce).to.be.true;
    });
  });

  describe('getSelfEnteredData', () => {
    it('should return all settled promises with key references on error', async () => {
      stubs.push(
        sinon.stub(seiApi, 'getSeiActivityJournal').resolves(['jogging']),
      );
      stubs.push(sinon.stub(seiApi, 'getSeiAllergies').rejects('Server error'));
      stubs.push(
        sinon.stub(seiApi, 'getPatient').resolves({ name: 'John Doe' }),
      );

      // Stub the rest to avoid accidental real calls
      Object.keys(seiApi).forEach(fnName => {
        if (!seiApi[fnName].restore) {
          stubs.push(sinon.stub(seiApi, fnName).resolves([]));
        }
      });

      const results = await getSelfEnteredData();

      const activity = results.find(
        r => r.status === 'fulfilled' && r.value.key === 'activityJournal',
      );
      const errorEntry = results.find(
        r => r.status === 'rejected' && r.reason.key === 'allergies',
      );

      expect(activity.value.response).to.deep.equal(['jogging']);
      expect(errorEntry.reason.message).to.equal('Server error');
      expect(errorEntry.reason.key).to.equal('allergies');
    });
  });
});
