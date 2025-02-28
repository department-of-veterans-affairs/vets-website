import { expect } from 'chai';
import sinon from 'sinon';

import { mockApiRequest } from 'platform/testing/unit/helpers';

import {
  GENERATE_AUTOMATIC_COE_STARTED,
  GENERATE_AUTOMATIC_COE_FAILED,
  GENERATE_AUTOMATIC_COE_SUCCEEDED,
  SKIP_AUTOMATIC_COE_CHECK,
  getCoeStatus,
  generateCoe,
} from '../../actions';

const mockData = {
  data: {
    attributes: {
      status: 'AVAILABLE',
      applicationCreateDate: 1642619386000,
      referenceNumber: '6934344',
    },
  },
};

const mockError = { errors: 'nope' };

describe('getCoeStatus', () => {
  it('should successfully fetch COE status with data', () => {
    mockApiRequest(mockData);
    return getCoeStatus().then(response => {
      expect(response).to.eql(mockData.data.attributes);
    });
  });
  it('should fail fetch COE status with error', () => {
    mockApiRequest(mockError, false);
    return getCoeStatus().catch(response => {
      response.json().then(json => {
        expect(json.errors).to.eq(mockError.errors);
      });
    });
  });
});

describe('generateCoe', () => {
  it('should dispatch a skip automatic check', () => {
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return generateCoe(true)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        SKIP_AUTOMATIC_COE_CHECK,
      );
    });
  });
  it('should dispatch a fetch succeeded action with data', () => {
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return generateCoe()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        GENERATE_AUTOMATIC_COE_STARTED,
      );
      expect(dispatch.secondCall.args[0]).to.eql({
        type: GENERATE_AUTOMATIC_COE_SUCCEEDED,
        response: mockData.data.attributes,
      });
    });
  });

  it('should dispatch a fetch failed action', () => {
    mockApiRequest(mockError, false);
    const dispatch = sinon.spy();
    return generateCoe()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        GENERATE_AUTOMATIC_COE_STARTED,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        GENERATE_AUTOMATIC_COE_FAILED,
      );
    });
  });
});
