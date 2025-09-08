// PaginationMeta.unit.spec.jsx
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PaginationMeta from '../../../components/PaginationMeta';

describe('PaginationMeta', () => {
  const defaults = {
    SIZE: 5,
    NUMBER: 1,
    SORT_ORDER: 'desc',
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
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          '/representative/poa-requests?pageSize=5&pageNumber=2&sortOrder=asc&status=processed',
        ]}
      >
        <PaginationMeta
          meta={meta}
          results={results}
          defaults={defaults}
          resultType="requests"
        />
      </MemoryRouter>,
    );

    expect(container).to.exist;
    expect(container.textContent).to.include('Showing');
    expect(container.textContent).to.include('sorted by');
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

    const { container } = render(
      <MemoryRouter
        initialEntries={[
          '/representative/poa-requests?pageSize=5&pageNumber=2&sortOrder=asc&status=processed',
        ]}
      >
        <PaginationMeta
          meta={meta}
          results={results}
          defaults={defaults}
          resultType="requests"
        />
      </MemoryRouter>,
    );

    expect(container.textContent).to.include(
      'Showing 6-10 of 23 processed requests',
    );
    expect(container.textContent).to.include('Processed date (oldest)');
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

    const { container } = render(
      <MemoryRouter
        initialEntries={[
          '/representative/poa-requests?pageSize=5&pageNumber=3&sortOrder=desc&status=processed',
        ]}
      >
        <PaginationMeta
          meta={meta}
          results={results}
          defaults={defaults}
          resultType="requests"
        />
      </MemoryRouter>,
    );

    expect(container.textContent).to.include(
      'Showing 11-12 of 12 processed requests',
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

    const { container } = render(
      <MemoryRouter
        initialEntries={[
          '/representative/poa-requests?pageSize=5&pageNumber=1&sortOrder=desc&status=pending',
        ]}
      >
        <PaginationMeta
          meta={meta}
          results={results}
          defaults={defaults}
          resultType="requests"
        />
      </MemoryRouter>,
    );

    expect(container.textContent).to.include('Showing 0 pending requests');
    expect(container.textContent).to.include('Submitted date (newest)');
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

    const { container } = render(
      <MemoryRouter
        initialEntries={[
          '/representative/poa-requests?pageSize=5&pageNumber=1&sortOrder=desc',
        ]}
      >
        <PaginationMeta meta={meta} results={results} defaults={defaults} />
      </MemoryRouter>,
    );

    expect(container.textContent).to.include('Showing 1-5 of 10');
  });
});
