import React from 'react';

import {
  VaBreadcrumbs,
  VaButton,
  VaSegmentedProgressBar,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { redirect } from '@department-of-veterans-affairs/platform-user/authentication/utilities';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

function SubmitPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const breadcrumbList = [
    { href: '/', label: 'VA.gov home' },
    {
      href: `/find-forms/about-form-${params.id}`,
      label: `About VA Form ${params.id}`,
      isRouterLink: true,
    },
    {
      href: `/form-upload/${params.id}`,
      label: `Upload VA Form ${params.id}`,
      isRouterLink: true,
    },
  ];

  function handleRouteChange({ detail }) {
    const { href } = detail;
    navigate(href);
  }

  let formUploadContent = '';
  if (params.id === '21-0779') {
    formUploadContent =
      'Request for Nursing Home Information in Connection with Claim for Aid and Attendance';
  }

  const submitHandler = () => {
    apiRequest(
      `${environment.API_URL}/simple_forms_api/v1/submit_scanned_form`,
      {
        method: 'POST',
        body: JSON.stringify({
          confirmationCode: state?.confirmationCode,
          formNumber: params.id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then(response => {
      navigate(`/${params.id}/confirmation`, {
        state: { confirmationNumber: response.confirmationNumber },
      });
    });
  };

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <VaBreadcrumbs
        breadcrumbList={breadcrumbList}
        onRouteChange={handleRouteChange}
      />
      <h1>{`Upload VA Form ${params.id}`}</h1>
      <p>{formUploadContent}</p>
      <div>
        <VaSegmentedProgressBar
          current={3}
          total={3}
          labels="Upload your file;Review your information;Submit your form"
        />
      </div>
      <div className="vads-u-display--flex vads-u-border-bottom--2px vads-u-justify-content--space-between vads-u-align-items--center">
        <h3>Uploaded file</h3>
        <Link to="upload">Change file</Link>
      </div>

      <div className="vads-u-border-bottom--2px">
        <h3>Your personal information</h3>
      </div>
      <p>
        <b>Ziggy Ignots</b>
      </p>
      <p>Social Security number: ***-**-2139</p>
      <p>VA file number: ***-**-8355</p>
      <p>Zip code: 12590</p>
      <p>
        <b>Note:</b> If you need to update your personal information, please
        call us at 800-827-1000. We’re here Monday through Friday, 8:00am to
        9:00pm ET.
      </p>
      <span>
        <VaButton
          secondary
          text="<< Back"
          onClick={() => redirect(`/form-upload/${params.id}/review`)}
        />
        <VaButton primary text="Submit form" onClick={submitHandler} />
      </span>
      <div className="need-help-footer">
        <h2 className="vads-u-padding-bottom--0p5 vads-u-font-size--h3 vads-u-border-bottom--2px vads-u-border-color--primary">
          Need help?
        </h2>
        <p>
          You can call us at <va-telephone contact="8772228387" /> (
          <va-telephone contact="8008778339" tty />
          ). We’re here Monday through Friday, 8:00 a.m to 9:00 p.m ET.
        </p>
      </div>
    </div>
  );
}

SubmitPage.propTypes = {
  params: PropTypes.shape({ id: PropTypes.string.isRequired }),
};

export default SubmitPage;
