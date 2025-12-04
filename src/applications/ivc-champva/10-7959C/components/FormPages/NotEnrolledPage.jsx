import React from 'react';
import PropTypes from 'prop-types';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { isMinimalHeaderApp } from 'platform/forms-system/src/js/patterns/minimal-header';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import {
  CHAMPVA_FAX_NUMBER,
  CHAMPVA_ELIGIBILITY_ADDRESS,
} from '../../../shared/constants';
import { APP_URLS } from '../../helpers/appUrls';

const NotEnrolledPage = ({ goBack }) => (
  <form className="rjsf" noValidate>
    {
      titleUI(
        'You should wait to receive the CHAMPVA benefits enrollment packet in the mail before submitting this form',
      )['ui:title']
    }
    <p>
      If you have not applied for CHAMPVA benefits you can apply online, by
      mail, or by fax. Make sure to submit the required supporting documents
      with your application.
    </p>
    <p>
      <va-link
        href="/family-and-caregiver-benefits/health-and-disability/champva/#supporting-documents-for-your-"
        text="Find out what supporting documents you need"
      />
    </p>
    <h3>
      <strong>Option 1: Online</strong>
    </h3>
    <p>You can apply online now.</p>
    <p>
      <va-link-action
        href={APP_URLS['1010d']}
        text="Apply for CHAMPVA online"
      />
    </p>
    <h3>
      <strong>Option 2: By mail or fax</strong>
    </h3>
    <p>
      You’ll need to fill out an application for CHAMPVA Benefits (VA Form
      10-10d).
    </p>
    <p>
      <va-link
        href="/find-forms/about-form-10-10d/"
        text="Get VA Form 10-10d to download"
      />
    </p>
    <p>Mail your completed form and supporting documents to this address:</p>

    {CHAMPVA_ELIGIBILITY_ADDRESS}

    <p>
      Or fax it to: <va-telephone contact={CHAMPVA_FAX_NUMBER} />
    </p>
    <p>
      <va-link
        href="/family-and-caregiver-benefits/health-and-disability/champva/"
        text="Learn about CHAMPVA benefits"
      />
    </p>

    {!isMinimalHeaderApp() && (
      <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--2">
        <div className="small-6 medium-5 columns">
          <ProgressButton
            buttonClass="usa-button-secondary"
            onButtonClick={goBack}
            buttonText="Back"
            beforeText="«"
          />
        </div>
      </div>
    )}
  </form>
);

NotEnrolledPage.propTypes = {
  goBack: PropTypes.func,
};

export default NotEnrolledPage;
