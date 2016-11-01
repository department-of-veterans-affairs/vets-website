import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import { Router, Route, createMemoryHistory } from 'react-router';
import { createStore } from 'redux';
import { expect } from 'chai';

import Nav from '../../../src/js/hca/components/Nav';
import routes from '../../../src/js/hca/routes';
import reducer from '../../../src/js/hca/reducers';

const store = createStore(reducer);

class Container extends React.Component {
  render() {
    return (<Nav currentUrl={this.props.location.pathname}/>);
  }
}

describe('<Nav>', () => {
  describe('active sections have section-current or sub-section-current class', () => {
    const history = createMemoryHistory('/');
    let nav;

    before(() => {
      // It's perfectly fine in this test to reuse the rendered component. Do that
      // cause it cuts the test time from 1s down to ~0.1s.
      nav = ReactTestUtils.renderIntoDocument(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/" component={Container}>
              {routes}
            </Route>
          </Router>
        </Provider>
      );
    });

    afterEach(() => {
      // Ensure navigations do not leak from one test case to another.
      history.replace('/');
    });

    const expectActiveSection = (component, path) => {
      history.replace(path);
      const activeSection = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'section-current');
      expect(activeSection).to.have.lengthOf(1);
    };

    const expectActiveSectionForNavAndSubNav = (component, path) => {
      history.replace(path);
      const activeSubSection = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'sub-section-current');
      expect(activeSubSection).to.have.lengthOf(1);
    };

    it('/veteran-information/personal-information', () => {
      expectActiveSectionForNavAndSubNav(nav, '/veteran-information/personal-information');
    });

    it('/veteran-information/demographic-information', () => {
      expectActiveSectionForNavAndSubNav(nav, '/veteran-information/demographic-information');
    });

    it('/veteran-information/veteran-address', () => {
      expectActiveSectionForNavAndSubNav(nav, '/veteran-information/veteran-address');
    });

    it('/military-service/service-information', () => {
      expectActiveSectionForNavAndSubNav(nav, '/military-service/service-information');
    });

    it('/military-service/additional-information', () => {
      expectActiveSectionForNavAndSubNav(nav, '/military-service/additional-information');
    });

    it('/va-benefits/basic-information', () => {
      expectActiveSectionForNavAndSubNav(nav, '/va-benefits/basic-information');
    });

    it('/household-information/financial-disclosure', () => {
      expectActiveSectionForNavAndSubNav(nav, '/household-information/financial-disclosure');
    });

    it('/household-information/spouse-information', () => {
      expectActiveSectionForNavAndSubNav(nav, '/household-information/spouse-information');
    });

    it('/household-information/child-information', () => {
      expectActiveSectionForNavAndSubNav(nav, '/household-information/child-information');
    });

    it('/household-information/annual-income', () => {
      expectActiveSectionForNavAndSubNav(nav, '/household-information/annual-income');
    });

    it('/household-information/deductible-expenses', () => {
      expectActiveSectionForNavAndSubNav(nav, '/household-information/deductible-expenses');
    });

    it('/insurance-information/general', () => {
      expectActiveSectionForNavAndSubNav(nav, '/insurance-information/general');
    });

    it('/review-and-submit', () => {
      expectActiveSection(nav, '/review-and-submit');
    });
  });
});
