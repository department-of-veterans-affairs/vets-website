import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Router, Route, createMemoryHistory } from 'react-router';
import SkinDeep from 'skin-deep';

import Nav from '../../../../_health-care/_js/components/Nav';
import routes from '../../../../_health-care/_js/routes';

class Container extends React.Component {
  render() {
    return (<Nav currentUrl={this.props.location.pathname}/>);
  }
}

describe('<Nav>', () => {
  describe('propTypes', () => {
    let consoleStub;
    beforeEach(() => {
      consoleStub = sinon.stub(console, 'error');
    });

    afterEach(() => {
      consoleStub.restore();
    });

    xit('currentUrl is required', () => {
      SkinDeep.shallowRender(<Nav/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `currentUrl` was not specified in `Nav`/);
    });

    xit('currentUrl must be a string', () => {
      SkinDeep.shallowRender(<Nav currentUrl/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `currentUrl` of type `boolean` supplied to `Nav`, expected `string`/);
    });
  });

  describe('active links have section-current class', () => {
    const history = createMemoryHistory('/');
    let nav;

    before(() => {
      // It's perfectly fine in this test to reuse the rendered component. Do that
      // cause it cuts the test time from 1s down to ~0.1s.
      nav = ReactTestUtils.renderIntoDocument(
        <Router history={history}>
          <Route path="/" component={Container}>
            {routes}
          </Route>
        </Router>
      );
    });

    afterEach(() => {
      // Ensure navigations do not leak from one test case to another.
      history.replace('/');
    });

    const expectOneActiveLink = (component, path) => {
      history.replace(path);
      const activeLinks = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'section-current');
      expect(activeLinks).to.have.lengthOf(1);
    };

    const expectActiveLinksForNavAndSubNav = (component, path) => {
      history.replace(path);
      const activeLinks = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'section-current');
      expect(activeLinks).to.have.lengthOf(2);
    };

    it('/introduction', () => {
      expectOneActiveLink(nav, '/introduction');
    });

    it('/personal-information/name-and-general-information', () => {
      expectActiveLinksForNavAndSubNav(nav, '/personal-information/name-and-general-information');
    });

    it('/personal-information/va-information', () => {
      expectActiveLinksForNavAndSubNav(nav, '/personal-information/va-information');
    });

    it('/personal-information/additional-information', () => {
      expectActiveLinksForNavAndSubNav(nav, '/personal-information/additional-information');
    });

    it('/personal-information/demographic-information', () => {
      expectActiveLinksForNavAndSubNav(nav, '/personal-information/demographic-information');
    });

    it('/personal-information/veteran-address', () => {
      expectActiveLinksForNavAndSubNav(nav, '/personal-information/veteran-address');
    });

    it('/insurance-information/general', () => {
      expectActiveLinksForNavAndSubNav(nav, '/insurance-information/general');
    });

    it('/insurance-information/medicare-medicaid', () => {
      expectActiveLinksForNavAndSubNav(nav, '/insurance-information/medicare-medicaid');
    });

    it('/military-service/service-information', () => {
      expectActiveLinksForNavAndSubNav(nav, '/military-service/service-information');
    });

    it('/military-service/additional-information', () => {
      expectActiveLinksForNavAndSubNav(nav, '/military-service/additional-information');
    });

    it('/financial-assessment/financial-disclosure', () => {
      expectActiveLinksForNavAndSubNav(nav, '/financial-assessment/financial-disclosure');
    });

    it('/financial-assessment/spouse-information', () => {
      expectActiveLinksForNavAndSubNav(nav, '/financial-assessment/spouse-information');
    });

    it('/financial-assessment/child-information', () => {
      expectActiveLinksForNavAndSubNav(nav, '/financial-assessment/child-information');
    });

    it('/financial-assessment/annual-income', () => {
      expectActiveLinksForNavAndSubNav(nav, '/financial-assessment/annual-income');
    });

    it('/financial-assessment/deductible-expenses', () => {
      expectActiveLinksForNavAndSubNav(nav, '/financial-assessment/deductible-expenses');
    });

    it('/review-and-submit', () => {
      expectOneActiveLink(nav, '/review-and-submit');
    });
  });
});

