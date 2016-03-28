import React from 'react';
import SkinDeep from 'skin-deep';
import { Router, Route, createMemoryHistory } from 'react-router';

import routes from '../../../_health-care/_js/routes';

class Container extends React.Component {
  render() {
    return (<div>{this.props.children}</div>);
  }
}

describe('routes', () => {
  describe('renders correct component', () => {
    const history = createMemoryHistory('/');
    let tree;

    before(() => {
      // It's perfectly fine in this test to reuse the rendered component. Do that
      // cause it cuts the test time from 1s down to ~0.1s.
      tree = SkinDeep.shallowRender(
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

    it('/introduction', () => {
      history.replace('/introduction');
      expect(tree.dive(['RouterContext']).subTree('IntroductionPanel')).to.be.an('object');
    });

    it('/personal-information/name-and-general-information', () => {
      history.replace('/personal-information/name-and-general-information');
      expect(tree.dive(['RouterContext']).subTree('NameAndGeneralInfoSection')).to.be.an('object');
    });

    xit('/personal-information/va-information', () => {
      history.replace('/personal-information/va-information');
      expect(tree.dive(['RouterContext']).subTree('VAInformationSection')).to.be.an('object');
    });

    it('/personal-information/additional-information', () => {
      history.replace('/personal-information/additional-information');
      expect(tree.dive(['RouterContext']).subTree('AdditionalInformationSection')).to.be.an('object');
    });

    it('/personal-information/demographic-information', () => {
      history.replace('/personal-information/demographic-information');
      expect(tree.dive(['RouterContext']).subTree('DemographicInformationSection')).to.be.an('object');
    });

    it('/personal-information/veteran-address', () => {
      history.replace('/personal-information/veteran-address');
      expect(tree.dive(['RouterContext']).subTree('VeteranAddressSection')).to.be.an('object');
    });

    it('/insurance-information/general', () => {
      history.replace('/insurance-information/general');
      expect(tree.dive(['RouterContext']).subTree('InsuranceInformationSection')).to.be.an('object');
    });

    it('/insurance-information/medicare-medicaid', () => {
      history.replace('/insurance-information/medicare-medicaid');
      expect(tree.dive(['RouterContext']).subTree('MedicareMedicaidSection')).to.be.an('object');
    });

    it('/military-service/service-information', () => {
      history.replace('/military-service/service-information');
      expect(tree.dive(['RouterContext']).subTree('ServiceInformationSection')).to.be.an('object');
    });

    it('/military-service/additional-information', () => {
      history.replace('/military-service/additional-information');
      expect(tree.dive(['RouterContext']).subTree('AdditionalMilitaryInformationSection')).to.be.an('object');
    });

    it('/financial-assessment/financial-disclosure', () => {
      history.replace('/financial-assessment/financial-disclosure');
      expect(tree.dive(['RouterContext']).subTree('FinancialDisclosureSection')).to.be.an('object');
    });

    it('/financial-assessment/spouse-information', () => {
      history.replace('/financial-assessment/spouse-information');
      expect(tree.dive(['RouterContext']).subTree('SpouseInformationSection')).to.be.an('object');
    });

    it('/financial-assessment/child-information', () => {
      history.replace('/financial-assessment/child-information');
      expect(tree.dive(['RouterContext']).subTree('ChildInformationSection')).to.be.an('object');
    });

    it('/financial-assessment/annual-income', () => {
      history.replace('/financial-assessment/annual-income');
      expect(tree.dive(['RouterContext']).subTree('AnnualIncomeSection')).to.be.an('object');
    });

    it('/financial-assessment/deductible-expenses', () => {
      history.replace('/financial-assessment/deductible-expenses');
      expect(tree.dive(['RouterContext']).subTree('DeductibleExpensesSection')).to.be.an('object');
    });

    it('/review-and-submit', () => {
      history.replace('/review-and-submit');
      expect(tree.dive(['RouterContext']).subTree('ReviewAndSubmitSection')).to.be.an('object');
    });
  });
});
