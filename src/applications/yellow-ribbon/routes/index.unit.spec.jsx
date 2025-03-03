// Dependencies.
import { expect } from 'chai';
// Relative imports.
import YellowRibbonApp from '../containers/YellowRibbonApp';
import routes from '.';

describe('Yellow Ribbon routes', () => {
  it('should have the main route', () => {
    const expectedRoutes = {
      path: '/',
      component: YellowRibbonApp,
    };

    expect(routes).to.deep.equal(expectedRoutes);
  });
});
