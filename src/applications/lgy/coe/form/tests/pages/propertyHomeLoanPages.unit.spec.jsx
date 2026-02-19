import { expect } from 'chai';
import { propertiesHomeLoansPages } from '../../pages/propertiesHomeLoansPages';

describe('COE VA home loans array builder pages', () => {
  it('includes summary and item pages', () => {
    expect(propertiesHomeLoansPages).to.have.property(
      'propertiesHomeLoansSummary',
    );
    expect(propertiesHomeLoansPages).to.have.property(
      'propertyHomeLoanAddressPage',
    );
    expect(propertiesHomeLoansPages).to.have.property(
      'propertyHomeLoanDetailsPage',
    );
    expect(propertiesHomeLoansPages).to.have.property(
      'propertyHomeLoanEntitlementRestorationPage',
    );
    expect(propertiesHomeLoansPages).to.have.property(
      'propertyHomeLoanDisasterDamagePage',
    );
  });

  it('uses the rebuild paths', () => {
    expect(propertiesHomeLoansPages.propertiesHomeLoansSummary.path).to.equal(
      'relevant-prior-loans-summary',
    );
    expect(propertiesHomeLoansPages.propertyHomeLoanAddressPage.path).to.equal(
      'relevant-prior-loans/:index/property-address',
    );
    expect(propertiesHomeLoansPages.propertyHomeLoanDetailsPage.path).to.equal(
      'relevant-prior-loans/:index/loan-details',
    );
    expect(
      propertiesHomeLoansPages.propertyHomeLoanEntitlementRestorationPage.path,
    ).to.equal('relevant-prior-loans/:index/entitlement-restoration');
    expect(
      propertiesHomeLoansPages.propertyHomeLoanDisasterDamagePage.path,
    ).to.equal('relevant-prior-loans/:index/disaster-damage');
  });
});
