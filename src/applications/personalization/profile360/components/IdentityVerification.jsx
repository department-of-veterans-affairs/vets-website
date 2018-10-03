import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';
import isBrandConsolidationEnabled from '../../../../platform/brand-consolidation/feature-flag';

const propertyName = isBrandConsolidationEnabled() ? 'VA.gov' : 'Vets.gov';

export default function IdentityVerification({
  learnMoreClick,
  faqClick,
  verifyClick,
}) {
  return (
    <div>
      <h1>Verify Your Identity to View Your Profile</h1>
      <p>
        We need to make sure you’re you—and not someone pretending to be
        you—before we give you access to your personal and health-related
        information. This helps to keep your information safe and prevent fraud
        and identity theft.
      </p>
      <p>
        <strong>This one-time process takes about 5-10 minutes.</strong>
      </p>

      <div>
        <div onClick={learnMoreClick}>
          <AdditionalInfo
            triggerText={`How will ${propertyName} verify my identity?`}
          >
            <p>
              We use ID.me, our Veteran-owned technology partner that provides
              the strongest identity verification system available to prevent
              fraud and identity theft.
            </p>
            <p>
              <strong>
                To verify your identity, you’ll need both of these:
              </strong>
              <ul>
                <li>
                  A smartphone (or a landline or mobile phone and a computer
                  with an Internet connection), <strong>and</strong>
                </li>
                <li>Your Social Security number</li>
              </ul>
            </p>
            <p>
              <strong>You’ll also need one of these:</strong>
              <ul>
                <li>
                  A digital image of your driver’s license or passport,{' '}
                  <strong>or</strong>
                </li>
                <li>
                  The ability to answer certain questions based on private and
                  public data (like your credit report or mortgage history) to
                  prove you’re you
                </li>
              </ul>
            </p>
          </AdditionalInfo>
        </div>
        <br />
        <a
          className="usa-button-primary va-button-primary"
          href="/verify"
          onClick={verifyClick}
        >
          <img alt="ID.me" src="/img/signin/idme-icon-white.svg" />
          <strong> Verify with ID.me</strong>
        </a>
        <h4>What if I’m having trouble verifying my identity?</h4>
        <p>
          <a href="/faq/" target="_blank" onClick={faqClick}>
            Get answers to Frequently Asked Questions
          </a>
        </p>
        <p>
          Or call the {propertyName} Help Desk at{' '}
          <a href="tel:855-574-7286">1-855-574-7286</a> (TTY:{' '}
          <a href="tel:18008778339">1-800-877-8339</a>
          ). We’re here Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET)
        </p>
      </div>
    </div>
  );
}
