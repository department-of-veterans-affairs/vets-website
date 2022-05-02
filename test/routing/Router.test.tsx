import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Link } from 'react-router-dom';
import FormRouter from '../../src/routing/Router';
import Page from '../../src/routing/Page';

describe.skip('Routing - Router', () => {
  test('can switch pages', () => {
    const { queryByText } = render(
      <FormRouter>
        <Page path="/my-page" title="My page">
          <div>I am a child!</div>
          <div>Me too!</div>
        </Page>

        <Page path="/" title="Intro page">
          <Link to="/my-page">Go to my page</Link>
        </Page>
      </FormRouter>
    );
    expect(queryByText(/Intro page/i)).not.toBeNull();
    expect(queryByText('My page')).toBeNull();

    userEvent.click(queryByText('Go to my page'));

    expect(queryByText('My page')).not.toBeNull();
    expect(queryByText('Intro page')).toBeNull();
  });
});
