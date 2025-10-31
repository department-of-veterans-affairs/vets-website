import { expect } from 'chai';

const { getConversationLink } = require('../../utils/links');

describe('getConversationLink', () => {
  it('returns a properly formatted path', () => {
    expect(getConversationLink('A-12345')).to.equal(
      '/contact-us/ask-va/user/dashboard/A-12345',
    );
  });
});
