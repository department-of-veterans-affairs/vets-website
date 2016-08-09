import React from 'react';
import SkinDeep from 'skin-deep';
import { Router, Route, createMemoryHistory } from 'react-router';
import { createStore } from 'redux';
import { expect } from 'chai';

import AdditionalMilitaryInformationSection from '../../src/client/components/military-service/AdditionalMilitaryInformationSection';
import AnnualIncomeSection from '../../src/client/components/household-information/AnnualIncomeSection';
import BirthInformationSection from '../../src/client/components/veteran-information/BirthInformationSection';
import ChildInformationSection from '../../src/client/components/household-information/ChildInformationSection';
import ContactInformationSection from '../../src/client/components/veteran-information/ContactInformationSection';
import DeductibleExpensesSection from '../../src/client/components/household-information/DeductibleExpensesSection';
import DemographicInformationSection from '../../src/client/components/veteran-information/DemographicInformationSection';
import FinancialDisclosureSection from '../../src/client/components/household-information/FinancialDisclosureSection';
import InsuranceInformationSection from '../../src/client/components/insurance-information/InsuranceInformationSection';
import IntroductionSection from '../../src/client/components/IntroductionSection.jsx';
import PersonalInfoSection from '../../src/client/components/veteran-information/PersonalInfoSection';
import ReviewAndSubmitSection from '../../src/client/components/ReviewAndSubmitSection.jsx';
import ServiceInformationSection from '../../src/client/components/military-service/ServiceInformationSection';
import SpouseInformationSection from '../../src/client/components/household-information/SpouseInformationSection';
import VAInformationSection from '../../src/client/components/va-benefits/VAInformationSection';
import VeteranAddressSection from '../../src/client/components/veteran-information/VeteranAddressSection';
import routes from '../../src/client/routes';
import veteran from '../../src/client/reducers/veteran';

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

    it('/veteran-information/personal-information', () => {
      history.replace('/veteran-information/personal-information');
      expect(tree.dive(['RouterContext']).subTree(getName(PersonalInfoSection))).to.be.an('object');
    });

    it('/veteran-information/birth-information', () => {
      history.replace('/veteran-information/birth-information');
      expect(tree.dive(['RouterContext']).subTree(getName(BirthInformationSection))).to.be.an('object');
    });

    it('/veteran-information/demographic-information', () => {
      history.replace('/veteran-information/demographic-information');
      expect(tree.dive(['RouterContext']).subTree(getName(DemographicInformationSection))).to.be.an('object');
    });

    it('/veteran-information/veteran-address', () => {
      history.replace('/veteran-information/veteran-address');
      expect(tree.dive(['RouterContext']).subTree(getName(VeteranAddressSection))).to.be.an('object');
    });

    it('/veteran-information/contact-information', () => {
      history.replace('/veteran-information/contact-information');
      expect(tree.dive(['RouterContext']).subTree(getName(ContactInformationSection))).to.be.an('object');
    });

    it('/military-service/service-information', () => {
      history.replace('/military-service/service-information');
      expect(tree.dive(['RouterContext']).subTree(getName(ServiceInformationSection))).to.be.an('object');
    });

    it('/military-service/additional-information', () => {
      history.replace('/military-service/additional-information');
      expect(tree.dive(['RouterContext']).subTree(getName(AdditionalMilitaryInformationSection))).to.be.an('object');
    });

    it('/va-benefits/basic-information', () => {
      history.replace('/va-benefits/basic-information');
      expect(tree.dive(['RouterContext']).subTree(getName(VAInformationSection))).to.be.an('object');
    });

    it('/household-information/financial-disclosure', () => {
      history.replace('/household-information/financial-disclosure');
      expect(tree.dive(['RouterContext']).subTree(getName(FinancialDisclosureSection))).to.be.an('object');
    });

    it('/household-information/spouse-information', () => {
      history.replace('/household-information/spouse-information');
      expect(tree.dive(['RouterContext']).subTree(getName(SpouseInformationSection))).to.be.an('object');
    });

    it('/household-information/child-information', () => {
      history.replace('/household-information/child-information');
      expect(tree.dive(['RouterContext']).subTree(getName(ChildInformationSection))).to.be.an('object');
    });

    it('/household-information/annual-income', () => {
      history.replace('/household-information/annual-income');
      expect(tree.dive(['RouterContext']).subTree(getName(AnnualIncomeSection))).to.be.an('object');
    });

    it('/household-information/deductible-expenses', () => {
      history.replace('/household-information/deductible-expenses');
      expect(tree.dive(['RouterContext']).subTree(getName(DeductibleExpensesSection))).to.be.an('object');
    });

    it('/insurance-information/general', () => {
      history.replace('/insurance-information/general');
      expect(tree.dive(['RouterContext']).subTree(getName(InsuranceInformationSection))).to.be.an('object');
    });

    it('/review-and-submit', () => {
      history.replace('/review-and-submit');
      expect(tree.dive(['RouterContext']).subTree(getName(ReviewAndSubmitSection))).to.be.an('object');
    });
  });
});
