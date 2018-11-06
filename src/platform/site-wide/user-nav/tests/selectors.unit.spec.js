import { expect } from 'chai';
import { set } from 'lodash/fp';

import localStorage from '../../../utilities/storage/localStorage';
import { selectUserGreeting } from '../selectors';

describe('User navigation selectors', () => {
  describe('selectUserGreeting', () => {
    const state = {
      user: {
        profile: {
          userFullName: { first: null },
          email: 'test@test.gov',
        },
      },
    };

    it('should return email', () => {
      const result = selectUserGreeting(state);
      expect(result).to.equal('test@test.gov');
    });

    it('should return session name', () => {
      localStorage.setItem('userFirstName', 'Joe');
      const result = selectUserGreeting(state);
      expect(result).to.equal('Joe');
    });

    it('should return profile name', () => {
      localStorage.setItem('userFirstName', 'Joe');
      const result = selectUserGreeting(
        set('user.profile.userFullName.first', 'Jane', state),
      );
      expect(result).to.equal('Jane');
    });

    afterEach(() => {
      localStorage.clear();
    });
  });
});
