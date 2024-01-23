import { expect } from 'chai';
import { selectGreetingName } from '../../selectors';
import { appName } from '../../manifest.json';

const stateFn = ({
  preferredName = 'Bob',
  first = 'Robert',
  email = 'username@hostname.com',
} = {}) => ({
  myHealth: {
    personalInformation: {
      data: {
        preferredName,
      },
    },
  },
  user: {
    profile: {
      email,
      userFullName: {
        first,
      },
    },
  },
});

let result;
let state;

describe(`${appName} -- selectGreetingName`, () => {
  it('selects the preferred name, by default', () => {
    state = stateFn();
    result = selectGreetingName(state);
    expect(result).to.eq('Bob');
  });

  it('falls back to first name, when preferred name is not present', () => {
    state = stateFn({ preferredName: null });
    result = selectGreetingName(state);
    expect(result).to.eq('Robert');
  });

  it('falls back to email, when no names are present', () => {
    state = stateFn({ preferredName: null, first: null });
    result = selectGreetingName(state);
    expect(result).to.eq('username@hostname.com');
  });

  it('returns null, when name nor email are present', () => {
    state = stateFn({ preferredName: null, first: null, email: null });
    result = selectGreetingName(state);
    expect(result).to.eq(null);
  });
});
