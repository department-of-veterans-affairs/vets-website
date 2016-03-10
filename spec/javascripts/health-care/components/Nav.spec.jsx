import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Router, Route, createMemoryHistory } from 'react-router';

import Nav from '../../../../_health-care/_js/components/Nav';
import routes from '../../../../_health-care/_js/routes';

describe('<Nav>', () => {
  describe('active links have usa-current class', () => {
    const history = createMemoryHistory('/');
    let nav;

    const expectOneActiveLink = (component, path) => {
      history.replace(path);
      const activeLinks = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'usa-current');
      expect(activeLinks).to.have.lengthOf(1);
      expect(activeLinks[0].getAttribute('href')).to.equal(path);
    };

    before(() => {
      // It's perfectly fine in this test to reuse the rendered component. Do that
      // cause it cuts the test time from 1s down to ~0.1s.
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

    it('/introduction', ()=> {
      expectOneActiveLink(nav, '/introduction');
    });

    it('/personal-information/name-and-general-information', ()=> {
      expectOneActiveLink(nav, '/personal-information/name-and-general-information');
    });

    it('/personal-information/va-information', ()=> {
      expectOneActiveLink(nav, '/personal-information/va-information');
    });

    it('/personal-information/additional-information', ()=> {
      expectOneActiveLink(nav, '/personal-information/additional-information');
    });

    it('/personal-information/demographic-information', ()=> {
      expectOneActiveLink(nav, '/personal-information/demographic-information');
    });

    it('/personal-information/veteran-address', ()=> {
      expectOneActiveLink(nav, '/personal-information/veteran-address');
    });

    it('/insurance-information/general', ()=> {
      expectOneActiveLink(nav, '/insurance-information/general');
    });

    it('/insurance-information/medicare-medicaid', ()=> {
      expectOneActiveLink(nav, '/insurance-information/medicare-medicaid');
    });

    it('/military-service/service-information', ()=> {
      expectOneActiveLink(nav, '/military-service/service-information');
    });

    it('/military-service/additional-information', ()=> {
      expectOneActiveLink(nav, '/military-service/additional-information');
    });

    it('/financial-assessment/financial-disclosure', ()=> {
      expectOneActiveLink(nav, '/financial-assessment/financial-disclosure');
    });

    it('/financial-assessment/spouse-information', ()=> {
      expectOneActiveLink(nav, '/financial-assessment/spouse-information');
    });

    it('/financial-assessment/child-information', ()=> {
      expectOneActiveLink(nav, '/financial-assessment/child-information');
    });

    it('/financial-assessment/annual-income', ()=> {
      expectOneActiveLink(nav, '/financial-assessment/annual-income');
    });

    it('/financial-assessment/deductible-expenses', ()=> {
      expectOneActiveLink(nav, '/financial-assessment/deductible-expenses');
    });

    it('/review-and-submit', ()=> {
      expectOneActiveLink(nav, '/review-and-submit');
    });
  });
});

