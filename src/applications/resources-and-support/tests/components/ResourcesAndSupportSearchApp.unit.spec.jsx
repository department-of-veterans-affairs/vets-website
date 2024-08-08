import React from 'react';
import ReactDOM from 'react-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
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

  it('creates a landmark for the search form', async () => {
    const screen = renderInReduxProvider(<ResourcesAndSupportSearchApp />);
    await screen.findByText('Enter a keyword, phrase, or question');
  });
});
