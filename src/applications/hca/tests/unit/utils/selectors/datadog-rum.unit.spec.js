import { expect } from 'chai';
import { selectRumUser } from '../../../../utils/selectors/datadog-rum';

describe('hca DatadogRUM selector', () => {
  const state = {
    hcaEnrollmentStatus: {
      enrollmentStatus: 'noneOfTheAbove',
    },
    totalRating: {
      totalDisabilityRating: 0,
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

  describe('when `selectRumUser` executes', () => {
    it('should return correct user properties', () => {
      expect(selectRumUser(state)).to.eql({
        disabilityRating: 0,
        isSignedIn: true,
        serviceProvider: 'IDme',
        loa: 3,
        enrollmentStatus: 'noneOfTheAbove',
      });
    });
  });
});
