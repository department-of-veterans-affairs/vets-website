import sinon from 'sinon';
import { expect } from 'chai';
import { mockApiRequest } from 'platform/testing/unit/helpers';
import copays from '../e2e/fixtures/mocks/copays.json';
import { transform } from '../../../combined/utils/helpers';
import {
  getAllCopays,
  MCP_COPAYS_FETCH_INIT,
  MCP_COPAYS_FETCH_SUCCESS,
} from '../../../combined/actions/copays';

describe('getAllCopays', () => {
  it('should render response data', () => {
    const dispatch = sinon.spy();
    const response = transform(copays.data);
    mockApiRequest(copays);

    return getAllCopays(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        MCP_COPAYS_FETCH_INIT,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        MCP_COPAYS_FETCH_SUCCESS,
      );
      expect(dispatch.secondCall.args[0].response).to.deep.equal(response);
    });
  });
});
