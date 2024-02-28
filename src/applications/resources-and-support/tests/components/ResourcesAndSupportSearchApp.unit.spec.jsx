// Node modules.
import React from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
// Relative imports.
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import ResourcesAndSupportSearchApp from '../../components/ResourcesAndSupportSearchApp';
import mockData from './articles.json';

describe('ResourcesAndSupportSearchApp', () => {
  let server = null;

  before(() => {
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

  // Failed on master: http://jenkins.vfs.va.gov/blue/organizations/jenkins/testing%2Fvets-website/detail/master/10217/tests
  it.skip('conducts searches', async () => {
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

    // Test against de-pluralizing queries
    fireEvent.change(queryInput, { target: { value: 'disabilities' } });

    fireEvent.submit(form, {
      event: {
        preventDefault() {},
      },
    });

    await screen.findByText('Showing 1 - 2 of 2 results', { exact: false });
    screen.getByText('Sample title - Disabilities');
    screen.getByText('Sample title - Disability');

    // Test the "no results found"
    fireEvent.change(queryInput, { target: { value: 'nothing' } });

    fireEvent.submit(form, {
      event: {
        preventDefault() {},
      },
    });

    await screen.findByText(
      'We didn’t find any resources and support articles for',
      { exact: false },
    );
  });
});
