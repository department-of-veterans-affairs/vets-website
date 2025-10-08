import { expect } from 'chai';
import sinon from 'sinon';
import route from '../../routes';
import App from '../../containers/App';

describe('21P-0537 routes', () => {
  it('exports a route object', () => {
    expect(route).to.be.an('object');
  });

  it('has correct root path', () => {
    expect(route.path).to.equal('/');
  });

  it('uses App component', () => {
    expect(route.component).to.equal(App);
  });

  it('has indexRoute configuration', () => {
    expect(route.indexRoute).to.exist;
    expect(route.indexRoute).to.have.property('onEnter');
  });

  it('indexRoute redirects to introduction', () => {
    const replaceSpy = sinon.spy();
    const nextState = {};

    route.indexRoute.onEnter(nextState, replaceSpy);

    expect(replaceSpy.calledOnce).to.be.true;
    expect(replaceSpy.calledWith('/introduction')).to.be.true;
  });

  it('has childRoutes array', () => {
    expect(route.childRoutes).to.exist;
    expect(route.childRoutes).to.be.an('array');
  });

  it('childRoutes includes save in progress routes', () => {
    // childRoutes are created from formConfig using createRoutesWithSaveInProgress
    expect(route.childRoutes.length).to.be.greaterThan(0);
  });
});
