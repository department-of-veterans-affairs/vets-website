import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import PmcModalContent from 'platform/forms/components/OMBInfoModalContent/PmcModalContent';
import { IntroductionPageView } from '../../shared/components/IntroductionPageView';
import { trackNoAuthStartLinkClick } from '../helpers';

const content = {
  formTitle: 'Request a Presidential Memorial Certificate',
  formSubTitle:
    'Presidential Memorial Certificate request form (VA Form 40-0247)',
  hideSipIntro: true, // hide <SaveInProgressIntro> [disable authd-exp]
};

// replace <SaveInProgressIntro> with no-auth start-link below
const additionalChildContent = (
  <Link
    onClick={trackNoAuthStartLinkClick}
    to="/veteran-personal-information"
    className="no-auth-start-link vads-c-action-link--green"
  >
    Start your request
  </Link>
);

const ombInfo = {
  resBurden: '3',
  ombNumber: '2900-0567',
  expDate: '8/31/2026',
  customPrivacyActStmt: <PmcModalContent />,
};

const childContent = (
  <>
    <h2 className="vad-u-margin-top--0">Follow these steps to get started</h2>
    <va-process-list uswds>
      <va-process-list-item header="Check the Veteran’s or Reservist’s eligibility">
        <p>
          You can request a certificate for a deceased Veteran or Reservist who
          was your family member or close friend.
        </p>
        <p>
          To be eligible for a Presidential Memorial Certificate, the deceased
          Veteran or Reservist must meet eligibility requirements for burial in
          a VA national cemetery.
        </p>
        <p>Not sure if the Veteran or Reservist is eligible?</p>
        <p>
          <a href="/burials-memorials/eligibility/">
            Check eligibility requirements for burial in a VA national cemetery
          </a>
        </p>
        <p>
          <strong>Note</strong>: If the Veteran or Reservist is buried in a
          national cemetery, we’ll automatically present a Presidential Memorial
          Certificate to the next of kin at the burial. If the Veteran or
          Reservist is eligible for burial in a national cemetery but is instead
          buried in a private cemetery, you can request a Presidential Memorial
          Certificate. We’ll accept multiple requests for certificates.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Gather the Veteran’s or Reservist’s information">
        <p>
          We don’t require that you submit anything with this form. But to speed
          up the process, we encourage you to submit these documents if they’re
          available:
        </p>
        <ul>
          <li>Military records</li>
          <li>Discharge documents (we prefer DD214).</li>
        </ul>
        <p>
          <strong>Note</strong>: Don’t send original documents since we can’t
          return them.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Fill out the request">
        <p>
          Complete this request form. After submitting the form, you’ll get a
          confirmation message. You can print this page for your records.
        </p>
        <va-additional-info trigger="What happens after I submit the form?">
          <div>
            After we receive your request, we’ll verify if the Veteran or
            Reservist is eligible. Then we’ll mail you the certificates you
            requested.
          </div>
        </va-additional-info>
      </va-process-list-item>
    </va-process-list>
  </>
);

export const IntroductionPage = ({ route }) => {
  return (
    <IntroductionPageView
      route={route}
      content={content}
      ombInfo={ombInfo}
      childContent={childContent}
      additionalChildContent={additionalChildContent}
    />
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default IntroductionPage;
