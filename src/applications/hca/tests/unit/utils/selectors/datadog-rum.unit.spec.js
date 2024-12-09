import { expect } from 'chai';
import { selectRumUser } from '../../../../utils/selectors';

describe('hca DatadogRUM selector', () => {
  const state = {
    hcaEnrollmentStatus: {
      statusCode: 'noneOfTheAbove',
    },
    disabilityRating: {
      totalRating: 0,
    },
    user: {
      profile: {
        loa: { current: 3 },
        signIn: { serviceName: 'IDme' },
      },
      login: {
        currentlyLoggedIn: true,
      },
    },
  };

  it('should return correct user properties when `selectRumUser` executes', () => {
    expect(selectRumUser(state)).to.eql({
      disabilityRating: 0,
      isSignedIn: true,
      serviceProvider: 'IDme',
      loa: 3,
      enrollmentStatus: 'noneOfTheAbove',
    });
  });
});
