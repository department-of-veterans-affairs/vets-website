import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Router, Route, createMemoryHistory } from 'react-router';

import Nav from '../../../../_health-care/_js/components/Nav';
import routes from '../../../../_health-care/_js/routes';

describe('<Nav>', () => {
  const history = createMemoryHistory('/');
  let nav;

  const expectOneActiveLink = (component, path) => {
    history.replace(path);
    const activeLinks = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'usa-current');
    expect(activeLinks).to.have.lengthOf(1);
    expect(activeLinks[0].props.href).to.equal(path);
  };

  beforeEach(() => {
    nav = ReactTestUtils.renderIntoDocument(
      <Router history={history}>
        <Route path="/" component={Nav}>
          {routes}
        </Route>
      </Router>
    );
  });

  afterEach(() => {
    // Ensure navigations do not leak from one test case to another.
    history.replace('/');
  });

  it('/personal-information/additional-information', () => {
    expectOneActiveLink(nav, '/personal-information/additional-information');
  });
});

