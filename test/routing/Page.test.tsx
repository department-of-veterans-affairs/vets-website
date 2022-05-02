import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Link, Route, Router } from 'react-router-dom';
import Page from '../../src/routing/Page';
import Chapter from '../../src/routing/Chapter';
import { createMemoryHistory } from 'history';

describe.skip('Routing - Page', () => {
  test('is navigable without Chapter components', () => {
    const history = createMemoryHistory({
      initialEntries: ['/'],
    });
    const { queryByText } = render(
      <Router history={history}>
        <Page path="/my-page" title="My page">
          <div>I am a child!</div>
          <div>Me too!</div>
        </Page>

        <Route exact path="/">
          <h1>Intro page</h1>
          <Link to="my-page">Go to my page</Link>
        </Route>
      </Router>
    );
    expect(queryByText(/Intro page/i)).not.toBeNull();
    expect(queryByText('My page')).toBeNull();
    expect(history.entries[0].pathname).toEqual('/');

    userEvent.click(queryByText('Go to my page'));

    expect(queryByText('My page')).not.toBeNull();
    expect(queryByText('Intro page')).toBeNull();
    expect(history.entries[1].pathname).toEqual('/my-page');
  });

  test('it can navigate between Pages within a Chapter', () => {
    const history = createMemoryHistory({
      initialEntries: ['/chapter-one/page-one'],
    });
    const { queryByText } = render(
      <Router history={history}>
        <Chapter title="Chapter One" path="/chapter-one">
          <Page title="First Page" path="/page-one">
            <div>Page 1</div>
            <Link to="/chapter-one/page-two">Page two link</Link>
          </Page>
          <Page title="Second Page" path="/page-two">
            <div>Page 2</div>
          </Page>
        </Chapter>
      </Router>
    );

    expect(queryByText('Page 1')).not.toBeNull();
    expect(queryByText('Page 2')).toBeNull();
    expect(history.entries[0].pathname).toEqual('/chapter-one/page-one');

    userEvent.click(queryByText('Page two link'));

    expect(queryByText('Page 1')).toBeNull();
    expect(queryByText('Page 2')).not.toBeNull();
    expect(history.entries[1].pathname).toEqual('/chapter-one/page-two');
  });
});
