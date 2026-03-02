import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Router, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history-v4';

import { convertLegacyRoutes } from '../../../src/js/routing/convertLegacyRoutes';

describe('convertLegacyRoutes', () => {
  function renderRoutes(routes, { path = '/', urlPrefix = '' } = {}) {
    const history = createMemoryHistory({ initialEntries: [path] });
    const converted = convertLegacyRoutes(routes, { urlPrefix });
    return {
      ...render(
        <Router history={history}>
          <Switch>{converted}</Switch>
        </Router>,
      ),
      history,
    };
  }

  it('should convert a basic route with component', () => {
    const PageComponent = () => <div data-testid="page">Page Content</div>;
    const routes = [{ path: 'my-page', component: PageComponent }];
    const { getByTestId } = renderRoutes(routes, { path: '/my-page' });

    expect(getByTestId('page')).to.exist;
  });

  it('should pass route config as route prop to component', () => {
    let receivedRoute;
    const PageComponent = (props) => {
      receivedRoute = props.route;
      return <div data-testid="page">Page</div>;
    };
    const routeConfig = {
      path: 'my-page',
      component: PageComponent,
      pageConfig: { name: 'test' },
      pageList: ['/page1', '/page2'],
    };
    renderRoutes([routeConfig], { path: '/my-page' });

    expect(receivedRoute).to.deep.equal(routeConfig);
    expect(receivedRoute.pageConfig).to.deep.equal({ name: 'test' });
    expect(receivedRoute.pageList).to.deep.equal(['/page1', '/page2']);
  });

  it('should pass formConfig on intro/review routes', () => {
    let receivedRoute;
    const IntroPage = (props) => {
      receivedRoute = props.route;
      return <div data-testid="intro">Intro</div>;
    };
    const routeConfig = {
      path: 'introduction',
      component: IntroPage,
      formConfig: { formId: '123' },
      pageList: ['/intro'],
    };
    renderRoutes([routeConfig], { path: '/introduction' });

    expect(receivedRoute.formConfig).to.deep.equal({ formId: '123' });
    expect(receivedRoute.pageConfig).to.be.undefined;
  });

  it('should handle catch-all route as redirect', () => {
    const FallbackPage = () => <div data-testid="fallback">Fallback</div>;
    const routes = [{ path: '/', component: FallbackPage }, { path: '*' }];
    const converted = convertLegacyRoutes(routes, { urlPrefix: '/form' });

    // Should have 2 elements: a Route and a Redirect
    expect(converted).to.have.length(2);
    // The catch-all should be a Redirect (type name check)
    expect(converted[1].props.to).to.equal('/form');
  });

  it('should handle onEnter redirect pattern', () => {
    const routes = [
      {
        path: '/',
        onEnter: (nextState, replace) => {
          replace('/introduction');
        },
      },
    ];
    const converted = convertLegacyRoutes(routes);

    expect(converted).to.have.length(1);
    expect(converted[0].props.to).to.equal('/introduction');
    expect(converted[0].props.from).to.equal('/');
  });

  it('should skip routes with no component and no onEnter', () => {
    const routes = [{ path: 'empty-route' }];
    const converted = convertLegacyRoutes(routes);

    expect(converted).to.have.length(0);
  });

  it('should apply urlPrefix to route paths', () => {
    const PageComponent = () => <div data-testid="page">Page</div>;
    const routes = [{ path: 'my-page', component: PageComponent }];
    const { getByTestId } = renderRoutes(routes, {
      path: '/form/my-page',
      urlPrefix: '/form',
    });

    expect(getByTestId('page')).to.exist;
  });

  it('should normalize double slashes in paths', () => {
    const PageComponent = () => <div data-testid="page">Page</div>;
    const routes = [{ path: '/my-page', component: PageComponent }];
    // urlPrefix + '/' + path could produce '/form//my-page'
    const { getByTestId } = renderRoutes(routes, {
      path: '/form/my-page',
      urlPrefix: '/form',
    });

    expect(getByTestId('page')).to.exist;
  });

  it('should make root path exact', () => {
    const RootPage = () => <div data-testid="root">Root</div>;
    const ChildPage = () => <div data-testid="child">Child</div>;
    const routes = [
      { path: '/', component: RootPage },
      { path: 'child', component: ChildPage },
    ];
    // When navigating to /child, root should NOT match (exact)
    const { queryByTestId, getByTestId } = renderRoutes(routes, {
      path: '/child',
    });

    expect(queryByTestId('root')).to.be.null;
    expect(getByTestId('child')).to.exist;
  });

  it('should provide react-router routeProps (match, location, history)', () => {
    let receivedProps;
    const PageComponent = (props) => {
      receivedProps = props;
      return <div>Page</div>;
    };
    const routes = [{ path: 'test-page', component: PageComponent }];
    renderRoutes(routes, { path: '/test-page' });

    expect(receivedProps.match).to.be.an('object');
    expect(receivedProps.location).to.be.an('object');
    expect(receivedProps.history).to.be.an('object');
  });

  it('should handle onEnter with default redirect when replace is not called', () => {
    const routes = [
      {
        path: '/',
        onEnter: () => {
          // onEnter that doesn't call replace
        },
      },
    ];
    const converted = convertLegacyRoutes(routes, { urlPrefix: '/my-app' });

    expect(converted[0].props.to).to.equal('/my-app');
  });

  it('should handle empty routeConfigs array', () => {
    const converted = convertLegacyRoutes([]);
    expect(converted).to.deep.equal([]);
  });

  it('should preserve unique keys for routes', () => {
    const Page1 = () => <div>1</div>;
    const Page2 = () => <div>2</div>;
    const routes = [
      { path: 'page-1', component: Page1 },
      { path: 'page-2', component: Page2 },
    ];
    const converted = convertLegacyRoutes(routes);

    const keys = converted.map((el) => el.key);
    expect(new Set(keys).size).to.equal(keys.length);
  });
});
