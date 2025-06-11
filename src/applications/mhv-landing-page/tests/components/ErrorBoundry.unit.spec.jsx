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
});
