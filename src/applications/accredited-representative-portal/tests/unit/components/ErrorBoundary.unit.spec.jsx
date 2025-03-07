import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

// Mock the Header component
import * as Header from '../../../components/Header';
import ErrorBoundary from '../../../components/ErrorBoundary';

describe('ErrorBoundary', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(Header, 'default').returns(<div data-testid="mock-header" />);
  });

  afterEach(() => {
    sandbox.restore();
  });

  const getErrorBoundary = () => render(<ErrorBoundary />);

  it('renders error message', () => {
    const { getByTestId } = getErrorBoundary();
    expect(getByTestId('error-message')).to.exist;
  });
});
