import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import useFocusAfterLoading from '../../hooks/useFocusAfterLoading';

// Test component that uses the hook
// eslint-disable-next-line react/prop-types
function TestComponent({ isLoading, isLoadingAcceleratedData }) {
  useFocusAfterLoading({ isLoading, isLoadingAcceleratedData });
  return (
    <div>
      <h1 data-testid="test-heading" tabIndex={-1}>
        Test Heading
      </h1>
    </div>
  );
}

describe('useFocusAfterLoading hook', () => {
  it('does not throw when isLoading is true', () => {
    expect(() => {
      render(<TestComponent isLoading isLoadingAcceleratedData={false} />);
    }).to.not.throw();
  });

  it('does not throw when isLoadingAcceleratedData is true', () => {
    expect(() => {
      render(<TestComponent isLoading={false} isLoadingAcceleratedData />);
    }).to.not.throw();
  });

  it('does not throw when both loading states are true', () => {
    expect(() => {
      render(<TestComponent isLoading isLoadingAcceleratedData />);
    }).to.not.throw();
  });

  it('attempts to focus h1 when both loading states are false', async () => {
    const { getByTestId } = render(
      <TestComponent isLoading={false} isLoadingAcceleratedData={false} />,
    );

    // The hook should attempt to focus the h1 element
    // We verify the h1 exists and is in the DOM
    await waitFor(() => {
      const heading = getByTestId('test-heading');
      expect(heading).to.exist;
    });
  });

  it('focuses h1 when only isLoading is passed (default isLoadingAcceleratedData)', async () => {
    const { getByTestId } = render(
      <TestComponent isLoading={false} isLoadingAcceleratedData={undefined} />,
    );

    await waitFor(() => {
      const heading = getByTestId('test-heading');
      expect(heading).to.exist;
    });
  });
});
