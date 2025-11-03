import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as recordEventModule from 'platform/monitoring/record-event';
import ErrorBoundary from '../../components/ErrorBoundary';

describe('ErrorBoundary component', () => {
  context('with an error', () => {
    it('should render error message', async () => {
      const ComponentWithError = () => {
        throw new Error('Something bad');
      };
      const screen = render(
        <ErrorBoundary>
          <ComponentWithError />
        </ErrorBoundary>,
      );

      expect(
        await screen.findByText(
          /We’re sorry. There’s a problem with our system. Try refreshing this page. Or check back later./,
        ),
      ).to.exist;
    });

    let recordEventStub;
    it('should record a rendering error event', async () => {
      recordEventStub = sinon.stub(recordEventModule, 'default');

      const ComponentWithError = () => {
        throw new Error('Something bad');
      };
      render(
        <ErrorBoundary>
          <ComponentWithError />
        </ErrorBoundary>,
      );

      await waitFor(() => {
        const event = 'landing-page-rendering-error';
        expect(recordEventStub.calledWith({ event })).to.be.true;
      });

      recordEventStub.restore();
    });
  });

  it('should render children when no error', async () => {
    const ComponentWithoutError = () => {
      return <>Child content</>;
    };
    const screen = render(
      <ErrorBoundary>
        <ComponentWithoutError />
      </ErrorBoundary>,
    );

    expect(await screen.findByText(/Child content/)).to.exist;
  });

  context('with no children', () => {
    it('should render error message when children is null', async () => {
      const { container, queryByTestId } = render(
        <ErrorBoundary>{null}</ErrorBoundary>,
      );

      // Wait for the alert to be rendered
      await waitFor(() => {
        expect(queryByTestId('mhv-alert--mhv-registration')).to.exist;
      });

      // Check that the error message text is present in the container
      // Using Unicode escapes to match both straight apostrophe (\u0027) and curly apostrophe (\u2019)
      expect(container.textContent).to.match(/We[\u0027\u2019]re sorry/);
      expect(container.textContent).to.match(
        /There[\u0027\u2019]s a problem with our system/,
      );
      expect(container.textContent).to.include('Try refreshing this page');
      expect(container.textContent).to.include('Or check back later');
      expect(container.textContent).to.match(
        /You can[\u0027\u2019]t access My HealtheVet tools right now/,
      );
    });

    it('should render error message when children is undefined', async () => {
      const { container, queryByTestId } = render(
        <ErrorBoundary>{undefined}</ErrorBoundary>,
      );

      // Wait for the alert to be rendered
      await waitFor(() => {
        expect(queryByTestId('mhv-alert--mhv-registration')).to.exist;
      });

      // Check that the error message text is present in the container
      // Using Unicode escapes to match both straight apostrophe (\u0027) and curly apostrophe (\u2019)
      expect(container.textContent).to.match(/We[\u0027\u2019]re sorry/);
      expect(container.textContent).to.match(
        /There[\u0027\u2019]s a problem with our system/,
      );
      expect(container.textContent).to.include('Try refreshing this page');
      expect(container.textContent).to.include('Or check back later');
      expect(container.textContent).to.match(
        /You can[\u0027\u2019]t access My HealtheVet tools right now/,
      );
    });
  });

  context('error state persistence', () => {
    it('should persist error state after error is caught', async () => {
      const ComponentWithError = () => {
        throw new Error('Something bad');
      };
      const ComponentWithoutError = () => {
        return <>Child content</>;
      };

      const { rerender, container, queryByTestId, queryByText } = render(
        <ErrorBoundary>
          <ComponentWithError />
        </ErrorBoundary>,
      );

      // Wait for error message to appear
      await waitFor(() => {
        expect(queryByTestId('mhv-alert--mhv-registration')).to.exist;
      });
      // Using Unicode escapes to match both straight apostrophe (\u0027) and curly apostrophe (\u2019)
      expect(container.textContent).to.match(/We[\u0027\u2019]re sorry/);
      expect(container.textContent).to.match(
        /There[\u0027\u2019]s a problem with our system/,
      );

      // Try to re-render with a component that doesn't throw
      // Note: Error boundaries persist error state, so even with new children,
      // the error state should remain
      rerender(
        <ErrorBoundary>
          <ComponentWithoutError />
        </ErrorBoundary>,
      );

      // Error state should persist - error message should still be shown
      await waitFor(() => {
        expect(queryByTestId('mhv-alert--mhv-registration')).to.exist;
      });
      // Using Unicode escapes to match both straight apostrophe (\u0027) and curly apostrophe (\u2019)
      expect(container.textContent).to.match(/We[\u0027\u2019]re sorry/);
      expect(container.textContent).to.match(
        /There[\u0027\u2019]s a problem with our system/,
      );

      // Children should not be rendered
      expect(queryByText(/Child content/)).to.not.exist;
    });
  });
});
