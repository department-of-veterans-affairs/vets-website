import sinon from 'sinon';
import { expect } from 'chai';
import * as api from 'platform/utilities/api';
import { mockApiRequest } from 'platform/testing/unit/helpers';
import copays from '../e2e/fixtures/mocks/copays.json';
import { transform } from '../../../combined/utils/helpers';
import {
  getAllCopayStatements,
  MCP_STATEMENTS_FETCH_INIT,
  MCP_STATEMENTS_FETCH_SUCCESS,
  getCopayDetailStatement,
  MCP_DETAIL_FETCH_INIT,
  MCP_DETAIL_FETCH_SUCCESS,
  MCP_DETAIL_FETCH_FAILURE,
} from '../../../combined/actions/copays';

describe('getAllCopayStatements', () => {
  it('should render response data', () => {
    const dispatch = sinon.spy();
    const response = transform(copays.data);
    mockApiRequest(copays);

    return getAllCopayStatements(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        MCP_STATEMENTS_FETCH_INIT,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        MCP_STATEMENTS_FETCH_SUCCESS,
      );
      expect(dispatch.secondCall.args[0].response).to.deep.equal(response);
    });
  });
});

describe('getCopayDetailStatement', () => {
  const copayId = '4-1abZUKu7xIvIw6';
  let apiRequestStub;
  let dispatch;

  beforeEach(() => {
    apiRequestStub = sinon.stub(api, 'apiRequest');
    dispatch = sinon.spy();
  });

  afterEach(() => {
    apiRequestStub.restore();
  });

  it('should call apiRequest exactly once with the copay ID', async () => {
    const mockResponse = {
      data: { id: copayId, attributes: { facility: { name: 'Test' } } },
    };
    apiRequestStub.resolves(mockResponse);

    await getCopayDetailStatement(copayId)(dispatch);

    expect(apiRequestStub.callCount).to.equal(1);
    expect(apiRequestStub.firstCall.args[0]).to.contain(copayId);
  });

  it('should dispatch INIT then SUCCESS on successful fetch', async () => {
    const mockResponse = {
      data: { id: copayId, attributes: { facility: { name: 'Test' } } },
    };
    apiRequestStub.resolves(mockResponse);

    await getCopayDetailStatement(copayId)(dispatch);

    const actions = dispatch.getCalls().map(call => call.args[0]);

    expect(actions[0]).to.eql({ type: MCP_DETAIL_FETCH_INIT });
    expect(actions[1].type).to.equal(MCP_DETAIL_FETCH_SUCCESS);
    expect(actions[1].response).to.eql(mockResponse);
  });

  it('should dispatch INIT then FAILURE on error', async () => {
    apiRequestStub.rejects({ errors: [{ detail: 'Not found' }] });

    await getCopayDetailStatement(copayId)(dispatch);

    const actions = dispatch.getCalls().map(call => call.args[0]);

    expect(actions[0]).to.eql({ type: MCP_DETAIL_FETCH_INIT });
    expect(actions[1].type).to.equal(MCP_DETAIL_FETCH_FAILURE);
  });
});
