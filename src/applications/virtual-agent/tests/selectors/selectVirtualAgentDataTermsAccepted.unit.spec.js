import { expect } from 'chai';
import selectVirtualAgentDataTermsAccepted from '../../selectors/selectVirtualAgentDataTermsAccepted';

describe('selectVirtualAgentDataTermsAccepted', () => {
  it('should return virtualAgentData termsAccepted from state', () => {
    const state = {
      virtualAgentData: {
        termsAccepted: 'true',
      },
    };
    expect(selectVirtualAgentDataTermsAccepted(state)).to.equal('true');
  });
});
