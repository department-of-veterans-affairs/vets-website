import { expect } from 'chai';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import {
  CTA_WIDGET_TYPES,
  ctaWidgetsLookup,
  disabilityBenefitsUrls,
  viewDependentsUrl,
} from '../ctaWidgets';

describe('ctaWidgetsLookup', () => {
  it('should return the appropriate tool url and correct MHV account info for ADD_REMOVE_DEPENDENTS', () => {
    const ctaWidget = ctaWidgetsLookup[CTA_WIDGET_TYPES.ADD_REMOVE_DEPENDENTS];
    expect(ctaWidget.deriveToolUrlDetails()).to.eql({
      url: disabilityBenefitsUrls['686c'],
      redirect: false,
    });
    expect(ctaWidget.hasRequiredMhvAccount()).to.be.false;
  });

  it('should return the appropriate tool url and correct MHV account info for CHANGE_ADDRESS', () => {
    const ctaWidget = ctaWidgetsLookup[CTA_WIDGET_TYPES.CHANGE_ADDRESS];
    expect(ctaWidget.deriveToolUrlDetails()).to.eql({
      url: '/profile/contact-information',
      redirect: true,
    });
    expect(ctaWidget.hasRequiredMhvAccount()).to.be.false;
  });

  it('should return the appropriate tool url and correct MHV account info for CLAIMS_AND_APPEALS', () => {
    const ctaWidget = ctaWidgetsLookup[CTA_WIDGET_TYPES.CLAIMS_AND_APPEALS];
    expect(ctaWidget.deriveToolUrlDetails()).to.eql({
      url: '/track-claims/',
      redirect: true,
    });
    expect(ctaWidget.hasRequiredMhvAccount()).to.be.false;
  });

  it('should return the appropriate tool url and correct MHV account info for COMBINED_DEBT_PORTAL', () => {
    const ctaWidget = ctaWidgetsLookup[CTA_WIDGET_TYPES.COMBINED_DEBT_PORTAL];
    expect(ctaWidget.deriveToolUrlDetails()).to.eql({
      url: '/manage-va-debt/summary',
      redirect: true,
    });
    expect(ctaWidget.hasRequiredMhvAccount()).to.be.false;
  });

  it('should return the appropriate tool url and correct MHV account info for DIRECT_DEPOSIT', () => {
    const ctaWidget = ctaWidgetsLookup[CTA_WIDGET_TYPES.DIRECT_DEPOSIT];
    expect(ctaWidget.deriveToolUrlDetails()).to.eql({
      url: '/profile/direct-deposit',
      redirect: true,
    });
    expect(ctaWidget.hasRequiredMhvAccount()).to.be.false;
  });

  it('should return the appropriate tool url and correct MHV account info for DISABILITY_BENEFITS', () => {
    const ctaWidget = ctaWidgetsLookup[CTA_WIDGET_TYPES.DISABILITY_BENEFITS];
    expect(ctaWidget.deriveToolUrlDetails()).to.eql({
      url: '/disability/how-to-file-claim',
      redirect: false,
    });
    expect(ctaWidget.hasRequiredMhvAccount()).to.be.false;
  });

  it('should return the appropriate tool url and correct MHV account info for DISABILITY_RATINGS', () => {
    const ctaWidget = ctaWidgetsLookup[CTA_WIDGET_TYPES.DISABILITY_RATINGS];
    expect(ctaWidget.deriveToolUrlDetails()).to.eql({
      url: '/disability/view-disability-rating/rating',
      redirect: false,
    });
    expect(ctaWidget.hasRequiredMhvAccount()).to.be.false;
  });

  it('should return the appropriate tool url and correct MHV account info for GI_BILL_BENEFITS', () => {
    const ctaWidget = ctaWidgetsLookup[CTA_WIDGET_TYPES.GI_BILL_BENEFITS];
    expect(ctaWidget.deriveToolUrlDetails()).to.eql({
      url: '/education/check-remaining-post-9-11-gi-bill-benefits/status',
      redirect: false,
    });
    expect(ctaWidget.hasRequiredMhvAccount()).to.be.false;
  });

  it('should return the appropriate tool url and correct MHV account info for HA_CPAP_SUPPLIES', () => {
    const ctaWidget = ctaWidgetsLookup[CTA_WIDGET_TYPES.HA_CPAP_SUPPLIES];
    expect(ctaWidget.deriveToolUrlDetails()).to.eql({
      url: '/health-care/order-hearing-aid-or-CPAP-supplies-form',
      redirect: true,
    });
    expect(ctaWidget.hasRequiredMhvAccount()).to.be.false;
  });

  it('should return the appropriate tool url and correct MHV account info for HEARING_AID_SUPPLIES', () => {
    const ctaWidget = ctaWidgetsLookup[CTA_WIDGET_TYPES.HEARING_AID_SUPPLIES];
    expect(ctaWidget.deriveToolUrlDetails()).to.eql({
      url: '/health-care/order-hearing-aid-or-CPAP-supplies-form',
      redirect: false,
    });
    expect(ctaWidget.hasRequiredMhvAccount()).to.be.false;
  });

  it('should return the appropriate tool url and correct MHV account info for HOME_LOAN_COE_STATUS', () => {
    const ctaWidget = ctaWidgetsLookup[CTA_WIDGET_TYPES.HOME_LOAN_COE_STATUS];
    expect(ctaWidget.deriveToolUrlDetails()).to.eql({
      url: '/housing-assistance/home-loans/check-coe-status/your-coe/',
      redirect: true,
    });
    expect(ctaWidget.hasRequiredMhvAccount()).to.be.false;
  });

  it('should return the appropriate tool url and correct MHV account info for LETTERS', () => {
    const ctaWidget = ctaWidgetsLookup[CTA_WIDGET_TYPES.LETTERS];
    expect(ctaWidget.deriveToolUrlDetails()).to.eql({
      url: '/records/download-va-letters/letters',
      redirect: false,
    });
    expect(ctaWidget.hasRequiredMhvAccount()).to.be.false;
  });

  it('should return the appropriate tool url and correct MHV account info for MANAGE_VA_DEBT', () => {
    const ctaWidget = ctaWidgetsLookup[CTA_WIDGET_TYPES.MANAGE_VA_DEBT];
    expect(ctaWidget.deriveToolUrlDetails()).to.eql({
      url: '/manage-va-debt/summary/debt-balances',
      redirect: false,
    });
    expect(ctaWidget.hasRequiredMhvAccount()).to.be.false;
  });

  it('should return the appropriate tool url and correct MHV account info for SCHEDULE_APPOINTMENTS', () => {
    const ctaWidget = ctaWidgetsLookup[CTA_WIDGET_TYPES.SCHEDULE_APPOINTMENTS];
    expect(ctaWidget.deriveToolUrlDetails(true)).to.eql({
      url: mhvUrl(true, 'appointments'),
      redirect: false,
    });
    expect(ctaWidget.hasRequiredMhvAccount('Premium')).to.be.true;
  });

  it('should return the appropriate tool url and correct MHV account info for UPDATE_HEALTH_BENEFITS_INFO', () => {
    const ctaWidget =
      ctaWidgetsLookup[CTA_WIDGET_TYPES.UPDATE_HEALTH_BENEFITS_INFO];
    expect(ctaWidget.deriveToolUrlDetails()).to.eql({
      url: '/my-health/update-benefits-information-form-10-10ezr',
      redirect: true,
    });
    expect(ctaWidget.hasRequiredMhvAccount()).to.be.false;
  });

  it('should return the appropriate tool url and correct MHV account info for VETERAN_ID_CARD', () => {
    const ctaWidget = ctaWidgetsLookup[CTA_WIDGET_TYPES.VETERAN_ID_CARD];
    expect(ctaWidget.deriveToolUrlDetails()).to.eql({
      url: '/records/get-veteran-id-cards/apply',
      redirect: false,
    });
    expect(ctaWidget.hasRequiredMhvAccount()).to.be.false;
  });

  it('should return the appropriate tool url and correct MHV account info for VET_TEC', () => {
    const ctaWidget = ctaWidgetsLookup[CTA_WIDGET_TYPES.VET_TEC];
    expect(ctaWidget.deriveToolUrlDetails()).to.eql({
      url:
        '/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994',
      redirect: false,
    });
    expect(ctaWidget.hasRequiredMhvAccount()).to.be.false;
  });

  it('should return the appropriate tool url and correct MHV account info for VIEW_DEPENDENTS', () => {
    const ctaWidget = ctaWidgetsLookup[CTA_WIDGET_TYPES.VIEW_DEPENDENTS];
    expect(ctaWidget.deriveToolUrlDetails()).to.eql({
      url: viewDependentsUrl,
      redirect: false,
    });
    expect(ctaWidget.hasRequiredMhvAccount()).to.be.false;
  });

  it('should return the appropriate tool url and correct MHV account info for VIEW_PAYMENT_HISTORY', () => {
    const ctaWidget = ctaWidgetsLookup[CTA_WIDGET_TYPES.VIEW_PAYMENT_HISTORY];
    expect(ctaWidget.deriveToolUrlDetails()).to.eql({
      url: disabilityBenefitsUrls['view-payments'],
      redirect: false,
    });
    expect(ctaWidget.hasRequiredMhvAccount()).to.be.false;
  });

  it('should return the appropriate tool url and correct MHV account info for EDUCATION_LETTERS', () => {
    const ctaWidget = ctaWidgetsLookup[CTA_WIDGET_TYPES.EDUCATION_LETTERS];
    expect(ctaWidget.deriveToolUrlDetails()).to.eql({
      url: 'education/download-letters',
      redirect: false,
    });
    expect(ctaWidget.hasRequiredMhvAccount()).to.be.false;
  });

  it('should return the appropriate tool url and correct MHV account info for ENROLLMENT_VERIFICATION', () => {
    const ctaWidget =
      ctaWidgetsLookup[CTA_WIDGET_TYPES.ENROLLMENT_VERIFICATION];
    expect(ctaWidget.deriveToolUrlDetails()).to.eql({
      url: 'education/verify-school-enrollment',
      redirect: false,
    });
    expect(ctaWidget.hasRequiredMhvAccount()).to.be.false;
  });
});
