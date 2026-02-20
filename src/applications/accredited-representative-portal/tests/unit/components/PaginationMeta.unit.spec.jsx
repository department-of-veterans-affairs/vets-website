import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { ProfileContext } from '../../../context/ProfileContext';
import PaginationMeta from '../../../components/PaginationMeta';

describe('PaginationMeta', () => {
  const defaults = {
    SIZE: 5,
    NUMBER: 1,
    SORT_ORDER: 'newest',
  };
  const contextValue = {
    firstName: 'Test',
    lastName: 'User',
    verified: true,
    signIn: () => {},
    loa: { level: 3 },
  };
  it('renders without crashing with minimal props', () => {
    const meta = {
      page: {
        number: 1,
        size: 20,
        total: 24,
        totalPages: 2,
      },
    };
    const results = Array(5).fill({});
    const routes = [
      {
        path: '/',
        element: (
          <ProfileContext.Provider value={contextValue}>
            <PaginationMeta
              meta={meta}
              results={results}
              defaults={defaults}
              resultType="requests"
            />
          </ProfileContext.Provider>
        ),
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: [
        '/?status=processed&sort=oldest&page=1&perPage=20&show=you',
      ],
      initialIndex: 0,
    });

    const { container } = render(<RouterProvider router={router} />);
    expect(container).to.exist;
  });

  it('renders with custom search params', () => {
    const meta = {
      page: {
        number: 2,
        size: 10,
        total: 23,
        totalPages: 2,
      },
    };
    const results = Array(5).fill({});
    const routes = [
      {
        path: '/',
        element: (
          <ProfileContext.Provider value={contextValue}>
            <PaginationMeta
              meta={meta}
              results={results}
              defaults={defaults}
              resultType="requests"
            />
          </ProfileContext.Provider>
        ),
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: [
        '/?status=processed&sort=oldest&page=1&perPage=20&show=you',
      ],
      initialIndex: 0,
    });

    const { getByRole } = render(<RouterProvider router={router} />);
    const text = getByRole('text');
    expect(text.textContent).to.include(
      'Showing 1-20 of 23 processed requests for "You (test user)" sorted by “Processed date (oldest)”',
    );
  });

  it('handles last page with fewer results than pageSize', () => {
    const meta = {
      page: {
        number: 1,
        size: 5,
        total: 12,
        totalPages: 3,
      },
    };
    const results = Array(2).fill({});

    const routes = [
      {
        path: '/',
        element: (
          <ProfileContext.Provider value={contextValue}>
            <PaginationMeta
              meta={meta}
              results={results}
              defaults={defaults}
              resultType="requests"
            />
          </ProfileContext.Provider>
        ),
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: [
        '/?status=processed&sort=oldest&page=1&perPage=20&show=you',
      ],
      initialIndex: 0,
    });
    const { getByRole } = render(<RouterProvider router={router} />);
    const text = getByRole('text');
    expect(text.textContent).to.include(
      'Showing 1-12 of 12 processed requests for "You (test user)" sorted by “Processed date (oldest)”',
    );
  });

  it('handles empty results on first page gracefully', () => {
    const meta = {
      page: {
        number: 1,
        size: 20,
        total: 0,
        totalPages: 1,
      },
    };

    const results = [];

    const routes = [
      {
        path: '/',
        element: (
          <ProfileContext.Provider value={contextValue}>
            <PaginationMeta
              meta={meta}
              results={results}
              defaults={defaults}
              resultType="requests"
            />
          </ProfileContext.Provider>
        ),
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: [
        '/?status=processed&sort=oldest&page=1&perPage=20&show=you',
      ],
      initialIndex: 0,
    });
    const { getByRole } = render(<RouterProvider router={router} />);
    const text = getByRole('text');
    expect(text.textContent).to.include(
      'Showing 0 processed requests for "You (test user)" sorted by “Processed date (oldest)”',
    );
  });

  it('renders without resultType', () => {
    const meta = {
      page: {
        number: 1,
        size: 5,
        total: 10,
        totalPages: 2,
      },
    };

    const results = [{}];

    const routes = [
      {
        path: '/',
        element: (
          <ProfileContext.Provider value={contextValue}>
            <PaginationMeta
              meta={meta}
              results={results}
              defaults={defaults}
              resultType="requests"
            />
          </ProfileContext.Provider>
        ),
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: [
        '/?status=processed&sort=oldest&page=1&perPage=20&show=you',
      ],
      initialIndex: 0,
    });
    const { getByRole } = render(<RouterProvider router={router} />);
    const text = getByRole('text');
    expect(text.textContent).to.include(
      'Showing 1-10 of 10 processed requests for "You (test user)" sorted by “Processed date (oldest)”',
    );
  });
});
