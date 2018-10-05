import React from 'react';
import recordEvent from '../../../../platform/monitoring/record-event';
import isBrandConsolidationEnabled from '../../../../platform/brand-consolidation/feature-flag';

const propertyName = isBrandConsolidationEnabled() ? 'VA.gov' : 'Vets.gov';

export default function TermsAndConditions({ mhvAccount }) {
  const termsConditionsUrl =
    '/health-care/medical-information-terms-conditions';
  let content = null;

  if (mhvAccount.termsAndConditionsAccepted) {
    content = (
      <p>
        <i className="fa fa-check-circle" /> You’ve accepted the latest{' '}
        <a
          href={termsConditionsUrl}
          onClick={() =>
            recordEvent({
              event: 'account-navigation',
              'account-action': 'view-link',
              'account-section': 'terms',
            })
          }
        >
          Terms and Conditions for Medical Information
        </a>
        .
      </p>
    );
  } else if (mhvAccount.accountState === 'needs_terms_acceptance') {
    content = (
      <div>
        <div className="usa-alert usa-alert-info no-background-image">
          <p>
            <strong>
              Want to use {propertyName} health tools to do things like refill
              your VA prescriptions?
            </strong>
          </p>
          <p>
            To get started, you’ll need to read and agree to the{' '}
            <a
              href={termsConditionsUrl}
              onClick={() =>
                recordEvent({
                  event: 'account-navigation',
                  'account-action': 'view-link',
                  'account-section': 'terms',
                })
              }
            >
              Terms and Conditions for Medical Information
            </a>
            . This will give us your permission to show you your VA medical
            information on this site.
          </p>
        </div>
        <p>
          Once you agree to these Terms and Conditions, you’ll be able to use{' '}
          {propertyName} health tools to:
        </p>
        <ul>
          <li>Refill your VA prescriptions</li>
          <li>Download your VA health records</li>
          <li>Share secure messages with your health care team</li>
        </ul>
        <p>
          Go to the{' '}
          <a
            href={termsConditionsUrl}
            onClick={() =>
              recordEvent({
                event: 'account-navigation',
                'account-action': 'view-link',
                'account-section': 'terms',
              })
            }
          >
            Terms and Conditions for Health Tools
          </a>
        </p>
      </div>
    );
  }

  return (
    content && (
      <div>
        <h3>Terms and conditions</h3>
        {content}
      </div>
    )
  );
}
