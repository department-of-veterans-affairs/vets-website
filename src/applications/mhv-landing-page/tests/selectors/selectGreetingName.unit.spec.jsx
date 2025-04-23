import { expect } from 'chai';
import { selectGreetingName } from '../../selectors';
import { appName } from '../../manifest.json';

const stateFn = ({ preferredName = 'Bob', first = 'Robert' } = {}) => ({
  myHealth: {
    personalInformation: {
      data: {
        preferredName,
      },
    },
  },
  user: {
    profile: {
      userFullName: {
        first,
      },
      preferredName,
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

  it('capitalizes first name', () => {
    state = stateFn({ preferredName: null, first: 'KEVIN' });
    result = selectGreetingName(state);
    expect(result).to.eq('Kevin');
  });

  it('returns null, when preferredName nor first name are present', () => {
    state = stateFn({ preferredName: null, first: null });
    result = selectGreetingName(state);
    expect(result).to.eq(null);
  });
});
