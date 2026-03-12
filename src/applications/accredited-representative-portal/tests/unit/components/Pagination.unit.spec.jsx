import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Pagination from '../../../components/Pagination';

const meta = {
  page: {
    number: 1,
    size: 20,
    total: 24,
    totalPages: 2,
  },
};

describe('Pagination component', () => {
  it('renders va-pagination with expected defaults', () => {
    const routes = [
      {
        path: '/',
        element: <Pagination meta={meta} />,
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
    const pagination = container.querySelector('va-pagination');
    expect(pagination).to.exist;
    expect(pagination.getAttribute('page')).to.equal('1');
    expect(pagination.getAttribute('pages')).to.equal('2');

    expect(pagination.getAttribute('max-page-list-length')).to.equal('20');
  });
});
