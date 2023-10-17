import { expect } from 'chai';

import {
  getAllRoutes,
  getNavRoutes,
  navRoutes,
  otherRoutes,
} from '@@profile/routes.js';
import { PROFILE_PATH_NAMES } from '@@profile/constants.js';

describe('getAllRoutes', () => {
  describe('when called should always include direct deposit path', () => {
    it('should return the direct deposit path`', () => {
      const allRoutes = getAllRoutes();
      const hasDirectDepositRoute = allRoutes.some(
        route => route.name === PROFILE_PATH_NAMES.DIRECT_DEPOSIT,
      );

      expect(hasDirectDepositRoute).to.be.true;
    });
  });

  it('returns an array of route objects', () => {
    const routes = getAllRoutes();
    expect(routes).to.be.an('array');
    expect(routes.length >= 7).to.be.true;
    expect(routes[0].name).to.eq(PROFILE_PATH_NAMES.PERSONAL_INFORMATION);
  });

  it('adds the edit route when feature toggle is true', () => {
    const routes = getAllRoutes({ useFieldEditingPage: true });
    const result = routes.some(route => route.name === PROFILE_PATH_NAMES.EDIT);
    expect(result).to.be.true;
  });

  it('removes the edit route when feature toggle is false', () => {
    const routes = getAllRoutes({ useFieldEditingPage: false });
    const result = routes.some(route => route.name === PROFILE_PATH_NAMES.EDIT);
    expect(result).to.be.false;
  });
});

describe('getNavRoutes', () => {
  it('excludes otherRoutes', () => {
    expect(getNavRoutes()).to.not.include(otherRoutes);
  });

  const newRoute = {
    component: 'ComponentName',
    name: 'name',
    path: '/profile/somewhere-new',
    toggleName: 'dummyFeatureToggleName',
  };

  it('adds newRoute when feature toggle is true', () => {
    navRoutes.push(newRoute);
    const result = getNavRoutes({ dummyFeatureToggleName: true }, navRoutes);
    expect(result).to.include(newRoute);
  });

  it('removes newRoute route when feature toggle is false', () => {
    navRoutes.push(newRoute);
    const result = getNavRoutes({ dummyFeatureToggleName: false }, navRoutes);
    expect(result).to.not.include(newRoute);
  });

  it('removes newRoute route when feature toggle is not present', () => {
    navRoutes.push(newRoute);
    const result = getNavRoutes({}, navRoutes);
    expect(result).to.not.include(newRoute);
  });
});
