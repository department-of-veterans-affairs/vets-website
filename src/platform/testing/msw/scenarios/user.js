import {
  userHandler,
  defaultUser,
  unauthenticatedUser,
} from '../handlers/user';
import { featureTogglesHandler } from '../handlers/feature-toggles';

/**
 * User scenarios - reusable user states
 */
export const user = {
  /**
   * Default authenticated user with MHV access
   */
  authenticated: () => [
    userHandler(defaultUser),
    featureTogglesHandler(),
  ],

  /**
   * Unauthenticated user (no MHV access)
   */
  unauthenticated: () => [
    userHandler(unauthenticatedUser),
    featureTogglesHandler(),
  ],

  /**
   * User with Cerner facility
   */
  cernerUser: () => [
    userHandler({
      ...defaultUser,
      data: {
        ...defaultUser.data,
        attributes: {
          ...defaultUser.data.attributes,
          vaProfile: {
            ...defaultUser.data.attributes.vaProfile,
            isCernerPatient: true,
            facilities: [
              {
                facilityId: '668',
                isCerner: true,
              },
            ],
          },
        },
      },
    }),
    featureTogglesHandler(),
  ],

  /**
   * User with specific feature toggles
   */
  withToggles: (toggles = {}) => [
    userHandler(defaultUser),
    featureTogglesHandler(toggles),
  ],

  /**
   * User without premium MHV account
   */
  basicMhvUser: () => [
    userHandler({
      ...defaultUser,
      data: {
        ...defaultUser.data,
        attributes: {
          ...defaultUser.data.attributes,
          services: defaultUser.data.attributes.services.filter(
            s => !s.includes('mhv_accounts_premium'),
          ),
        },
      },
    }),
    featureTogglesHandler(),
  ],
};
