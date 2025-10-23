import { expect } from 'chai';
import route from '../../routes';
import App from '../../containers/App';
import formConfig from '../../config/form';

describe('21P-601 routes', () => {
  it('exports a route object', () => {
    expect(route).to.exist;
    expect(route).to.be.an('object');
  });

  it('has correct path', () => {
    expect(route.path).to.equal('/');
  });

  it('uses App as component', () => {
    expect(route.component).to.equal(App);
  });

  it('has indexRoute with onEnter function', () => {
    expect(route.indexRoute).to.exist;
    expect(route.indexRoute.onEnter).to.be.a('function');
  });

  it('redirects to introduction page on root', () => {
    let redirectPath;
    const mockReplace = path => {
      redirectPath = path;
    };

    route.indexRoute.onEnter({}, mockReplace);
    expect(redirectPath).to.equal('/introduction');
  });

  it('has childRoutes', () => {
    expect(route.childRoutes).to.exist;
    expect(route.childRoutes).to.be.an('array');
  });

  it('childRoutes include form pages', () => {
    expect(route.childRoutes.length).to.be.greaterThan(0);
  });

  it('uses correct form config for child routes', () => {
    expect(formConfig).to.exist;
    expect(formConfig.formId).to.equal('21P-601');
  });
});
