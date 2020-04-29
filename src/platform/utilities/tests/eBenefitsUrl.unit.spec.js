import { expect } from 'chai';
import sinon from 'sinon';

import * as authSelectors from 'platform/user/authentication/selectors';
import { eBenefitsUrlGenerator } from '../eBenefitsUrl';
import localStorage from 'platform/utilities/storage/localStorage';

describe('eBenefitsUrlGenerator', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('should use default when state is empty/undefined', () => {
    let func = eBenefitsUrlGenerator({});
    expect(func()).to.equal('https://www.ebenefits.va.gov/');
    func = eBenefitsUrlGenerator();
    expect(func()).to.equal('https://www.ebenefits.va.gov/');
  });

  it('should use default function when feature flags are off', () => {
    localStorage.setItem('hasSessionSSO', 'true');
    authSelectors.ssoe = sinon.stub().returns(false);
    authSelectors.ssoeEbenefitsLinks = sinon.stub().returns(false);
    let func = eBenefitsUrlGenerator({});
    expect(func()).to.equal('https://www.ebenefits.va.gov/');
    authSelectors.ssoe = sinon.stub().returns(true);
    authSelectors.ssoeEbenefitsLinks = sinon.stub().returns(false);
    func = eBenefitsUrlGenerator({});
    expect(func()).to.equal('https://www.ebenefits.va.gov/');
    authSelectors.ssoe = sinon.stub().returns(false);
    authSelectors.ssoeEbenefitsLinks = sinon.stub().returns(true);
    func = eBenefitsUrlGenerator({});
    expect(func()).to.equal('https://www.ebenefits.va.gov/');
  });

  it('should use default with a normalized path', () => {
    const func = eBenefitsUrlGenerator({});
    expect(func('path')).to.equal('https://www.ebenefits.va.gov/path');
    expect(func('/path')).to.equal('https://www.ebenefits.va.gov/path');
  });

  it('should use eauth when session is active and flags are on', () => {
    localStorage.setItem('hasSessionSSO', 'true');
    authSelectors.ssoe = sinon.stub().returns(true);
    authSelectors.ssoeEbenefitsLinks = sinon.stub().returns(true);
    const func = eBenefitsUrlGenerator({});
    expect(func()).to.equal('https://int.eauth.va.gov/ebenefits');
  });

  it('should use eauth with a normalized path', () => {
    localStorage.setItem('hasSessionSSO', 'true');
    authSelectors.ssoe = sinon.stub().returns(true);
    authSelectors.ssoeEbenefitsLinks = sinon.stub().returns(true);
    const func = eBenefitsUrlGenerator({});
    expect(func('path')).to.equal('https://int.eauth.va.gov/path');
    expect(func('/path')).to.equal('https://int.eauth.va.gov/path');
  });

  it('should use eauth with mapped paths', () => {
    localStorage.setItem('hasSessionSSO', 'true');
    authSelectors.ssoe = sinon.stub().returns(true);
    authSelectors.ssoeEbenefitsLinks = sinon.stub().returns(true);
    const func = eBenefitsUrlGenerator({});
    expect(
      func('ebenefits/about/feature?feature=request-vso-representative'),
    ).to.equal(
      'https://int.eauth.va.gov/ebenefits/vdc?target=%2Fwssweb%2FVDC2122%2Frepresentative.do',
    );
    expect(
      func(
        'ebenefits/about/feature?feature=hearing-aid-batteries-and-prosthetic-socks',
      ),
    ).to.equal('https://int.eauth.va.gov/ebenefits/OrderMedicalEquip');
    expect(func('ebenefits/about/feature?feature=payment-history')).to.equal(
      'https://int.eauth.va.gov/ebenefits/payments',
    );
    expect(func('ebenefits/vso-search')).to.equal(
      'https://int.eauth.va.gov/ebenefits/vso-search',
    );
    expect(
      func(
        'ebenefits/about/feature?feature=direct-deposit-and-contact-information',
      ),
    ).to.equal('https://int.eauth.va.gov/ebenefits/manage/contact');
    expect(func('ebenefits/about/feature?feature=payment-history')).to.equal(
      'https://int.eauth.va.gov/ebenefits/payments',
    );
    expect(
      func(
        'ebenefits/about/feature?feature=vocational-rehabilitation-and-employment',
      ),
    ).to.equal('https://int.eauth.va.gov/ebenefits/vre');
    expect(func('ebenefits/about/feature?feature=sah-grant')).to.equal(
      'https://int.eauth.va.gov/ebenefits/SAH',
    );
    expect(
      func('ebenefits/about/feature?feature=cert-of-eligibility-home-loan'),
    ).to.equal('https://int.eauth.va.gov/ebenefits/coe');
    expect(
      func('ebenefits/about/feature?feature=vgli-policy-management'),
    ).to.equal(
      'https://int.eauth.va.gov/isam/sps/saml20idp/saml20/logininitial?PartnerId=https://fedsso-qa.prudential.com/cu&Target=https://giosgli-stage.prudential.com/osgli/Controller/eBenefitsUser',
    );
    expect(
      func('ebenefits/about/feature?feature=dependent-compensation'),
    ).to.equal(
      'https://int.eauth.va.gov/ebenefits/vdc?target=%2Fwssweb%2Fwss-686-webparts%2Fdependent.do',
    );
    expect(
      func('ebenefits/about/feature?feature=disability-compensation'),
    ).to.equal(
      'https://int.eauth.va.gov/ebenefits/vdc?target=%2Fwssweb%2FVDC526%2Fcompensation.do',
    );
    expect(func('ebenefits/manage/representative')).to.equal(
      'https://int.eauth.va.gov/ebenefits/manage/representative',
    );
    expect(func('ebenefits-portal/ebenefits.portal')).to.equal(
      'https://int.eauth.va.gov/ebenefits/homepage',
    );
    expect(func('ebenefits/download-letters')).to.equal(
      'https://int.eauth.va.gov/ebenefits/download-letters',
    );
  });
});
