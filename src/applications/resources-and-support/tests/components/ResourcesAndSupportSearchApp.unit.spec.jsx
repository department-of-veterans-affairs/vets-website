import React from 'react';
import ReactDOM from 'react-dom';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { render, fireEvent } from '@testing-library/react'

import { resetFetch } from 'platform/testing/unit/helpers';
import environment from 'platform/utilities/environment';

import mockData from './articles.json';

import ResourcesAndSupportSearchApp from '../../components/ResourcesAndSupportSearchApp';

describe('ResourcesAndSupportSearchApp', () => {
  let server = null;

  before(() => {
    resetFetch();
    server = setupServer(
      rest.get(
        `http://localhost/resources/search/articles.json`,
        (req, res, ctx) => {
          return res(
            ctx.json(mockData),
          );
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
    const queryInput = await screen.findByLabelText('Enter a keyword, phrase, or question');
    fireEvent.change(queryInput, { target: { value: 'disabilities' }});

    const form = screen.getByTestId('resources-support-search');
    fireEvent.submit(form, {
      event: {
        preventDefault(){}
      }
    });
  });
});
