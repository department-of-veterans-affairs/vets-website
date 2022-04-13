import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Link } from 'react-router-dom';
import Router from '../../src/routing/Router';
import Page from '../../src/routing/Page';

describe('Routing - Router', () => {
  test('can switch pages', () => {
    const { queryByText } = render(
      <Router>
        <Page path="/my-page" title="My page">
          <div>I am a child!</div>
          <div>Me too!</div>
        </Page>

        <Page path="/" title="Intro page">
          <Link to="/my-page">Go to my page</Link>
        </Page>
      </Router>
    );
    expect(queryByText(/Intro page/i)).not.toBeNull();
    expect(queryByText('My page')).toBeNull();

    userEvent.click(queryByText('Go to my page'));

    expect(queryByText('My page')).not.toBeNull();
    expect(queryByText('Intro page')).toBeNull();
  });
});
