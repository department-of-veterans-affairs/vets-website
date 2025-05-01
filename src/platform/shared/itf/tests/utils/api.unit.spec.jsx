import { expect } from 'chai';
import sinon from 'sinon';

import { mockApiRequest } from 'platform/testing/unit/helpers';

import {
  ITF_FETCH_SUCCEEDED,
  ITF_FETCH_FAILED,
  ITF_CREATION_SUCCEEDED,
  ITF_CREATION_FAILED,
} from '../../constants';
import { fetchItf, createItf, getAndProcessItf } from '../../utils/api';
import { activeItf, nonActiveItf, mockItfData } from '../helpers';

describe('ITF api utils', () => {
  const mockProps = {
    accountUuid: 'abcd-1234',
    inProgressFormId: '5678',
    itfApi: '/v0/intent_to_file',
    itfType: 'compensation',
  };

  describe('fetchItf', () => {
    it('should make a successful fetchItf API request', async () => {
      const error = sinon.spy();
      global.window.DD_LOGS = { logger: { error } };
      const mock = mockItfData(activeItf);
      mockApiRequest(mock);
      const response = await fetchItf(mockProps);
      expect(response.type).to.equal(ITF_FETCH_SUCCEEDED);
      expect(response.data).to.deep.equal(mock.data.attributes.intentToFile);
      expect(error.notCalled).to.be.true;
    });

    it('should fail fetchItf API request', async () => {
      const error = sinon.spy();
      global.window.DD_LOGS = { logger: { error } };
      mockApiRequest(mockItfData(), false);
      const response = await fetchItf(mockProps);

      expect(response.type).to.equal(ITF_FETCH_FAILED);
      expect(response.data).to.deep.equal([]);
      expect(error.called).to.be.true;
      expect(error.args[0][0]).to.equal('ITF fetch failed');
      expect(error.args[0][1]).to.deep.equal({
        name: 'itf_fetch_failed',
        accountUuid: 'abcd-1234',
        inProgressFormId: '5678',
      });
    });
  });

  describe('createItf', () => {
    const mockDataCreate = {
      data: { attributes: { intentToFile: activeItf } },
    };
    const mockDataCreateArray = {
      data: { attributes: { intentToFile: [activeItf] } },
    };
    it('should throw an error if itfType is not provided', () => {
      try {
        createItf({});
      } catch (error) {
        expect(error).to.be.an('Error');
        expect(error.message).to.equal('itfType is required');
      }
    });

    it('should make a successful createItf API request that returns an object', async () => {
      const error = sinon.spy();
      global.window.DD_LOGS = { logger: { error } };
      mockApiRequest(mockDataCreate);
      const response = await createItf(mockProps);
      expect(response.type).to.equal(ITF_CREATION_SUCCEEDED);
      expect(response.currentITF).to.deep.equal(activeItf);
      expect(error.notCalled).to.be.true;
    });

    it('should make a successful createItf API request that returns an array', async () => {
      const error = sinon.spy();
      global.window.DD_LOGS = { logger: { error } };
      mockApiRequest(mockDataCreateArray);
      const response = await createItf(mockProps);
      expect(response.type).to.equal(ITF_CREATION_SUCCEEDED);
      expect(response.currentITF).to.deep.equal(activeItf);
      expect(error.notCalled).to.be.true;
    });

    it('should fail createItf API request', async () => {
      const error = sinon.spy();
      global.window.DD_LOGS = { logger: { error } };
      mockApiRequest(mockDataCreate, false);
      const response = await createItf(mockProps);

      expect(response.type).to.equal(ITF_CREATION_FAILED);
      expect(response.currentITF).to.deep.equal({});
      expect(error.called).to.be.true;
      expect(error.args[0][0]).to.equal('ITF creation failed');
      expect(error.args[0][1]).to.deep.equal({
        name: 'itf_creation_failed',
        accountUuid: 'abcd-1234',
        inProgressFormId: '5678',
      });
    });
  });

  describe('getAndProcessItf', () => {
    it('should throw an error if itfType is not provided', () => {
      try {
        getAndProcessItf();
      } catch (error) {
        expect(error).to.be.an('Error');
        expect(error.message).to.equal(
          'Intent to File type (itfType) is required and can only include compensation, pension, or survivor',
        );
      }
    });

    it('should make a successful getAndProcessItf API request and return active ITF', async () => {
      const error = sinon.spy();
      global.window.DD_LOGS = { logger: { error } };
      mockApiRequest(mockItfData(activeItf));
      const result = await getAndProcessItf(mockProps);
      expect(result.currentITF).to.deep.equal(activeItf);
      expect(error.notCalled).to.be.true;
    });

    it('should make a successful getAndProcessItf API request and return latest non-expired non-active ITF', async () => {
      const error = sinon.spy();
      global.window.DD_LOGS = { logger: { error } };
      mockApiRequest(mockItfData());
      const result = await getAndProcessItf(mockProps);

      expect(result.currentITF).to.deep.equal(nonActiveItf);
      expect(error.notCalled).to.be.true;
    });

    it('should fail getAndProcessItf API request and return empty object', async () => {
      const error = sinon.spy();
      global.window.DD_LOGS = { logger: { error } };
      mockApiRequest(mockItfData(), false);
      const result = await getAndProcessItf(mockProps);
      expect(result.currentITF).to.be.undefined;
      expect(error.called).to.be.true;
      expect(error.args[0][0]).to.equal('ITF fetch failed');
      expect(error.args[0][1]).to.deep.equal({
        name: 'itf_fetch_failed',
        accountUuid: 'abcd-1234',
        inProgressFormId: '5678',
      });
    });
  });
});
