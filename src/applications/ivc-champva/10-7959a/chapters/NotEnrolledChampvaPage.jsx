import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import PropTypes from 'prop-types';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
// eslint-disable-next-line @department-of-veterans-affairs/no-cross-app-imports
import champvaApplicationManifest from '../../10-10D/manifest.json';
import {
  CHAMPVA_CLAIMS_ADDRESS,
  CHAMPVA_FAX_NUMBER,
} from '../../shared/constants';

export function NotEnrolledChampvaPage({ goBack }) {
  return (
    <>
      {
        titleUI(
          'You should wait to receive the CHAMPVA benefits enrollment packet in the mail before submitting this form',
          'If you have not applied for CHAMPVA benefits you can apply online, by mail, or by fax. Make sure to submit the required supporting documents with your application.',
        )['ui:title']
      }

      <div>
        <br />
        <va-link
          href="https://www.va.gov/family-and-caregiver-benefits/health-and-disability/champva/#supporting-documents-for-your-application"
          text="Find out what supporting documents you need"
        />

        <h3>Option 1: Online</h3>
        <p>You can apply online now.</p>
        <VaLinkAction
          href={champvaApplicationManifest.rootUrl}
          text="Apply for CHAMPVA online"
        />

        <h3>Option 2: By mail or fax</h3>
        <p>
          You’ll need to fill out an application for CHAMPVA Benefits (VA Form
          10-10d).
        </p>
        <va-link
          href="https://www.va.gov/find-forms/about-form-10-10d/"
          text="Get VA Form 10-10d to download"
        />
        <p>
          Mail your completed form and supporting documents to this address:
        </p>
        {CHAMPVA_CLAIMS_ADDRESS}
        <p>
          Or fax it to: <va-telephone contact={CHAMPVA_FAX_NUMBER} />
        </p>
        <va-link
          href="https://www.va.gov/family-and-caregiver-benefits/health-and-disability/champva/"
          text="Learn about CHAMPVA benefits"
        />
        <div className="vads-u-margin-top--4">
          <va-button back onClick={goBack} full-width />
        </div>
      </div>
    </>
  );
}

NotEnrolledChampvaPage.propTypes = {
  goBack: PropTypes.func,
};
