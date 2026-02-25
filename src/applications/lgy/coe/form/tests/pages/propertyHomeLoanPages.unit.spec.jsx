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

  it('gates all array builder pages depending on Step 3 answers', () => {
    const showLoop = {
      'view:coeFormRebuildCveteam': true,
      loanHistory: { hadPriorLoans: true, currentOwnership: true },
    };
    const skipLoopHadNoPriorLoans = {
      'view:coeFormRebuildCveteam': true,
      loanHistory: { hadPriorLoans: false, currentOwnership: true },
    };
    const skipLoopNoCurrentOwnership = {
      'view:coeFormRebuildCveteam': true,
      loanHistory: { hadPriorLoans: true, currentOwnership: false },
    };
    const skipLoopFlagOff = {
      'view:coeFormRebuildCveteam': false,
      loanHistory: { hadPriorLoans: true, currentOwnership: true },
    };
    const pageKeys = [
      'propertiesHomeLoansSummary',
      'propertyHomeLoanAddressPage',
      'propertyHomeLoanDetailsPage',
      'propertyHomeLoanEntitlementRestorationPage',
      'propertyHomeLoanDisasterDamagePage',
    ];

    pageKeys.forEach(key => {
      expect(propertiesHomeLoansPages[key].depends(showLoop)).to.equal(true);
      expect(
        propertiesHomeLoansPages[key].depends(skipLoopHadNoPriorLoans),
      ).to.equal(false);
      expect(
        propertiesHomeLoansPages[key].depends(skipLoopNoCurrentOwnership),
      ).to.equal(false);
      expect(propertiesHomeLoansPages[key].depends(skipLoopFlagOff)).to.equal(
        false,
      );
    });
  });
});
