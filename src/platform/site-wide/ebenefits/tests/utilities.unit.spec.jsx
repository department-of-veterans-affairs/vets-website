import { expect } from 'chai';

import { proxyUrl, defaultUrl } from '../utilities';

describe('defaultUrl', () => {
  it('should default to root url', () => {
    expect(defaultUrl()).to.equal('https://www.ebenefits.va.gov/');
  });

  it('should normalize path', () => {
    expect(defaultUrl('path')).to.equal('https://www.ebenefits.va.gov/path');
    expect(defaultUrl('/path')).to.equal('https://www.ebenefits.va.gov/path');
  });
});

describe('proxyUrl', () => {
  it('should default to ebenefits url', () => {
    expect(proxyUrl()).to.equal('https://int.eauth.va.gov/ebenefits');
  });

  it('should normalize path', () => {
    expect(proxyUrl('path')).to.equal('https://int.eauth.va.gov/path');
    expect(proxyUrl('/path')).to.equal('https://int.eauth.va.gov/path');
  });

  it('should use eauth with mapped paths', () => {
    expect(
      proxyUrl('ebenefits/about/feature?feature=request-vso-representative'),
    ).to.equal(
      'https://int.eauth.va.gov/ebenefits/vdc?target=%2Fwssweb%2FVDC2122%2Frepresentative.do',
    );
    expect(
      proxyUrl(
        'ebenefits/about/feature?feature=hearing-aid-batteries-and-prosthetic-socks',
      ),
    ).to.equal('https://int.eauth.va.gov/ebenefits/OrderMedicalEquip');
    expect(
      proxyUrl('ebenefits/about/feature?feature=payment-history'),
    ).to.equal('https://int.eauth.va.gov/ebenefits/payments');
    expect(proxyUrl('ebenefits/vso-search')).to.equal(
      'https://int.eauth.va.gov/ebenefits/vso-search',
    );
    expect(
      proxyUrl(
        'ebenefits/about/feature?feature=direct-deposit-and-contact-information',
      ),
    ).to.equal('https://int.eauth.va.gov/ebenefits/manage/contact');
    expect(
      proxyUrl('ebenefits/about/feature?feature=payment-history'),
    ).to.equal('https://int.eauth.va.gov/ebenefits/payments');
    expect(
      proxyUrl(
        'ebenefits/about/feature?feature=vocational-rehabilitation-and-employment',
      ),
    ).to.equal('https://int.eauth.va.gov/ebenefits/vre');
    expect(proxyUrl('ebenefits/about/feature?feature=sah-grant')).to.equal(
      'https://int.eauth.va.gov/ebenefits/SAH',
    );
    expect(
      proxyUrl('ebenefits/about/feature?feature=cert-of-eligibility-home-loan'),
    ).to.equal('https://int.eauth.va.gov/ebenefits/coe');
    expect(
      proxyUrl('ebenefits/about/feature?feature=vgli-policy-management'),
    ).to.equal(
      'https://int.eauth.va.gov/isam/sps/saml20idp/saml20/logininitial?PartnerId=https://fedsso-qa.prudential.com/cu&Target=https://giosgli-stage.prudential.com/osgli/Controller/eBenefitsUser',
    );
    expect(
      proxyUrl('ebenefits/about/feature?feature=dependent-compensation'),
    ).to.equal(
      'https://int.eauth.va.gov/ebenefits/vdc?target=%2Fwssweb%2Fwss-686-webparts%2Fdependent.do',
    );
    expect(
      proxyUrl('ebenefits/about/feature?feature=disability-compensation'),
    ).to.equal(
      'https://int.eauth.va.gov/ebenefits/vdc?target=%2Fwssweb%2FVDC526%2Fcompensation.do',
    );
    expect(proxyUrl('ebenefits/manage/representative')).to.equal(
      'https://int.eauth.va.gov/ebenefits/manage/representative',
    );
    expect(proxyUrl('ebenefits-portal/ebenefits.portal')).to.equal(
      'https://int.eauth.va.gov/ebenefits/homepage',
    );
    expect(proxyUrl('ebenefits/download-letters')).to.equal(
      'https://int.eauth.va.gov/ebenefits/download-letters',
    );
  });
});
