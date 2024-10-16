import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export default function LoginBanners({
  headline = '',
  description = '',
  bannerType = 'info',
  displayDifferentDevice,
  displayAdditionalInfo = true,
  additionalInfoId = '',
}) {
  return (
    <div className="downtime-notification row">
      <div className="usa-width-two-thirds medium-8 columns print-full-width">
        <div className="form-warning-banner fed-warning--v2">
          <va-alert visible status={bannerType}>
            <h2 slot="headline">{headline}</h2>
            <p className="vads-u-margin-top--2">{description}</p>
            {displayAdditionalInfo && (
              <va-additional-info
                id={additionalInfoId}
                trigger="Here's what you can do now"
                disable-border
              >
                {displayDifferentDevice && (
                  <>
                    <ul>
                      <li>
                        Try to sign in from a different browser or device. Use a
                        browser other than Safari (like Edge, Chrome, or
                        Firefox). If you're using an iPhone, iPad, or other
                        Apple device, try a different device (like a laptop or
                        desktop computer).
                      </li>
                      <li>
                        If sign in fails, refresh the page in your browser.
                        Refreshing the page may fix the problem.
                      </li>
                    </ul>
                    <p>
                      If you still have trouble signing in, try again later. Or
                      call us at <va-telephone contact={CONTACTS.HELP_DESK} />{' '}
                      (TTY: <va-telephone contact={CONTACTS['711']} />
                      ). We’re here 24/7.
                    </p>
                  </>
                )}
              </va-additional-info>
            )}
          </va-alert>
          <br />
        </div>
      </div>
    </div>
  );
}
