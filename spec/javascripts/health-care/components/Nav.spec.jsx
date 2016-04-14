import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Router, Route, createMemoryHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import SkinDeep from 'skin-deep';

import Nav from '../../../../_health-care/_js/components/Nav';
import routes from '../../../../_health-care/_js/routes';
import reducer from '../../../../_health-care/_js/reducers';

const store = createStore(reducer);

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

    it('/introduction', () => {
      expectActiveSection(nav, '/introduction');
    });

    it('/personal-information/name-and-general-information', () => {
      expectActiveSectionForNavAndSubNav(nav, '/personal-information/name-and-general-information');
    });

    it('/personal-information/va-information', () => {
      expectActiveSectionForNavAndSubNav(nav, '/personal-information/va-information');
    });

    it('/personal-information/additional-information', () => {
      expectActiveSectionForNavAndSubNav(nav, '/personal-information/additional-information');
    });

    it('/personal-information/demographic-information', () => {
      expectActiveSectionForNavAndSubNav(nav, '/personal-information/demographic-information');
    });

    it('/personal-information/veteran-address', () => {
      expectActiveSectionForNavAndSubNav(nav, '/personal-information/veteran-address');
    });

    it('/insurance-information/general', () => {
      expectActiveSectionForNavAndSubNav(nav, '/insurance-information/general');
    });

    it('/insurance-information/medicare-medicaid', () => {
      expectActiveSectionForNavAndSubNav(nav, '/insurance-information/medicare-medicaid');
    });

    it('/military-service/service-information', () => {
      expectActiveSectionForNavAndSubNav(nav, '/military-service/service-information');
    });

    it('/military-service/additional-information', () => {
      expectActiveSectionForNavAndSubNav(nav, '/military-service/additional-information');
    });

    it('/financial-assessment/financial-disclosure', () => {
      expectActiveSectionForNavAndSubNav(nav, '/financial-assessment/financial-disclosure');
    });

    it('/financial-assessment/spouse-information', () => {
      expectActiveSectionForNavAndSubNav(nav, '/financial-assessment/spouse-information');
    });

    it('/financial-assessment/child-information', () => {
      expectActiveSectionForNavAndSubNav(nav, '/financial-assessment/child-information');
    });

    it('/financial-assessment/annual-income', () => {
      expectActiveSectionForNavAndSubNav(nav, '/financial-assessment/annual-income');
    });

    it('/financial-assessment/deductible-expenses', () => {
      expectActiveSectionForNavAndSubNav(nav, '/financial-assessment/deductible-expenses');
    });

    it('/review-and-submit', () => {
      expectActiveSection(nav, '/review-and-submit');
    });
  });
});

