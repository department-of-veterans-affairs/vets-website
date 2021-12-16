import { expect } from 'chai';
import set from 'platform/utilities/data/set';

import localStorage from 'platform/utilities/storage/localStorage';
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

    it('should return My Account and email', () => {
      const result = selectUserGreeting(state);
      const resultItemText = result.map(component => component.props.children);

      expect(result.length).to.equal(2);
      expect(resultItemText).to.eql(['My Account', 'test@test.gov']);
    });

    it('should return session name', () => {
      localStorage.setItem('userFirstName', 'Joe');
      const result = selectUserGreeting(state);
      expect(result.props.children).to.equal('Joe');
    });

    it('should return profile name', () => {
      localStorage.setItem('userFirstName', 'Joe');
      const result = selectUserGreeting(
        set('user.profile.userFullName.first', 'Jane', state),
      );
      expect(result.props.children).to.equal('Jane');
    });

    afterEach(() => {
      localStorage.clear();
    });
  });
});
