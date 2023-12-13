import { expect } from 'chai';
import sinon from 'sinon';
import { describe } from 'mocha';
import { callVirtualAgentTokenApi } from '../../../components/chatbox/useVirtualAgentToken';

describe('useVirtualAgentToken', () => {
  describe('callVirtualAgentTokenApi', () => {
    it('should return a function that uses MSFT PVA', () => {
      const virtualAgentEnableMsftPvaTesting = true;
      const apiSpy = sinon.spy();
      callVirtualAgentTokenApi(virtualAgentEnableMsftPvaTesting, apiSpy)();
      expect(apiSpy.calledOnce).to.be.true;
      expect(apiSpy.args[0][0]).to.be.equal('/virtual_agent_token_msft');
      expect(apiSpy.args[0][1]).to.be.eql({
        method: 'POST',
      });
    });
    it('should not return a function that uses MSFT PVA', () => {
      const virtualAgentEnableMsftPvaTesting = false;
      const apiSpy = sinon.spy();
      callVirtualAgentTokenApi(virtualAgentEnableMsftPvaTesting, apiSpy)();
      expect(apiSpy.calledOnce).to.be.true;
      expect(apiSpy.args[0][0]).to.be.equal('/virtual_agent_token');
      expect(apiSpy.args[0][1]).to.be.eql({
        method: 'POST',
      });
    });
  });
});
