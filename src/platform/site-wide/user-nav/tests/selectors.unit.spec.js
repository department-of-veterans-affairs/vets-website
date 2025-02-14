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
          preferredName: null,
          email: 'test@test.gov',
        },
      },
    };

    it('should return email', () => {
      const result = selectUserGreeting(state);
      const resultItemText = result.map(component => component.props.children);

      expect(result.length).to.equal(1);
      expect(resultItemText).to.eql(['test@test.gov']);
    });

    it('should return session name', () => {
      localStorage.setItem('userFirstName', 'Joe');
      const result = selectUserGreeting(state);
      expect(result.props.children).to.equal('Joe');
    });

    it('should return session preferred name', () => {
      localStorage.setItem('userFirstName', 'Joe');
      localStorage.setItem('preferredName', 'Joey');
      const result = selectUserGreeting(state);
      expect(result.props.children).to.equal('Joey');
    });

    it('should return profile name', () => {
      localStorage.setItem('userFirstName', 'Joe');
      const result = selectUserGreeting(
        set('user.profile.userFullName.first', 'Jane', state),
      );
      expect(result.props.children).to.equal('Jane');
    });

    it('should return preferred name', () => {
      localStorage.setItem('userFirstName', 'Joe');
      let stateObj = set('user.profile.userFullName.first', 'Jain');
      stateObj = set('user.profile.preferredName', 'JJ', stateObj);
      const result = selectUserGreeting(stateObj);
      expect(result.props.children).to.equal('JJ');
    });

    it('should prioritize preferred name over cached preferred name', () => {
      localStorage.setItem('userFirstName', 'Joe');
      localStorage.setItem('preferredName', 'Joey');
      let stateObj = set('user.profile.userFullName.first', 'Jain');
      stateObj = set('user.profile.preferredName', 'JJ', stateObj);
      const result = selectUserGreeting(stateObj);
      expect(result.props.children).to.equal('JJ');
    });

    afterEach(() => {
      localStorage.clear();
    });
  });
});
