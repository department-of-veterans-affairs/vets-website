// Node modules.
import { expect } from 'chai';
// Relative imports.
import App from '../containers/App';
import routes from './index';

describe('Routes', () => {
  it('should have the main route', () => {
    const expectedRoutes = {
      path: '/',
      component: App,
    };

    expect(routes).to.deep.equal(expectedRoutes);
  });
});
