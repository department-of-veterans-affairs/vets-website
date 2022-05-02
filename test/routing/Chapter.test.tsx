import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Link, Router } from 'react-router-dom';
import Page from '../../src/routing/Page';
import Chapter from '../../src/routing/Chapter';
import { createMemoryHistory } from 'history';

describe.skip('Routing - Chapter', () => {
  test('it can navigate Chapters and Pages', () => {
    const history = createMemoryHistory({
      initialEntries: ['/chapter-one/page-one'],
    });
    const { queryByText } = render(
      <Router history={history}>
        <Chapter title="Chapter One" path="/chapter-one">
          <Page title="First Page" path="/page-one">
            <div>Chapter one - Page one</div>
            <Link to="/chapter-one/page-two">Link 1</Link>
          </Page>
          <Page title="Second Page" path="/page-two">
            <div>Chapter one - Page two</div>
            <Link to="/chapter-two/page-one">Link 2</Link>
          </Page>
        </Chapter>
        <Chapter title="Chapter Two" path="/chapter-two">
          <Page title="First page" path="/page-one">
            <div>Chapter two - Page one</div>
            <Link to="/chapter-two/page-two">Link 3</Link>
          </Page>
          <Page title="Second page" path="/page-two">
            <div>Chapter two - Page two</div>
          </Page>
        </Chapter>
      </Router>
    );
    const pagesToTest = [
      'Chapter one - Page one',
      'Chapter one - Page two',
      'Chapter two - Page one',
      'Chapter two - Page two',
    ];
    const testProperComponentIsNotNull = (notNullComponent: string) => {
      const nullComponents = pagesToTest.filter(
        (component: string) => component !== notNullComponent
      );
      nullComponents.forEach((nullComponent: string) =>
        expect(queryByText(nullComponent)).toBeNull()
      );

      expect(queryByText(notNullComponent)).not.toBeNull();
    };

    testProperComponentIsNotNull('Chapter one - Page one');
    expect(history.entries[0].pathname).toEqual('/chapter-one/page-one');

    userEvent.click(queryByText('Link 1'));
    testProperComponentIsNotNull('Chapter one - Page two');
    expect(history.entries[1].pathname).toEqual('/chapter-one/page-two');

    userEvent.click(queryByText('Link 2'));
    testProperComponentIsNotNull('Chapter two - Page one');
    expect(history.entries[2].pathname).toEqual('/chapter-two/page-one');

    userEvent.click(queryByText('Link 3'));
    testProperComponentIsNotNull('Chapter two - Page two');
    expect(history.entries[3].pathname).toEqual('/chapter-two/page-two');
  });
});
