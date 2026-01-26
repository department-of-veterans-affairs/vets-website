import { expect } from 'chai';
import selectAccountUuid from '../../../webchat/selectors/selectAccountUuid';

describe('selectAccountUuid', () => {
  it('should return first name from state', () => {
    const state = {
      user: {
        profile: {
          accountUuid: 'abc',
        },
      },
    };
    expect(selectAccountUuid(state)).to.equal('abc');
  });
});
