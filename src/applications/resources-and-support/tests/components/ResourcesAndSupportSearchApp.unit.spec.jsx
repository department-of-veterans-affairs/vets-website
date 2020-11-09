import React from 'react';
import ReactDOM from 'react-dom';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { fireEvent } from '@testing-library/react';

import { resetFetch } from 'platform/testing/unit/helpers';

import mockData from './articles.json';

import ResourcesAndSupportSearchApp from '../../components/ResourcesAndSupportSearchApp';
import { expect } from 'chai';

describe('ResourcesAndSupportSearchApp', () => {
  let server = null;

  before(() => {
    resetFetch();
    server = setupServer(
      rest.get(
        `http://localhost/resources/search/articles.json`,
        (req, res, ctx) => {
          return res(ctx.json(mockData));
        },
      ),
    );
    server.listen();
  });

  after(() => server.close());

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ResourcesAndSupportSearchApp />, div);
  });

  it('conducts searches', async () => {
    const screen = renderInReduxProvider(<ResourcesAndSupportSearchApp />);
    const queryInput = await screen.findByLabelText(
      'Enter a keyword, phrase, or question',
    );
    const form = screen.getByTestId('resources-support-search');

    fireEvent.change(queryInput, { target: { value: 'health' } });

    fireEvent.submit(form, {
      event: {
        preventDefault() {},
      },
    });

    await screen.getByText('Showing 1 - 10 of 12 results', { exact: false });

    const results = screen.getAllByText('Sample title - Health', {
      exact: false,
    });

    expect(results.length).to.be.equal(10);

    fireEvent.change(queryInput, { target: { value: 'disabilities' } });

    fireEvent.submit(form, {
      event: {
        preventDefault() {},
      },
    });

    await screen.findByText('Showing 1 - 2 of 2 results', { exact: false });
    screen.getByText('Sample title - Disabilities');
    screen.getByText('Sample title - Disability');
  });
});
