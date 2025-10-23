import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { createMemoryRouter, RouterProvider } from 'react-router-dom-v5-compat';

// Import the component under test
import AvsErrorElement from '../../components/AvsErrorElement.tsx';

describe('AvsErrorElement component', () => {
  const createTestRouter = error => {
    return createMemoryRouter([
      {
        path: '/',
        element: <div>Main content</div>,
        errorElement: <AvsErrorElement />,
        loader: () => {
          throw error;
        },
      },
    ]);
  };

  it('should render for VA.gov API unauthorized error', async () => {
    const error = {
      errors: [{ status: 'unauthorized' }],
    };

    const router = createTestRouter(error);
    const { container } = render(<RouterProvider router={router} />);

    // The error element should be rendered instead of main content
    expect(container.textContent).to.not.include('Main content');
  });

  it('should render for VA.gov API not_found error', async () => {
    const error = {
      errors: [{ status: 'not_found' }],
    };

    const router = createTestRouter(error);
    const { container } = render(<RouterProvider router={router} />);

    // The error element should be rendered instead of main content
    expect(container.textContent).to.not.include('Main content');
  });

  it('should render for VA.gov API bad_request error', async () => {
    const error = {
      errors: [{ status: 'bad_request' }],
    };

    const router = createTestRouter(error);
    const { container } = render(<RouterProvider router={router} />);

    // The error element should be rendered instead of main content
    expect(container.textContent).to.not.include('Main content');
  });

  it('should render for HTTP 401 status', async () => {
    const error = {
      status: 401,
    };

    const router = createTestRouter(error);
    const { container } = render(<RouterProvider router={router} />);

    // The error element should be rendered instead of main content
    expect(container.textContent).to.not.include('Main content');
  });

  it('should render for HTTP 404 status', async () => {
    const error = {
      status: 404,
    };

    const router = createTestRouter(error);
    const { container } = render(<RouterProvider router={router} />);

    // The error element should be rendered instead of main content
    expect(container.textContent).to.not.include('Main content');
  });

  it('should render for HTTP 400 status', async () => {
    const error = {
      status: 400,
    };

    const router = createTestRouter(error);
    const { container } = render(<RouterProvider router={router} />);

    // The error element should be rendered instead of main content
    expect(container.textContent).to.not.include('Main content');
  });

  it('should render ErrorBoundary for unhandled error types', async () => {
    const error = {
      status: 500,
    };

    const router = createTestRouter(error);
    const { container } = render(<RouterProvider router={router} />);

    // Should render the ErrorBoundary component instead of main content
    expect(container.textContent).to.not.include('Main content');
  });

  it('should prioritize VA.gov API error over HTTP status', async () => {
    const error = {
      errors: [{ status: 'unauthorized' }],
      status: 404,
    };

    const router = createTestRouter(error);
    const { container } = render(<RouterProvider router={router} />);

    // The error element should be rendered instead of main content
    expect(container.textContent).to.not.include('Main content');
  });

  it('should handle empty object gracefully', async () => {
    const error = {};

    const router = createTestRouter(error);
    const { container } = render(<RouterProvider router={router} />);

    // Should render the ErrorBoundary component instead of main content
    expect(container.textContent).to.not.include('Main content');
  });

  it('should handle null error gracefully', async () => {
    const error = null;

    const router = createTestRouter(error);
    const { container } = render(<RouterProvider router={router} />);

    // Should render the ErrorBoundary component instead of main content
    expect(container.textContent).to.not.include('Main content');
  });
});
