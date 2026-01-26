import { expect } from 'chai';

const { getConversationLink } = require('../../utils/links');

describe('getConversationLink', () => {
  it('returns a properly formatted path', () => {
    expect(getConversationLink('A-12345')).to.equal('/user/dashboard/A-12345');
  });
});
