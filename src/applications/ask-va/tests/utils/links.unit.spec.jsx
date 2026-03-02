import { expect } from 'chai';
import { getConversationLink } from '../../utils/links';

describe('getConversationLink', () => {
  it('returns a properly formatted path', () => {
    expect(getConversationLink('A-12345')).to.equal('/user/dashboard/A-12345');
  });
});
