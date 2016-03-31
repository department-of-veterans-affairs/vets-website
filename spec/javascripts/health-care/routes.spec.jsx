import React from 'react';
import SkinDeep from 'skin-deep';
import { Router, Route, createMemoryHistory } from 'react-router';
import { createStore } from 'redux';

import AdditionalInformationSection from '../../../_health-care/_js/components/personal-information/AdditionalInformationSection';
import AdditionalMilitaryInformationSection from '../../../_health-care/_js/components/military-service/AdditionalMilitaryInformationSection';
import AnnualIncomeSection from '../../../_health-care/_js/components/financial-assessment/AnnualIncomeSection';
import ChildInformationSection from '../../../_health-care/_js/components/financial-assessment/ChildInformationSection';
import DeductibleExpensesSection from '../../../_health-care/_js/components/financial-assessment/DeductibleExpensesSection';
import DemographicInformationSection from '../../../_health-care/_js/components/personal-information/DemographicInformationSection';
import FinancialDisclosureSection from '../../../_health-care/_js/components/financial-assessment/FinancialDisclosureSection';
import InsuranceInformationSection from '../../../_health-care/_js/components/insurance-information/InsuranceInformationSection';
import IntroductionSection from '../../../_health-care/_js/components/IntroductionSection.jsx';
import MedicareMedicaidSection from '../../../_health-care/_js/components/insurance-information/MedicareMedicaidSection';
import NameAndGeneralInfoSection from '../../../_health-care/_js/components/personal-information/NameAndGeneralInfoSection';
import ReviewAndSubmitSection from '../../../_health-care/_js/components/ReviewAndSubmitSection.jsx';
import ServiceInformationSection from '../../../_health-care/_js/components/military-service/ServiceInformationSection';
import SpouseInformationSection from '../../../_health-care/_js/components/financial-assessment/SpouseInformationSection';
import VAInformationSection from '../../../_health-care/_js/components/personal-information/VAInformationSection';
import VeteranAddressSection from '../../../_health-care/_js/components/personal-information/VeteranAddressSection';
import routes from '../../../_health-care/_js/routes';
import veteran from '../../../_health-care/_js/reducers/veteran';

function getName(component) {
  return component.displayName || component.name;
}

class Container extends React.Component {
  render() {
    return (<div>{this.props.children}</div>);
  }
}

describe('routes', () => {
  describe('renders correct component', () => {
    const history = createMemoryHistory('/');
    const store = createStore(veteran);
    let tree;

    before(() => {
      // It's perfectly fine in this test to reuse the rendered component. Do that
      // cause it cuts the test time from 1s down to ~0.1s.
      tree = SkinDeep.shallowRender((
        <Router history={history}>
          <Route path="/" component={Container}>
            {routes}
          </Route>
        </Router>
        ), {
          store // Mock the Redux store context so components render.
        }
      );
    });

    afterEach(() => {
      // Ensure navigations do not leak from one test case to another.
      history.replace('/');
    });

    it('/introduction', () => {
      history.replace('/introduction');
      expect(tree.dive(['RouterContext']).subTree(getName(IntroductionSection))).to.be.an('object');
    });

    it('/personal-information/name-and-general-information', () => {
      history.replace('/personal-information/name-and-general-information');
      expect(tree.dive(['RouterContext']).subTree(getName(NameAndGeneralInfoSection))).to.be.an('object');
    });

    it('/personal-information/va-information', () => {
      history.replace('/personal-information/va-information');
      expect(tree.dive(['RouterContext']).subTree(getName(VAInformationSection))).to.be.an('object');
    });

    it('/personal-information/additional-information', () => {
      history.replace('/personal-information/additional-information');
      expect(tree.dive(['RouterContext']).subTree(getName(AdditionalInformationSection))).to.be.an('object');
    });

    it('/personal-information/demographic-information', () => {
      history.replace('/personal-information/demographic-information');
      expect(tree.dive(['RouterContext']).subTree(getName(DemographicInformationSection))).to.be.an('object');
    });

    it('/personal-information/veteran-address', () => {
      history.replace('/personal-information/veteran-address');
      expect(tree.dive(['RouterContext']).subTree(getName(VeteranAddressSection))).to.be.an('object');
    });

    it('/insurance-information/general', () => {
      history.replace('/insurance-information/general');
      expect(tree.dive(['RouterContext']).subTree(getName(InsuranceInformationSection))).to.be.an('object');
    });

    it('/insurance-information/medicare-medicaid', () => {
      history.replace('/insurance-information/medicare-medicaid');
      expect(tree.dive(['RouterContext']).subTree(getName(MedicareMedicaidSection))).to.be.an('object');
    });

    it('/military-service/service-information', () => {
      history.replace('/military-service/service-information');
      expect(tree.dive(['RouterContext']).subTree(getName(ServiceInformationSection))).to.be.an('object');
    });

    it('/military-service/additional-information', () => {
      history.replace('/military-service/additional-information');
      expect(tree.dive(['RouterContext']).subTree(getName(AdditionalMilitaryInformationSection))).to.be.an('object');
    });

    it('/financial-assessment/financial-disclosure', () => {
      history.replace('/financial-assessment/financial-disclosure');
      expect(tree.dive(['RouterContext']).subTree(getName(FinancialDisclosureSection))).to.be.an('object');
    });

    it('/financial-assessment/spouse-information', () => {
      history.replace('/financial-assessment/spouse-information');
      expect(tree.dive(['RouterContext']).subTree(getName(SpouseInformationSection))).to.be.an('object');
    });

    it('/financial-assessment/child-information', () => {
      history.replace('/financial-assessment/child-information');
      expect(tree.dive(['RouterContext']).subTree(getName(ChildInformationSection))).to.be.an('object');
    });

    it('/financial-assessment/annual-income', () => {
      history.replace('/financial-assessment/annual-income');
      expect(tree.dive(['RouterContext']).subTree(getName(AnnualIncomeSection))).to.be.an('object');
    });

    it('/financial-assessment/deductible-expenses', () => {
      history.replace('/financial-assessment/deductible-expenses');
      expect(tree.dive(['RouterContext']).subTree(getName(DeductibleExpensesSection))).to.be.an('object');
    });

    it('/review-and-submit', () => {
      history.replace('/review-and-submit');
      expect(tree.dive(['RouterContext']).subTree(getName(ReviewAndSubmitSection))).to.be.an('object');
    });
  });
});
