import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history-v4';

import {
  parseQuery,
  withRouterV5Compat,
} from '../../../src/js/routing/v5-compatibility';

describe('v5-compatibility', () => {
  describe('parseQuery', () => {
    it('should parse single-value query params', () => {
      const result = parseQuery('?foo=1&bar=2');
      expect(result).to.deep.equal({ foo: '1', bar: '2' });
    });

    it('should parse repeated keys as arrays', () => {
      const result = parseQuery('?foo=1&foo=2');
      expect(result).to.deep.equal({ foo: ['1', '2'] });
    });

    it('should return empty object for empty search', () => {
      expect(parseQuery('')).to.deep.equal({});
    });

    it('should handle params with no value', () => {
      const result = parseQuery('?foo=&bar');
      expect(result.foo).to.equal('');
      expect(result.bar).to.equal('');
    });

    it('should handle mixed single and repeated keys', () => {
      const result = parseQuery('?a=1&b=2&b=3&c=4');
      expect(result).to.deep.equal({ a: '1', b: ['2', '3'], c: '4' });
    });
  });

  describe('withRouterV5Compat', () => {
    function renderWithRouter(ui, { path = '/', search = '' } = {}) {
      const history = createMemoryHistory({
        initialEntries: [{ pathname: path, search }],
      });
      return {
        ...render(<Router history={history}>{ui}</Router>),
        history,
      };
    }

    it('should provide router.push from history', () => {
      let receivedRouter;
      const TestComponent = props => {
        receivedRouter = props.router;
        return <div>test</div>;
      };
      const Wrapped = withRouterV5Compat(TestComponent);
      const { history } = renderWithRouter(<Wrapped />);

      expect(receivedRouter.push).to.be.a('function');
      receivedRouter.push('/new-path');
      expect(history.location.pathname).to.equal('/new-path');
    });

    it('should provide router.replace from history', () => {
      let receivedRouter;
      const TestComponent = props => {
        receivedRouter = props.router;
        return <div>test</div>;
      };
      const Wrapped = withRouterV5Compat(TestComponent);
      const { history } = renderWithRouter(<Wrapped />);

      receivedRouter.replace('/replaced');
      expect(history.location.pathname).to.equal('/replaced');
    });

    it('should provide location with synthesized query', () => {
      let receivedLocation;
      const TestComponent = props => {
        receivedLocation = props.location;
        return <div>test</div>;
      };
      const Wrapped = withRouterV5Compat(TestComponent);
      renderWithRouter(<Wrapped />, { search: '?page=2&status=active' });

      expect(receivedLocation.query).to.deep.equal({
        page: '2',
        status: 'active',
      });
    });

    it('should provide location.basename from route.urlPrefix', () => {
      let receivedLocation;
      const TestComponent = props => {
        receivedLocation = props.location;
        return <div>test</div>;
      };
      const Wrapped = withRouterV5Compat(TestComponent);
      const route = { urlPrefix: '/my-form' };
      renderWithRouter(<Wrapped route={route} />);

      expect(receivedLocation.basename).to.equal('/my-form');
    });

    it('should provide location.basename from formConfig.urlPrefix', () => {
      let receivedLocation;
      const TestComponent = props => {
        receivedLocation = props.location;
        return <div>test</div>;
      };
      const Wrapped = withRouterV5Compat(TestComponent);
      const formConfig = { urlPrefix: '/form-prefix' };
      renderWithRouter(<Wrapped formConfig={formConfig} />);

      expect(receivedLocation.basename).to.equal('/form-prefix');
    });

    it('should forward route prop to wrapped component', () => {
      let receivedRoute;
      const TestComponent = props => {
        receivedRoute = props.route;
        return <div>test</div>;
      };
      const Wrapped = withRouterV5Compat(TestComponent);
      const route = { pageConfig: { some: 'config' }, pageList: ['/page1'] };
      renderWithRouter(<Wrapped route={route} />);

      expect(receivedRoute).to.deep.equal(route);
    });

    it('should provide params prop', () => {
      let receivedParams;
      const TestComponent = props => {
        receivedParams = props.params;
        return <div>test</div>;
      };
      const Wrapped = withRouterV5Compat(TestComponent);
      renderWithRouter(<Wrapped />);

      expect(receivedParams).to.be.an('object');
    });

    it('should provide router.params', () => {
      let receivedRouter;
      const TestComponent = props => {
        receivedRouter = props.router;
        return <div>test</div>;
      };
      const Wrapped = withRouterV5Compat(TestComponent);
      renderWithRouter(<Wrapped />);

      expect(receivedRouter.params).to.be.an('object');
    });

    it('should provide router.goBack', () => {
      let receivedRouter;
      const TestComponent = props => {
        receivedRouter = props.router;
        return <div>test</div>;
      };
      const Wrapped = withRouterV5Compat(TestComponent);
      renderWithRouter(<Wrapped />);

      expect(receivedRouter.goBack).to.be.a('function');
    });

    it('should provide router.go', () => {
      let receivedRouter;
      const TestComponent = props => {
        receivedRouter = props.router;
        return <div>test</div>;
      };
      const Wrapped = withRouterV5Compat(TestComponent);
      renderWithRouter(<Wrapped />);

      expect(receivedRouter.go).to.be.a('function');
    });

    it('should provide setRouteLeaveHook as a no-op', () => {
      let receivedRouter;
      const TestComponent = props => {
        receivedRouter = props.router;
        return <div>test</div>;
      };
      const Wrapped = withRouterV5Compat(TestComponent);
      renderWithRouter(<Wrapped />);

      expect(receivedRouter.setRouteLeaveHook).to.be.a('function');
      // Should not throw
      receivedRouter.setRouteLeaveHook({}, () => {});
    });

    it('should set displayName', () => {
      const TestComponent = () => <div />;
      TestComponent.displayName = 'MyComponent';
      const Wrapped = withRouterV5Compat(TestComponent);
      expect(Wrapped.displayName).to.equal('withRouterV5Compat(MyComponent)');
    });

    it('should expose WrappedComponent', () => {
      const TestComponent = () => <div />;
      const Wrapped = withRouterV5Compat(TestComponent);
      expect(Wrapped.WrappedComponent).to.equal(TestComponent);
    });

    it('should forward additional props', () => {
      let receivedProps;
      const TestComponent = props => {
        receivedProps = props;
        return <div>test</div>;
      };
      const Wrapped = withRouterV5Compat(TestComponent);
      renderWithRouter(<Wrapped customProp="hello" anotherProp={42} />);

      expect(receivedProps.customProp).to.equal('hello');
      expect(receivedProps.anotherProp).to.equal(42);
    });

    it('should support router.push with object argument', () => {
      let receivedRouter;
      const TestComponent = props => {
        receivedRouter = props.router;
        return <div>test</div>;
      };
      const Wrapped = withRouterV5Compat(TestComponent);
      const { history } = renderWithRouter(<Wrapped />);

      receivedRouter.push({ pathname: '/contact', state: { from: 'form' } });
      expect(history.location.pathname).to.equal('/contact');
      expect(history.location.state).to.deep.equal({ from: 'form' });
    });
  });
});
