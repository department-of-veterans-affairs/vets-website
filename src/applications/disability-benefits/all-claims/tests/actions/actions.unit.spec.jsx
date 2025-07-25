import { expect } from 'chai';
import sinon from 'sinon';

import { mockApiRequest } from 'platform/testing/unit/helpers';

import {
  fetchITF,
  createITF,
  ITF_FETCH_INITIATED,
  ITF_FETCH_SUCCEEDED,
  ITF_FETCH_FAILED,
  ITF_CREATION_INITIATED,
  ITF_CREATION_SUCCEEDED,
  ITF_CREATION_FAILED,
  addPerson,
  MVI_ADD_INITIATED,
  MVI_ADD_SUCCEEDED,
  MVI_ADD_FAILED,
} from '../../actions';

describe('ITF actions', () => {
  describe('fetchITF', () => {
    it('should dispatch a fetch succeeded action with data', () => {
      const mockData = { data: 'asdf' };
      mockApiRequest(mockData);
      const dispatch = sinon.spy();
      return fetchITF()(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].type).to.equal(ITF_FETCH_INITIATED);
        expect(dispatch.secondCall.args[0]).to.eql({
          type: ITF_FETCH_SUCCEEDED,
          data: mockData.data,
        });
      });
    });

    it('should dispatch a fetch failed action', () => {
      const mockData = { data: 'asdf' };
      mockApiRequest(mockData, false);
      const dispatch = sinon.spy();
      return fetchITF()(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].type).to.equal(ITF_FETCH_INITIATED);
        expect(dispatch.secondCall.args[0].type).to.equal(ITF_FETCH_FAILED);
      });
    });
  });

  describe('createITF', () => {
    it('should dispatch a fetch succeeded action with data', () => {
      const mockData = { data: 'asdf' };
      mockApiRequest(mockData);
      const dispatch = sinon.spy();
      return createITF()(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].type).to.equal(
          ITF_CREATION_INITIATED,
        );
        expect(dispatch.secondCall.args[0]).to.eql({
          type: ITF_CREATION_SUCCEEDED,
          data: mockData.data,
        });
      });
    });

    it('should dispatch a fetch failed action', () => {
      const mockData = { data: 'asdf' };
      mockApiRequest(mockData, false);
      const dispatch = sinon.spy();
      return createITF()(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].type).to.equal(
          ITF_CREATION_INITIATED,
        );
        expect(dispatch.secondCall.args[0].type).to.eql(ITF_CREATION_FAILED);
      });
    });
  });
});

describe('MVI action', () => {
  describe('MVI add person action', () => {
    it('should dispatch an add person succeeded action', () => {
      const mockData = { data: 'asdf' };
      mockApiRequest(mockData);
      const dispatch = sinon.spy();
      return addPerson()(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].type).to.equal(MVI_ADD_INITIATED);
        expect(dispatch.secondCall.args[0]).to.eql({
          type: MVI_ADD_SUCCEEDED,
          data: mockData.data,
        });
      });
    });

    it('should dispatch an add person failed action', () => {
      const mockData = { data: 'asdf' };
      mockApiRequest(mockData, false);
      const dispatch = sinon.spy();
      return addPerson()(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].type).to.equal(MVI_ADD_INITIATED);
        expect(dispatch.secondCall.args[0].type).to.equal(MVI_ADD_FAILED);
      });
    });
  });
});
