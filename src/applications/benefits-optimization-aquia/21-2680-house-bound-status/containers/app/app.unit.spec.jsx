/**
 * @module tests/containers/app.unit.spec
 * @description Unit tests for App container component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { App } from './app';

describe('App', () => {
  let RoutedSavableAppStub;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Mock RoutedSavableApp to avoid router context requirements
    RoutedSavableAppStub = sandbox
      .stub()
      .callsFake(({ children }) => (
        <div data-testid="routed-savable-app">{children}</div>
      ));

    // Replace the import with our stub
    const Module = require('platform/forms/save-in-progress/RoutedSavableApp');
    Module.default = RoutedSavableAppStub;
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Component Export', () => {
    it('should export App component', () => {
      expect(App).to.exist;
      expect(App).to.be.a('function');
    });

    it('should be a valid React component', () => {
      expect(App.name).to.equal('App');
    });
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const location = { pathname: '/introduction' };
      const { container } = render(
        <App location={location}>
          <div>Test Child</div>
        </App>,
      );
      expect(container).to.exist;
    });

    it('should render children', () => {
      const location = { pathname: '/introduction' };
      const { getByText } = render(
        <App location={location}>
          <div>Test Child Content</div>
        </App>,
      );
      expect(getByText('Test Child Content')).to.exist;
    });

    it('should render with different location paths', () => {
      const location = { pathname: '/veteran-information' };
      const { getByText } = render(
        <App location={location}>
          <div>Content</div>
        </App>,
      );
      expect(getByText('Content')).to.exist;
    });

    it('should render with undefined location', () => {
      const { container } = render(
        <App>
          <div>Content</div>
        </App>,
      );
      expect(container).to.exist;
    });

    it('should render without children', () => {
      const location = { pathname: '/introduction' };
      const { container } = render(<App location={location} />);
      expect(container).to.exist;
    });

    it('should render multiple children', () => {
      const location = { pathname: '/introduction' };
      const { getByText } = render(
        <App location={location}>
          <div>Child 1</div>
          <div>Child 2</div>
        </App>,
      );
      expect(getByText('Child 1')).to.exist;
      expect(getByText('Child 2')).to.exist;
    });
  });

  describe('Props', () => {
    it('should accept location prop with pathname', () => {
      const location = { pathname: '/test' };
      const { container } = render(
        <App location={location}>
          <div>Child</div>
        </App>,
      );
      expect(container).to.exist;
    });

    it('should accept location prop with search params', () => {
      const location = { pathname: '/test', search: '?foo=bar' };
      const { container } = render(
        <App location={location}>
          <div>Child</div>
        </App>,
      );
      expect(container).to.exist;
    });

    it('should accept children prop', () => {
      const location = { pathname: '/test' };
      const { getByText } = render(
        <App location={location}>
          <div>Test Child Element</div>
        </App>,
      );
      expect(getByText('Test Child Element')).to.exist;
    });
  });
});
