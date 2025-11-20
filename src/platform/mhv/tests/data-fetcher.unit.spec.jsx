import { expect } from 'chai';
import * as sinon from 'sinon';
import * as seiApi from '../self-entered/sei-api';
import { getAllSelfEnteredData } from '../self-entered/data-fetcher';

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
});
