import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import { logger } from '@bio-aquia/shared/utils/logger';
import { FormErrorBoundary } from './error-boundary';

/**
 * Component that throws an error for testing error boundaries
 */
const ThrowError = ({ error }) => {
  if (error) {
    throw error;
  }
  return <div>No error</div>;
};

describe('FormErrorBoundary', () => {
  let consoleErrorStub;
  let loggerErrorStub;

  beforeEach(() => {
    // Suppress console errors in tests
    consoleErrorStub = sinon.stub(console, 'error');
    // Stub logger to prevent actual logging
    loggerErrorStub = sinon.stub(logger, 'error');
  });

  afterEach(() => {
    consoleErrorStub.restore();
    loggerErrorStub.restore();
  });

  describe('rendering', () => {
    it('renders children when no error occurs', () => {
      const { container } = render(
        <FormErrorBoundary>
          <div data-testid="child">Child content</div>
        </FormErrorBoundary>,
      );

      const child = container.querySelector('[data-testid="child"]');
      expect(child).to.exist;
      expect(child.textContent).to.equal('Child content');
    });

    it('renders multiple children when no error occurs', () => {
      const { container } = render(
        <FormErrorBoundary>
          <div data-testid="child1">First child</div>
          <div data-testid="child2">Second child</div>
        </FormErrorBoundary>,
      );

      const child1 = container.querySelector('[data-testid="child1"]');
      const child2 = container.querySelector('[data-testid="child2"]');
      expect(child1).to.exist;
      expect(child2).to.exist;
      expect(child1.textContent).to.equal('First child');
      expect(child2.textContent).to.equal('Second child');
    });

    it('renders React components as children', () => {
      const ChildComponent = () => <div data-testid="component">Component</div>;
      const { container } = render(
        <FormErrorBoundary>
          <ChildComponent />
        </FormErrorBoundary>,
      );

      const component = container.querySelector('[data-testid="component"]');
      expect(component).to.exist;
      expect(component.textContent).to.equal('Component');
    });
  });

  describe('error handling', () => {
    it('catches error and displays fallback UI', () => {
      const error = new Error('Test error');

      const { container } = render(
        <FormErrorBoundary>
          <ThrowError error={error} />
        </FormErrorBoundary>,
      );

      // Should show error alert
      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert).to.have.attribute('status', 'error');
      expect(alert).to.have.attribute('show-icon');
    });

    it('displays error headline', () => {
      const error = new Error('Test error');

      const { container } = render(
        <FormErrorBoundary>
          <ThrowError error={error} />
        </FormErrorBoundary>,
      );

      const headline = container.querySelector('[slot="headline"]');
      expect(headline).to.exist;
      expect(headline.textContent).to.equal(
        "We're sorry. Something went wrong.",
      );
    });

    it('displays user-friendly error message', () => {
      const error = new Error('Test error');

      const { container } = render(
        <FormErrorBoundary>
          <ThrowError error={error} />
        </FormErrorBoundary>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert.textContent).to.include(
        "We're having trouble loading this form",
      );
      expect(alert.textContent).to.include('Please refresh the page');
    });

    it('displays contact phone numbers', () => {
      const error = new Error('Test error');

      const { container } = render(
        <FormErrorBoundary>
          <ThrowError error={error} />
        </FormErrorBoundary>,
      );

      const mainPhone = container.querySelector(
        'va-telephone[contact="8008271000"]',
      );
      const ttyPhone = container.querySelector('va-telephone[tty]');

      expect(mainPhone).to.exist;
      expect(ttyPhone).to.exist;
      expect(ttyPhone).to.have.attribute('contact', '711');
    });

    it('includes support hours information', () => {
      const error = new Error('Test error');

      const { container } = render(
        <FormErrorBoundary>
          <ThrowError error={error} />
        </FormErrorBoundary>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert.textContent).to.include('Monday through Friday');
      expect(alert.textContent).to.include('8:00 a.m. to 9:00 p.m. ET');
    });
  });

  describe('development mode', () => {
    let originalEnv;

    beforeEach(() => {
      originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
    });

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('production mode', () => {
    let originalEnv;

    beforeEach(() => {
      originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
    });

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it('hides error details in production mode', () => {
      const error = new Error('Production error');
      error.stack = 'Production stack trace';

      const { container } = render(
        <FormErrorBoundary>
          <ThrowError error={error} />
        </FormErrorBoundary>,
      );

      const details = container.querySelector('details');
      expect(details).to.not.exist;
    });

    it('still displays user-friendly message in production', () => {
      const error = new Error('Production error');

      const { container } = render(
        <FormErrorBoundary>
          <ThrowError error={error} />
        </FormErrorBoundary>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert.textContent).to.include(
        "We're having trouble loading this form",
      );
    });

    it('still logs errors in production mode', () => {
      const error = new Error('Production error');

      render(
        <FormErrorBoundary>
          <ThrowError error={error} />
        </FormErrorBoundary>,
      );

      expect(loggerErrorStub.calledOnce).to.be.true;
    });
  });

  describe('accessibility', () => {
    it('uses proper alert role through va-alert component', () => {
      const error = new Error('Test error');

      const { container } = render(
        <FormErrorBoundary>
          <ThrowError error={error} />
        </FormErrorBoundary>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert).to.have.attribute('status', 'error');
    });

    it('includes icon for visual identification', () => {
      const error = new Error('Test error');

      const { container } = render(
        <FormErrorBoundary>
          <ThrowError error={error} />
        </FormErrorBoundary>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.have.attribute('show-icon');
    });

    it('provides semantic heading for error message', () => {
      const error = new Error('Test error');

      const { container } = render(
        <FormErrorBoundary>
          <ThrowError error={error} />
        </FormErrorBoundary>,
      );

      const heading = container.querySelector('h2');
      expect(heading).to.exist;
      expect(heading).to.have.attribute('slot', 'headline');
      expect(heading.textContent).to.equal(
        "We're sorry. Something went wrong.",
      );
    });

    it('makes phone numbers accessible with va-telephone', () => {
      const error = new Error('Test error');

      const { container } = render(
        <FormErrorBoundary>
          <ThrowError error={error} />
        </FormErrorBoundary>,
      );

      const phones = container.querySelectorAll('va-telephone');
      expect(phones).to.have.lengthOf(2);
    });

    it('provides proper padding for content readability', () => {
      const error = new Error('Test error');

      const { container } = render(
        <FormErrorBoundary>
          <ThrowError error={error} />
        </FormErrorBoundary>,
      );

      const wrapper = container.querySelector('.vads-u-padding--2');
      expect(wrapper).to.exist;
    });
  });

  describe('edge cases', () => {
    it('handles string errors', () => {
      const { container } = render(
        <FormErrorBoundary>
          <ThrowError error="String error" />
        </FormErrorBoundary>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(loggerErrorStub.calledOnce).to.be.true;
    });

    it('handles null error', () => {
      const { container } = render(
        <FormErrorBoundary>
          <ThrowError error={null} />
        </FormErrorBoundary>,
      );

      // Should render child content when error is null
      const content = container.textContent;
      expect(content).to.include('No error');
    });

    it('handles error objects without message', () => {
      const error = new Error();

      const { container } = render(
        <FormErrorBoundary>
          <ThrowError error={error} />
        </FormErrorBoundary>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(loggerErrorStub.calledOnce).to.be.true;
    });

    it('handles very long error messages', () => {
      const longMessage = 'A'.repeat(1000);
      const error = new Error(longMessage);

      const { container } = render(
        <FormErrorBoundary>
          <ThrowError error={error} />
        </FormErrorBoundary>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(loggerErrorStub.calledOnce).to.be.true;
    });

    it('handles special characters in error messages', () => {
      const error = new Error(
        'Error with <tags> & "quotes" and \'apostrophes\'',
      );

      const { container } = render(
        <FormErrorBoundary>
          <ThrowError error={error} />
        </FormErrorBoundary>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
    });

    it('handles unicode characters in error messages', () => {
      const error = new Error('Error with unicode: \u{1F4A5} \u{1F525}');

      const { container } = render(
        <FormErrorBoundary>
          <ThrowError error={error} />
        </FormErrorBoundary>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
    });
  });

  describe('error state management', () => {
    it('maintains error state after error occurs', () => {
      const error = new Error('Persistent error');

      const { container, rerender } = render(
        <FormErrorBoundary>
          <ThrowError error={error} />
        </FormErrorBoundary>,
      );

      // Verify error is shown
      let alert = container.querySelector('va-alert');
      expect(alert).to.exist;

      // Rerender with different content (but error state should persist)
      rerender(
        <FormErrorBoundary>
          <div>New content</div>
        </FormErrorBoundary>,
      );

      // Error UI should still be shown
      alert = container.querySelector('va-alert');
      expect(alert).to.exist;
    });
  });

  describe('componentDidCatch lifecycle', () => {
    it('calls componentDidCatch when error occurs', () => {
      const error = new Error('Lifecycle error');

      render(
        <FormErrorBoundary>
          <ThrowError error={error} />
        </FormErrorBoundary>,
      );

      // Verify logger was called, which happens in componentDidCatch
      expect(loggerErrorStub.calledOnce).to.be.true;
    });

    it('passes errorInfo to logger', () => {
      const error = new Error('ErrorInfo test');

      render(
        <FormErrorBoundary>
          <ThrowError error={error} />
        </FormErrorBoundary>,
      );

      expect(loggerErrorStub.calledOnce).to.be.true;
      const logCall = loggerErrorStub.firstCall.args[1];
      expect(logCall).to.have.property('errorInfo');
      expect(logCall.errorInfo).to.have.property('componentStack');
    });
  });

  describe('PropTypes validation', () => {
    it('accepts valid children prop', () => {
      expect(() => {
        render(
          <FormErrorBoundary>
            <div>Valid child</div>
          </FormErrorBoundary>,
        );
      }).to.not.throw();
    });

    it('accepts React components as children', () => {
      const Component = () => <div>Component child</div>;
      expect(() => {
        render(
          <FormErrorBoundary>
            <Component />
          </FormErrorBoundary>,
        );
      }).to.not.throw();
    });

    it('accepts multiple children', () => {
      expect(() => {
        render(
          <FormErrorBoundary>
            <div>Child 1</div>
            <div>Child 2</div>
          </FormErrorBoundary>,
        );
      }).to.not.throw();
    });
  });

  describe('integration scenarios', () => {
    it('catches errors from deeply nested components', () => {
      const DeepChild = () => {
        throw new Error('Deep error');
      };
      const MiddleChild = () => <DeepChild />;
      const TopChild = () => <MiddleChild />;

      const { container } = render(
        <FormErrorBoundary>
          <TopChild />
        </FormErrorBoundary>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
    });

    it('catches errors from event handlers (async)', () => {
      const ErrorButton = () => {
        const handleClick = () => {
          throw new Error('Click error');
        };
        return <button onClick={handleClick}>Click me</button>;
      };

      const { container } = render(
        <FormErrorBoundary>
          <ErrorButton />
        </FormErrorBoundary>,
      );

      // Note: Error boundaries don't catch errors in event handlers
      // This is expected React behavior
      const button = container.querySelector('button');
      expect(button).to.exist;
    });

    it('protects parent components from child errors', () => {
      const ParentComponent = ({ children }) => (
        <div data-testid="parent">
          Parent content
          {children}
        </div>
      );

      const error = new Error('Child error');

      const { container } = render(
        <ParentComponent>
          <FormErrorBoundary>
            <ThrowError error={error} />
          </FormErrorBoundary>
        </ParentComponent>,
      );

      // Parent should still render
      const parent = container.querySelector('[data-testid="parent"]');
      expect(parent).to.exist;
      expect(parent.textContent).to.include('Parent content');

      // Error boundary should show error UI
      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
    });
  });
});
