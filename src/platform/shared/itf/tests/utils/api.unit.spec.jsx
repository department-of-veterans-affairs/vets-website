import { expect } from 'chai';

import { mockApiRequest } from 'platform/testing/unit/helpers';

import {
  ITF_API,
  ITF_FETCH_SUCCEEDED,
  ITF_FETCH_FAILED,
  ITF_CREATION_SUCCEEDED,
  ITF_CREATION_FAILED,
} from '../../constants';
import { fetchItf, createItf, getAndProcessItf } from '../../utils/api';
import { activeItf, nonActiveItf, mockItfData } from '../helpers';

describe('ITF api utils', () => {
  const itfApi = `http://localhost:3000/${ITF_API}/compensation`;
  const mockProps = {
    accountUuid: 'abcd-1234',
    inProgressFormId: '5678',
    itfApi,
    itfType: 'compensation',
  };

  describe('fetchItf', () => {
    it('should make a successful fetchItf API request', async () => {
      const mock = mockItfData(activeItf);
      mockApiRequest(mock);
      const response = await fetchItf(mockProps);
      expect(response.type).to.equal(ITF_FETCH_SUCCEEDED);
      expect(response.data).to.deep.equal(mock.data.attributes.intentToFile);
    });

    it('should fail fetchItf API request', async () => {
      mockApiRequest(mockItfData(), false);
      const response = await fetchItf(mockProps);

      expect(response.type).to.equal(ITF_FETCH_FAILED);
      expect(response.data).to.deep.equal([]);
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
        mockApiRequest({});
        createItf({});
      } catch (error) {
        expect(error).to.be.an('Error');
        expect(error.message).to.equal('itfType is required');
      }
    });

    it('should make a successful createItf API request that returns an object', async () => {
      mockApiRequest(mockDataCreate);
      const response = await createItf(mockProps);
      expect(response.type).to.equal(ITF_CREATION_SUCCEEDED);
      expect(response.currentITF).to.deep.equal(activeItf);
    });

    it('should make a successful createItf API request that returns an array', async () => {
      mockApiRequest(mockDataCreateArray);
      const response = await createItf(mockProps);
      expect(response.type).to.equal(ITF_CREATION_SUCCEEDED);
      expect(response.currentITF).to.deep.equal(activeItf);
    });

    it('should fail createItf API request', async () => {
      mockApiRequest(mockDataCreate, false);
      const response = await createItf(mockProps);

      expect(response.type).to.equal(ITF_CREATION_FAILED);
      expect(response.currentITF).to.deep.equal({});
    });
  });

  describe('getAndProcessItf', () => {
    it('should throw an error if itfType is not provided', () => {
      try {
        mockApiRequest({});
        getAndProcessItf();
      } catch (error) {
        expect(error).to.be.an('Error');
        expect(error.message).to.equal(
          'Intent to File type (itfType) is required and can only include compensation, pension, or survivor',
        );
      }
    });

    it('should make a successful getAndProcessItf API request and return active ITF', async () => {
      mockApiRequest(mockItfData(activeItf));
      const result = await getAndProcessItf(mockProps);
      expect(result.currentITF).to.deep.equal(activeItf);
    });

    it('should make a successful getAndProcessItf API request and return latest non-expired non-active ITF', async () => {
      mockApiRequest(mockItfData());
      const result = await getAndProcessItf(mockProps);
      expect(result.currentITF).to.deep.equal(nonActiveItf);
    });

    it('should fail getAndProcessItf API request and return empty object', async () => {
      mockApiRequest(mockItfData(), false);
      const result = await getAndProcessItf(mockProps);
      expect(result.currentITF).to.be.undefined;
    });
  });
});
