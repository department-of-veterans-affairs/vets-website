import React from 'react';
import recordEvent from '../../../../platform/monitoring/record-event';
import isBrandConsolidationEnabled from '../../../../platform/brand-consolidation/feature-flag';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

const propertyName = isBrandConsolidationEnabled() ? 'VA.gov' : 'Vets.gov';

export default function LoginSettings() {
  const idMeAnswer = (
    <p>
      <strong>Note:</strong> ID.me is a digital identity platform that provides
      the strongest identity verification system available to prevent fraud and
      identity theft. We use ID.me to help you create a verified account on{' '}
      {propertyName}
      -or to connect your premium My HealtheVet or DS Logon account to our
      site-as well as to add an extra layer of security to your account.
      <br />
      <a
        href="/faq/#what-is-idme"
        onClick={() =>
          recordEvent({
            event: 'account-navigation',
            'account-action': 'view-link',
            'account-section': 'learn-more-idme',
          })
        }
      >
        Learn more about ID.me
      </a>
    </p>
  );
  return (
    <div>
      <h5>ID.me settings</h5>
      <div>
        <p>
          <a href="https://wallet.id.me/settings" target="_blank">
            Manage your ID.me account.
          </a>
        </p>
        <AdditionalInfo triggerText="What is ID.me?">
          {idMeAnswer}
        </AdditionalInfo>
      </div>
    </div>
  );
}
